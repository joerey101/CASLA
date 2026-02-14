"use client";

import dynamic from 'next/dynamic';

const USIGMap = dynamic(() => import('@/components/USIGMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Cargando mapa...</div>
});

export default function MapaPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mapa Interactivo de Buenos Aires</h1>
            <p className="mb-4 text-gray-600">Explore la ciudad y ubique las sedes importantes.</p>
            <USIGMap />
        </div>
    );
}
