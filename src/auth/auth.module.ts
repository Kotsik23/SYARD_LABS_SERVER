import { forwardRef, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { getJwtConfig } from "src/configs/jwt.config"
import { UserModule } from "src/user/user.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategy/jwt.strategy"

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
		forwardRef(() => UserModule),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
