'use client';

import { Tent, MapPin, Users } from 'lucide-react';

export default function EspaciosSection({ commonSpaces, onManageSpace }) {
    return (
        <div className="space-y-6 animate-in slide-in-from-right">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-blue-900 flex items-center gap-2"><Tent size={24} className="text-blue-600" /> Administración de Espacios</h2>
                    <div className="flex gap-2">
                        {['Todos', 'Social', 'Deportivo'].map(filter => (
                            <button key={filter} className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-50">{filter}</button>
                        ))}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {commonSpaces.map(space => (
                        <div key={space.id} className="border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-all bg-white flex flex-col justify-between h-full group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${space.status === 'Disponible' ? 'bg-green-100 text-green-700' : space.status === 'Ocupado' || space.status.includes('Reservado') ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {space.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold">{space.type}</span>
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-900 transition-colors">{space.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {space.location}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Users size={12} /> Capacidad: {space.capacity}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                <p className="font-black text-blue-900">{space.price > 0 ? `$${space.price.toLocaleString()}` : 'Sin cargo'}</p>
                                <button
                                    onClick={() => onManageSpace(space)}
                                    className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                >
                                    Gestionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
