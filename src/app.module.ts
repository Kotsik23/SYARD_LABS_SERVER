import { Module } from "@nestjs/common"
import { PrismaModule } from "nestjs-prisma"
import { AuthModule } from "./auth/auth.module"
import { FileModule } from "./file/file.module"
import { RoleModule } from "./role/role.module"
import { UserModule } from "./user/user.module"
import { ProductModule } from './product/product.module';
import { TypeModule } from './type/type.module';
import { BrandModule } from './brand/brand.module';

@Module({
	imports: [PrismaModule.forRoot(), RoleModule, UserModule, AuthModule, FileModule, ProductModule, TypeModule, BrandModule],
})
export class AppModule {}
