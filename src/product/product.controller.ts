import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
	ValidationPipe,
} from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express"
import { Role } from "@prisma/client"
import { Auth } from "src/auth/guards/auth.guard"
import { CheckRolesDecorator } from "src/decorators/check-roles.decorator"
import { CreateProductDto } from "./dto/create-product.dto"
import { ProductService } from "./product.service"

@Controller("products")
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Post()
	@UseInterceptors(FilesInterceptor("image"))
	async createProduct(@Body() dto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
		return this.productService.createProduct(
			{
				name: dto.name,
				price: Number(dto.price),
				typeId: Number(dto.typeId),
				brandId: Number(dto.brandId),
			},
			files
		)
	}

	@Get()
	async getAllProducts(
		@Query("type") type?: string,
		@Query("brand") brand?: string,
		@Query("order") order?: "asc" | "desc"
	) {
		return this.productService.getAllProducts(brand, type, order)
	}

	@Get(":id")
	async getProductById(@Param("id") id: string) {
		return this.productService.getProductById(+id)
	}
}
