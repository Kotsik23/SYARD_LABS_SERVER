import { Injectable } from "@nestjs/common"
import { Product } from "@prisma/client"
import { PrismaService } from "nestjs-prisma"
import { FileService } from "src/file/file.service"
import { CreateProductDto } from "./dto/create-product.dto"

@Injectable()
export class ProductService {
	constructor(private readonly prismaService: PrismaService, private readonly fileService: FileService) {}

	async createProduct(dto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
		const image = await this.fileService.uploadFiles(files, "products")

		return this.prismaService.product.create({
			data: {
				...dto,
				image: image[0].url,
			},
		})
	}

	async getAllProducts(brand?: string, type?: string, order?: "asc" | "desc"): Promise<Product[]> {
		let options = {}

		if (brand && type) {
			options = {
				AND: [{ brand: { name: brand } }, { type: { name: type } }],
			}
		} else if (brand || type) {
			options = {
				OR: [{ brand: { name: brand } }, { type: { name: type } }],
			}
		} else {
			options = undefined
		}

		return this.prismaService.product.findMany({
			where: options,
			orderBy: order && [{ price: order }],
			include: {
				brand: true,
				type: true,
			},
		})
	}

	async getProductById(id: number): Promise<Product> {
		return this.prismaService.product.findUniqueOrThrow({
			where: { id },
			include: {
				brand: true,
				type: true,
			},
		})
	}
}
