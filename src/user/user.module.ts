import { forwardRef, Module } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { AuthModule } from "src/auth/auth.module"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService],
	exports: [UserService],
	imports: [forwardRef(() => AuthModule)],
})
export class UserModule {}
