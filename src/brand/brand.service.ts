import { Injectable } from "@nestjs/common"
import { Brand } from "@prisma/client"
import { PrismaService } from "nestjs-prisma"

@Injectable()
export class BrandService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAllBrands(): Promise<Brand[]> {
		return this.prismaService.brand.findMany()
	}

	async createBrand(dto: { name: string }): Promise<Brand> {
		return this.prismaService.brand.create({
			data: dto,
		})
	}

	async deleteBrand(brandId: number): Promise<Brand> {
		return this.prismaService.brand.delete({
			where: { id: brandId },
		})
	}
}
