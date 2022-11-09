import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from "@nestjs/common"
import { Role } from "@prisma/client"
import { Auth } from "src/auth/guards/auth.guard"
import { CheckRolesDecorator } from "src/decorators/check-roles.decorator"
import { BanUserDto } from "./dto/ban-user.dto"
import { UserService } from "./user.service"

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Get()
	async getAllUsers() {
		return this.userService.getAllUsers()
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Get(":id")
	async getUserById(@Param("id") id: string) {
		return this.userService.getUserById(+id)
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN)
	@Post("ban")
	async toggleBanUser(@Body(new ValidationPipe()) dto: BanUserDto) {
		return this.userService.banUser(dto)
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN)
	@Delete(":id")
	async deleteUser(@Param("id") id: string) {
		return this.userService.deleteUser(+id)
	}
}
