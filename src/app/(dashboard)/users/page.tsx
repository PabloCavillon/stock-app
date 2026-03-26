import { getUsers } from "@/actions/users";
import UsersTable from "@/components/user/users-table";
import Link from "next/link";

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{users.length} users total</p>
                </div>
                <Link
                    href="/users/new"
                    className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Add user
                </Link>
            </div>
            <UsersTable users={users} />
        </div>
    );
}