import { User } from "@prisma/client"

export interface IAuthResponse {
	user: Omit<User, "password">
	accessToken: string
}
