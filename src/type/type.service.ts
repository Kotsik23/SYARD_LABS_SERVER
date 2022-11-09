import { Injectable } from "@nestjs/common"
import { Type } from "@prisma/client"
import { PrismaService } from "nestjs-prisma"

@Injectable()
export class TypeService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAllTypes(): Promise<Type[]> {
		return this.prismaService.type.findMany()
	}

	async createType(dto: { name: string }): Promise<Type> {
		return this.prismaService.type.create({
			data: dto,
		})
	}

	async deleteType(typeId: number): Promise<Type> {
		return this.prismaService.type.delete({
			where: { id: typeId },
		})
	}
}
