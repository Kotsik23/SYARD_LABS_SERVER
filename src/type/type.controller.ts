import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common"
import { Role } from "@prisma/client"
import { Auth } from "src/auth/guards/auth.guard"
import { CheckRolesDecorator } from "src/decorators/check-roles.decorator"
import { TypeService } from "./type.service"

@Controller("types")
export class TypeController {
	constructor(private readonly typeService: TypeService) {}

	@Get()
	async getAllTypes() {
		return this.typeService.getAllTypes()
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Post()
	async createType(@Body() dto: { name: string }) {
		return this.typeService.createType(dto)
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Delete(":id")
	async deleteType(@Param("id") id: string) {
		return this.typeService.deleteType(+id)
	}
}
