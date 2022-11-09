import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common"
import { Role } from "@prisma/client"
import { Auth } from "src/auth/guards/auth.guard"
import { CheckRolesDecorator } from "src/decorators/check-roles.decorator"
import { ActionRoleDto } from "./dto/action-role.dto"
import { RoleService } from "./role.service"

@UsePipes(new ValidationPipe())
@Controller("roles")
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN)
	@Post("add")
	async addRole(@Body() dto: ActionRoleDto) {
		return this.roleService.addRoleToUser(dto.userId, dto.role)
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN)
	@Post("remove")
	async removeRole(@Body() dto: ActionRoleDto) {
		return this.roleService.removeRoleFromUser(dto.userId, dto.role)
	}
}
