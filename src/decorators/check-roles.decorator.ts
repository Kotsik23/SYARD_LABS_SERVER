import { applyDecorators, UseGuards } from "@nestjs/common"
import { Role } from "@prisma/client"
import { RolesGuard } from "src/guards/roles.guard"
import { RolesDecorator } from "./roles.decorator"

export const CheckRolesDecorator = (...roles: Role[]) => {
	return applyDecorators(RolesDecorator(...roles), UseGuards(RolesGuard))
}
