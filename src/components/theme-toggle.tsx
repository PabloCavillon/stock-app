'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel }: ThemeToggleProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    function toggle() {
        const next = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', next);
        try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
        setIsDark(next);
    }

    return (
        <button
            onClick={toggle}
            className={className}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {showLabel && (
                <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            )}
        </button>
    );
}
