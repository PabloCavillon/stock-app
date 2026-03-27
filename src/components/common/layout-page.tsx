import Link from 'next/link';
import { Plus } from 'lucide-react';

interface PageLayoutProps {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    buttonText: string;
    buttonHref: string;
    children: React.ReactNode; // Aquí irá la tabla específica
}

export const PageLayout = ({
    title,
    subtitle,
    icon: Icon,
    buttonText,
    buttonHref,
    children
}: PageLayoutProps) => {
    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700">

            {/* Header Unificado */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-100 rounded-xl">
                            <Icon className="w-5 h-5 text-zinc-900" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tighter text-zinc-900">
                            {title}
                        </h1>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">
                        {subtitle}
                    </p>
                </div>

                <Link
                    href={buttonHref}
                    className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm shadow-zinc-200"
                >
                    <Plus className="w-4 h-4" />
                    {buttonText}
                </Link>
            </header>

            {/* Contenedor de Tabla/Contenido */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                {children}
            </div>
        </div>
    );
};