'use client';

import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface DownloadReceiptButtonProps {
    orderId: string,
    orderCode?: string | null;
    variant?: 'icon' | 'full'
}

export default function DownloadReceiptButton({
    orderId,
    orderCode,
    variant = 'full'
}: DownloadReceiptButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/receipts/${orderId}`)
            if (!res.ok) throw new Error('Error generando el recibo');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `recibo-${orderCode}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.log('acá el error')
            console.error(err);
            alert('No se pudo generar el recibo. Intente de nuevo más tarde.')
        } finally {
            setLoading(false)
        }
    }

    if (variant === 'icon') {
        return (
            <button
                onClick={handleDownload}
                disabled={loading}
                title="Descargar recibo"
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
                {loading ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                    <FileDown className='w-4 h-4' />
                )}
            </button>
        )
    }

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className='flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors'
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileDown className="w-4 h-4" />
            )}
            {loading ? 'Generando...' : 'Descargar recibo'}
        </button>
    );
}