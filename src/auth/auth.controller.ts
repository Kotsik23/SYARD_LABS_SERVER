import { Body, Controller, Delete, Get, Patch, Post, Req, Res, ValidationPipe } from "@nestjs/common"
import { Request, Response } from "express"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { UpdateProfileDto } from "src/user/dto/update-profile.dto"
import { UserService } from "src/user/user.service"
import { AuthService } from "./auth.service"
import { CurrentUserDecorator } from "./decorators/current-user.decorator"
import { Auth } from "./guards/auth.guard"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

	@Post("register")
	async register(@Body(new ValidationPipe()) dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.register(dto, res)
	}

	@Post("login")
	async login(@Body(new ValidationPipe()) dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(dto, res)
	}

	@Get("refresh")
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.refresh(req, res)
	}

	@Get("profile")
	async getProfile(@Req() req: Request) {
		return this.authService.getProfile(req)
	}

	@Auth()
	@Patch("profile")
	async updateProfile(@CurrentUserDecorator("id") id: string, @Body() dto: UpdateProfileDto) {
		return this.userService.updateProfile(+id, dto)
	}

	@Post("profile")
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req, res)
	}
}
