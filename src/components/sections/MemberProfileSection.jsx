'use client';

import { DollarSign, Info, ChevronRight } from 'lucide-react';
import DigitalID from '@/components/DigitalID';

export default function MemberProfileSection({ searchResult, onBack }) {
    if (!searchResult) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-2">
                <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-blue-900 flex items-center gap-2">← Volver al Dashboard</button>
            </div>

            {/* Header del Socio */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-blue-900 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl font-black text-slate-300">{(searchResult.fullName || searchResult.nombre).charAt(0)}</div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-blue-900 uppercase">{searchResult.fullName || searchResult.nombre}</h2>
                        <div className="flex gap-4 mt-1 text-sm text-slate-600">
                            <span>#{searchResult.memberNumber || searchResult.numero}</span>
                            <span>{searchResult.category || searchResult.categoria}</span>
                            <span className={`font-bold ${(searchResult.status || searchResult.estado).includes('ACTIVO') ? 'text-green-600' : 'text-red-600'}`}>{searchResult.status || searchResult.estado}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Saldo</p>
                    <p className={`text-3xl font-black ${searchResult.saldo < 0 ? 'text-red-600' : 'text-green-600'}`}>$ {searchResult.saldo}</p>
                </div>
            </div>

            {/* Grid de 3 columnas: ID Digital, Acciones, Datos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Carnet Digital */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <DigitalID />
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><DollarSign size={18} /> Acciones Rápidas</h3>
                    <div className="space-y-2">
                        <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 font-medium text-sm"><span>Cobrar Cuota</span><ChevronRight size={16} /></button>
                        <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 font-medium text-sm"><span>Adherir Débito Automático</span><ChevronRight size={16} /></button>
                        <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 font-medium text-sm"><span>Imprimir Carnet</span><ChevronRight size={16} /></button>
                    </div>
                </div>

                {/* Datos & Derechos */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Info size={18} /> Datos & Derechos</h3>
                    <div className="space-y-1 text-sm text-slate-600 mb-4">
                        <p>DNI: {searchResult.dni}</p>
                        <p>Domicilio: {searchResult.domicilio}</p>
                        <p>Actividad: {searchResult.actividad}</p>
                    </div>

                    {/* Grupo Familiar */}
                    {searchResult.grupoFamiliar && searchResult.grupoFamiliar.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">Grupo Familiar</h4>
                            <div className="space-y-2">
                                {searchResult.grupoFamiliar.map((fam, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-700">{fam.nombre}</p>
                                            <p className="text-[9px] text-slate-500">{fam.relacion} • #{fam.nro}</p>
                                        </div>
                                        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">{fam.estado}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Entitlements */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <div className={`p-2 rounded border ${searchResult.entitlements?.acceso_estadio ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {searchResult.entitlements?.acceso_estadio ? 'Habilitado Estadio' : 'Inhabilitado Estadio'}
                        </div>
                        <div className={`p-2 rounded border ${searchResult.entitlements?.voto_habilitado ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            {searchResult.entitlements?.voto_habilitado ? 'Padrón Electoral' : 'No Vota'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
