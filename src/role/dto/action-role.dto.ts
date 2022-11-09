import { Role } from "@prisma/client"
import { IsEnum, IsNumber } from "class-validator"

export class ActionRoleDto {
	@IsNumber({}, { message: "UserId should be a number" })
	userId: number

	@IsEnum(Role)
	role: Role
}
