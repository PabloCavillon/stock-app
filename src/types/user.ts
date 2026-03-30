import { Role } from "@/generated/prisma/enums";

export type SerializedUser = {
	id: string;
	username: string;
	role: Role;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
};