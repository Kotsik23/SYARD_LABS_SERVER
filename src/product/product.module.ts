import { Module } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { AuthModule } from "src/auth/auth.module"
import { FileModule } from "src/file/file.module"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service"

@Module({
	controllers: [ProductController],
	providers: [ProductService, PrismaService],
	imports: [AuthModule, FileModule],
})
export class ProductModule {}
