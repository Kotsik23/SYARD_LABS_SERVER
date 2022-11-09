import { Injectable } from "@nestjs/common"
import { Role, User } from "@prisma/client"
import { PrismaService } from "nestjs-prisma"

@Injectable()
export class RoleService {
	constructor(private readonly prismaService: PrismaService) {}

	async addRoleToUser(userId: number, role: Role): Promise<User> {
		const user = await this.prismaService.user.findUniqueOrThrow({ where: { id: userId } })

		return this.prismaService.user.update({
			where: { id: userId },
			data: {
				roles: {
					set: user.roles.includes(role) ? user.roles : [...user.roles, role],
				},
			},
		})
	}

	async removeRoleFromUser(userId: number, role: Role): Promise<User> {
		const user = await this.prismaService.user.findUniqueOrThrow({ where: { id: userId } })

		return this.prismaService.user.update({
			where: { id: userId },
			data: {
				roles: {
					set: user.roles.filter(userRole => userRole !== role),
				},
			},
		})
	}
}
