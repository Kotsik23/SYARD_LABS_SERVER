import { IsNumber, IsString } from "class-validator"

export class BanUserDto {
	@IsNumber({}, { message: "UserId should be a number" })
	userId: number

	@IsString({ message: "Ban reason should be a string" })
	banReason: string
}
