import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ServeStaticModule } from "@nestjs/serve-static"
import { path } from "app-root-path"
import { AuthModule } from "src/auth/auth.module"
import { FileController } from "./file.controller"
import { FileService } from "./file.service"

@Module({
	controllers: [FileController],
	providers: [FileService],
	imports: [
		ConfigModule,
		AuthModule,
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: "/uploads",
		}),
	],
	exports: [FileService],
})
export class FileModule {}
