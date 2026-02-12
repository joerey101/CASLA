'use client';

import { Inbox } from 'lucide-react';

export default function CasosSection({ database }) {
    const allCases = database.flatMap(u => {
        return (u.casos || []).map(c => ({
            ...c,
            socioName: u.fullName || u.nombre,
            socioNumero: u.memberNumber || u.numero,
        }));
    });

    return (
        <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-blue-900 flex items-center gap-2"><Inbox size={24} /> Tablero de Casos</h2>
                <div className="flex gap-2">
                    <button className="bg-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-600">Todos</button>
                    <button className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-400">Mis Casos</button>
                    <button className="bg-red-50 border border-red-200 px-3 py-1 rounded-lg text-xs font-bold text-red-600">Críticos</button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-black text-slate-400 border-b border-slate-100">
                            <tr>
                                <th className="p-4">ID Caso</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4">Socio</th>
                                <th className="p-4">Prioridad</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allCases.slice(0, 20).map((c, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-4 font-mono text-xs">{c.id || `C-${idx + 1}`}</td>
                                    <td className="p-4"><span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{c.tipo || c.type || 'General'}</span></td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 text-xs">{c.socioName}</p>
                                        <p className="text-[10px] text-slate-500">N° {c.socioNumero}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${c.prioridad === 'Crítica' ? 'bg-red-50 text-red-600' : c.prioridad === 'Alta' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'}`}>
                                            {c.prioridad || 'Normal'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase ${c.estado === 'Cerrado' || c.estado === 'Resuelto' ? 'text-green-600' : 'text-orange-600'}`}>{c.estado || 'Abierto'}</span>
                                    </td>
                                    <td className="p-4">
                                        <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-100">Ver</button>
                                    </td>
                                </tr>
                            ))}
                            {allCases.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">Sin casos registrados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
