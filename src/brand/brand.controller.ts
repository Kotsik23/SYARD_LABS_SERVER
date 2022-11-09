import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common"
import { Role } from "@prisma/client"
import { Auth } from "src/auth/guards/auth.guard"
import { CheckRolesDecorator } from "src/decorators/check-roles.decorator"
import { BrandService } from "./brand.service"

@Controller("brands")
export class BrandController {
	constructor(private readonly brandService: BrandService) {}

	@Get()
	async getAllTypes() {
		return this.brandService.getAllBrands()
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Post()
	async createType(@Body() dto: { name: string }) {
		return this.brandService.createBrand(dto)
	}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Delete(":id")
	async deleteType(@Param("id") id: string) {
		return this.brandService.deleteBrand(+id)
	}
}
