'use client';

import { CreditCard } from 'lucide-react';

export default function AbonosSection() {
    return (
        <div className="space-y-6 animate-in slide-in-from-right">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2"><CreditCard size={20} /> Gestión de Abonos "Tu Lugar"</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 cursor-pointer transition-all">
                        <p className="font-bold text-slate-800">Platea Norte</p>
                        <p className="text-xs text-slate-500">Alta / Baja</p>
                        <p className="text-lg font-black text-blue-900 mt-2">$250.000 <span className="text-xs font-normal text-slate-400">/ Semestre</span></p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 cursor-pointer transition-all">
                        <p className="font-bold text-slate-800">Platea Sur</p>
                        <p className="text-xs text-slate-500">Preferencial</p>
                        <p className="text-lg font-black text-blue-900 mt-2">$180.000 <span className="text-xs font-normal text-slate-400">/ Semestre</span></p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm">
                        Ver Mapa del Estadio
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <button className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-800">Renovar Abono</button>
                    <button className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50">Liberar Butaca</button>
                </div>
            </div>
        </div>
    );
}
