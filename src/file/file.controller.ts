import { Controller, HttpCode, HttpStatus, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express"
import { Role } from "@prisma/client"
import { Auth } from "src/auth/guards/auth.guard"
import { CheckRolesDecorator } from "src/decorators/check-roles.decorator"
import { FileService } from "./file.service"

@Controller("files")
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Auth()
	@CheckRolesDecorator(Role.ADMIN, Role.MANAGER)
	@Post()
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FilesInterceptor("poster"))
	async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Query("folder") folder?: string) {
		return this.fileService.uploadFiles(files, folder)
	}
}
