export type SerializedCustomer = {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	address: string | null;
	notes: string | null;
	isGuild: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
};
