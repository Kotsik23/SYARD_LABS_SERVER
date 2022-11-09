import { HttpAdapterHost, NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import { AppModule } from "./app.module"
import { PrismaClientExceptionFilter } from "nestjs-prisma"

async function bootstrap() {
	const PORT = process.env.PORT || 8001

	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix("api")
	app.use(cookieParser())
	app.enableCors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
	const { httpAdapter } = app.get(HttpAdapterHost)
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

	await app.listen(PORT)
}
bootstrap()
