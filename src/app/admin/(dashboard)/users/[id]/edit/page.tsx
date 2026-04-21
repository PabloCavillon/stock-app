import { getUser } from "@/actions/users";
import UserForm from "@/components/user/user-form";
import { ChevronLeft, Edit3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
    title: 'Usuario',
}


export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const user = await getUser(id)

    if (!user) notFound()

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-12 space-y-8 animate-in fade-in duration-500">
            <header className="space-y-6">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors gap-2 group"
                >
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Volver a Usuarios
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-[1.2rem] shrink-0">
                        <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900">
                            Editar Usuario
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1 font-light italic">
                            Modificando: <span className="text-zinc-900 font-medium not-italic">{user.username}</span>
                        </p>
                    </div>
                </div>
            </header>

            <section className="bg-white p-6 md:p-12 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <UserForm user={user} />
            </section>
        </div>
    );
}