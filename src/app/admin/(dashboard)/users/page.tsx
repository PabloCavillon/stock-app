import { getUsers } from "@/actions/users";
import { PageLayout } from "@/components/ui/layout-page";
import UsersTable from "@/components/user/users-table";
import { Users } from "lucide-react";

export const metadata = {
    title: 'Usuario',
}

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <PageLayout
            title="Usuarios"
            subtitle={`${users.length} usuarios en total`}
            icon={Users}
            buttonText="Nuevo Usuario"
            buttonHref="/users/new"
        >
            <UsersTable users={users} />
        </PageLayout>
    );
}