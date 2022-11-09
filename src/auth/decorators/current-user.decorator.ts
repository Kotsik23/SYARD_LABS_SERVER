import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"

export const CurrentUserDecorator = createParamDecorator((data: keyof User, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest<Request>()

	const user = request.user

	return data ? user[data] : user
})
