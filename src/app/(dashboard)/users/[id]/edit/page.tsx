import { getUser } from "@/actions/users";
import UserForm from "@/components/user/user-form";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const user = await getUser(id)

    if (!user) notFound()

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Edit user</h1>
                <p className="text-sm text-gray-500 mt-0.5">{user.username}</p>
            </div>
            <UserForm user={user} />
        </div>
    );
}