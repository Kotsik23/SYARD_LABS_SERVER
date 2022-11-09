import { Module } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { AuthModule } from "src/auth/auth.module"
import { TypeController } from "./type.controller"
import { TypeService } from "./type.service"

@Module({
	controllers: [TypeController],
	providers: [TypeService, PrismaService],
	imports: [AuthModule],
})
export class TypeModule {}
