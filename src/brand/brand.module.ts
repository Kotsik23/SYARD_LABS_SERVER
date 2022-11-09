import { Module } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { AuthModule } from "src/auth/auth.module"
import { BrandController } from "./brand.controller"
import { BrandService } from "./brand.service"

@Module({
	controllers: [BrandController],
	providers: [BrandService, PrismaService],
	imports: [AuthModule],
})
export class BrandModule {}
