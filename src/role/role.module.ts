import { Module } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { AuthModule } from "src/auth/auth.module"
import { RoleController } from "./role.controller"
import { RoleService } from "./role.service"

@Module({
	controllers: [RoleController],
	providers: [RoleService, PrismaService],
	imports: [AuthModule],
})
export class RoleModule {}
