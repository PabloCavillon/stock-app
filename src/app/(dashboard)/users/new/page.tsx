import UserForm from "@/components/user/user-form";

export const metadata = {
    title: 'Nuevo usuario',
}

export default function NewUserPage() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">New user</h1>
                <p className="text-sm text-gray-500 mt-0.5">Create a new system user</p>
            </div>
            <UserForm />
        </div>
    );
}