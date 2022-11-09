import { IsEmail, IsString, MinLength } from "class-validator"

export class CreateUserDto {
	@IsEmail({}, { message: "Please provide a correct email" })
	email: string

	@MinLength(4, { message: "Password is too short. Min 4 characters" })
	@IsString()
	password: string
}
