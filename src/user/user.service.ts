import { BadRequestException, Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import { genSalt, hash } from "bcrypt"
import { PrismaService } from "nestjs-prisma"
import { BanUserDto } from "./dto/ban-user.dto"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateProfileDto } from "./dto/update-profile.dto"

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async createUser(dto: CreateUserDto): Promise<User> {
		return this.prismaService.user.create({
			data: {
				email: dto.email,
				passwordHash: dto.password,
			},
		})
	}

	async getAllUsers(): Promise<User[]> {
		return this.prismaService.user.findMany()
	}

	async getUserById(id: number): Promise<User> {
		return await this.prismaService.user.findUniqueOrThrow({
			where: { id },
		})
	}

	async getUserByEmail(email: string): Promise<User> {
		return this.prismaService.user.findUnique({ where: { email } })
	}

	async updateUser(id: number, dto: Prisma.UserUpdateInput): Promise<User> {
		return this.prismaService.user.update({
			where: { id },
			data: dto,
		})
	}

	async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
		if (dto.email) {
			const isExist = await this.getUserByEmail(dto.email)

			if (isExist) throw new BadRequestException("Such email is already exists")

			return this.updateUser(userId, { email: dto.email })
		}

		const salt = await genSalt(5)
		const passwordHash = await hash(dto.password, salt)

		return this.updateUser(userId, { passwordHash })
	}

	async deleteUser(id: number): Promise<User> {
		try {
			const userData = this.prismaService.user.delete({ where: { id } })
			return userData
		} catch (error) {
			console.log("LOGGED ERROR", error)
		}
	}

	async banUser(dto: BanUserDto): Promise<User> {
		const user = await this.getUserById(dto.userId)

		return this.prismaService.user.update({
			where: { id: dto.userId },
			data: {
				isBanned: user.isBanned ? false : true,
				banReason: user.banReason ? null : dto.banReason,
			},
		})
	}

	async setRefreshTokenHash(userId: number, refreshToken: string) {
		const salt = await genSalt(5)
		const hashedRt = await hash(refreshToken, salt)

		return this.prismaService.user.update({
			where: { id: userId },
			data: {
				refreshTokenHash: hashedRt,
			},
		})
	}

	async removeRefreshTokenHash(userId: number) {
		return this.prismaService.user.update({
			where: { id: userId },
			data: {
				refreshTokenHash: null,
			},
		})
	}
}
