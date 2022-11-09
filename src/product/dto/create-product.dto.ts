import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateProductDto {
	@IsString()
	name: string

	@IsNumberString()
	price: number

	@IsNumberString()
	typeId: number

	@IsNumberString()
	brandId: number
}
