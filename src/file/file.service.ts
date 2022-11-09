import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { path } from "app-root-path"
import { ensureDir, writeFile } from "fs-extra"
import { IFile } from "./interfaces/file.interface"

@Injectable()
export class FileService {
	constructor(private readonly configService: ConfigService) {}

	async uploadFiles(files: Express.Multer.File[], folder: string = "default"): Promise<IFile[]> {
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)

		const serverUrl = this.configService.get("SERVER_URL")

		const response = await Promise.all(
			files.map(async file => {
				await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)
				return {
					url: `${serverUrl}/uploads/${folder}/${file.originalname}`,
				}
			})
		)

		return response
	}
}
