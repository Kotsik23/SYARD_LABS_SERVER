import { IsEmail, IsOptional, IsString, MinLength } from "class-validator"

export class UpdateProfileDto {
	@IsOptional()
	@IsEmail({}, { message: "Please provide a correct email" })
	email?: string

	@IsOptional()
	@IsString({ message: "Password should be a string" })
	@MinLength(4, { message: "Password is too short. Min 4 characters" })
	password?: string
}
