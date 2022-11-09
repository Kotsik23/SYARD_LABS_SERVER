import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Role, User } from "@prisma/client"
import { compare, genSalt, hash } from "bcrypt"
import { Response, Request } from "express"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { UserService } from "src/user/user.service"
import { IAuthResponse } from "./interfaces/auth-response.interface"

@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

	async register(dto: CreateUserDto, res: Response): Promise<IAuthResponse> {
		const candidate = await this.userService.getUserByEmail(dto.email)

		if (candidate) {
			throw new BadRequestException("Such user is already exists")
		}

		const salt = await genSalt(5)
		const passwordHash = await hash(dto.password, salt)

		const user = await this.userService.createUser({
			email: dto.email,
			password: passwordHash,
		})

		const tokens = await this.generateTokens({ id: user.id, roles: user.roles })

		await this.userService.setRefreshTokenHash(user.id, tokens.refreshToken)
		this.setRefreshTokenToCookie(res, tokens.refreshToken)

		return {
			user: this.clearUserFields(user),
			accessToken: tokens.accessToken,
		}
	}

	async login(dto: CreateUserDto, res: Response): Promise<IAuthResponse> {
		const user = await this.validateUser(dto)

		const tokens = await this.generateTokens({ id: user.id, roles: user.roles })

		await this.userService.setRefreshTokenHash(user.id, tokens.refreshToken)
		this.setRefreshTokenToCookie(res, tokens.refreshToken)

		return {
			user: this.clearUserFields(user),
			accessToken: tokens.accessToken,
		}
	}

	async logout(req: Request, res: Response) {
		const refreshToken = req.cookies.jwtRefreshToken

		if (!refreshToken) {
			throw new HttpException("No content", HttpStatus.NO_CONTENT)
		}

		const userFromToken = await this.jwtService.verify(refreshToken)

		if (!userFromToken) {
			throw new UnauthorizedException("Unauthorized")
		}

		await this.userService.removeRefreshTokenHash(userFromToken.id)

		res.clearCookie("jwtRefreshToken", { httpOnly: true })

		return { message: "Successfully logged out" }
	}

	async refresh(req: Request, res: Response): Promise<IAuthResponse> {
		try {
			const refreshToken = req.cookies?.jwtRefreshToken

			if (!refreshToken) {
				throw new UnauthorizedException("Unauthorized")
			}

			const userFromToken = await this.jwtService.verify(refreshToken)
			const user = await this.userService.getUserById(userFromToken.id)

			if (!userFromToken || !user) {
				throw new UnauthorizedException("Unauthorized")
			}

			const isRtMatches = await compare(refreshToken, user.refreshTokenHash)

			if (!isRtMatches) {
				throw new UnauthorizedException("Unauthorized")
			}

			const tokens = await this.generateTokens({ id: user.id, roles: user.roles })
			await this.userService.setRefreshTokenHash(user.id, tokens.refreshToken)
			this.setRefreshTokenToCookie(res, tokens.refreshToken)

			return {
				user: this.clearUserFields(user),
				accessToken: tokens.accessToken,
			}
		} catch (error) {
			throw new UnauthorizedException(error.message)
		}
	}

	async getProfile(req: Request) {
		try {
			const user = await this.checkRefreshToken(req)

			return {
				user: this.clearUserFields(user),
			}
		} catch (error) {
			throw new UnauthorizedException(error.message)
		}
	}

	private async checkRefreshToken(req: Request): Promise<User> {
		const refreshToken = req.cookies?.jwtRefreshToken

		if (!refreshToken) {
			throw new UnauthorizedException("Unauthorized")
		}

		const userFromToken = await this.jwtService.verify(refreshToken)
		const user = await this.userService.getUserById(userFromToken.id)

		if (!userFromToken || !user) {
			throw new UnauthorizedException("Unauthorized")
		}

		return user
	}

	private setRefreshTokenToCookie(res: Response, refreshToken: string): Response {
		return res.cookie("jwtRefreshToken", refreshToken, {
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		})
	}

	private async generateTokens(payload: { id: number; roles: Role[] }) {
		const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" })
		const refreshToken = this.jwtService.sign(payload, { expiresIn: "30d" })

		return {
			accessToken,
			refreshToken,
		}
	}

	private async validateUser(dto: CreateUserDto): Promise<User> {
		const user = await this.userService.getUserByEmail(dto.email)

		if (!user) {
			throw new BadRequestException("Invalid email or password")
		}

		const passwordEquals = await compare(dto.password, user.passwordHash)

		if (!passwordEquals) {
			throw new BadRequestException("Invalid email or password")
		}

		return user
	}

	private clearUserFields(user: User) {
		delete user.passwordHash
		delete user.refreshTokenHash
		return user
	}
}
