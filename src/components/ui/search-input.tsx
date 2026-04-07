import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchInput = ({
    value,
    onChange,
    placeholder = "Buscar..."
}: SearchInputProps) => {
    return (
        <div className="p-4 md:p-6 border-b border-zinc-100 bg-zinc-50/70">
            <div className="relative w-full max-w-md">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl pl-11 pr-4 py-3 text-base text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all placeholder:text-zinc-400 shadow-sm"
                />
            </div>
        </div>
    )
}