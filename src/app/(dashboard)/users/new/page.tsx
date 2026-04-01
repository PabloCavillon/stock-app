import UserForm from "@/components/user/user-form";

export const metadata = {
    title: 'Nuevo usuario',
}

export default function NewUserPage() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Nuevo usuario</h1>
                <p className="text-sm text-gray-500 mt-0.5">Crear nuevo usuario del sistema</p>
            </div>
            <UserForm />
        </div>
    );
}