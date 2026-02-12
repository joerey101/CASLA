'use client';

import { Search, ChevronRight } from 'lucide-react';

export default function SolicitudesSection({ requestsKB }) {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-blue-900 mb-4">Base de Conocimiento & Solicitudes</h2>
                <div className="flex gap-2 mb-6">
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl flex items-center gap-2 border border-slate-200">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Buscar problema (ej: ranking, cobro, carnet)..." className="bg-transparent outline-none w-full text-sm font-bold text-slate-700" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {['Todos', 'Administrativo', 'Cobranzas', 'Accesos', 'Abonos', 'Tecnología'].map(tag => (
                        <button key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors">{tag}</button>
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {requestsKB.slice(0, 8).map(kb => (
                        <div key={kb.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{kb.tag}</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">{kb.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 italic">"{kb.question}"</p>
                            <p className="text-xs text-slate-700 mt-2 font-medium bg-green-50 p-2 rounded border-l-2 border-green-500">Solución: {kb.solution}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
