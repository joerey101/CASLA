'use client';

import {
    Calendar, Users, CreditCard, X, Bell,
    HeartHandshake, ChevronRight, DollarSign, Receipt,
    Clock, FileText, User, Ticket, Dumbbell
} from 'lucide-react';

const SHIELD_URL = "https://upload.wikimedia.org/wikipedia/commons/7/7b/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg";

const PORTAL_MODULES = [
    { id: 'datos', label: 'Mis Datos', desc: 'Gestión de datos personales y familiares', icon: User },
    { id: 'pagos_pend', label: 'Mis Pagos Pendientes', desc: 'Aboná tus saldos pendientes', icon: DollarSign },
    { id: 'carrito', label: 'Mi Carrito', desc: 'Seleccioná y pagá nuevas actividades', icon: Receipt },
    { id: 'abonos', label: 'Mis Abonos', desc: 'Comprá o renová abonos', icon: CreditCard },
    { id: 'familiar', label: 'Abono Familiar', desc: 'Gestión grupo familiar (4x3)', icon: Users },
    { id: 'debitos', label: 'Débitos y Actividades', desc: 'Manejo de débito automático', icon: CreditCard },
    { id: 'turnos', label: 'Mis Turnos', desc: 'Reserva de espacios deportivos', icon: Clock },
    { id: 'historial', label: 'Pagos Realizados', desc: 'Consulta detalle histórico', icon: FileText },
    { id: 'servicios', label: 'Mis Servicios', desc: 'Mis servicios contratados', icon: Dumbbell },
    { id: 'entradas', label: 'Mis Entradas', desc: 'Adquirir entradas a partidos', icon: Ticket },
];

export default function DashboardSection({
    searchResults = [],
    setSearchResults,
    selectMember,
    matches,
    database,
    setActiveTab,
    setTicketModal,
    directorPlan,
}) {
    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Cuotas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ l: 'Activo Pleno', v: '$33.500' }, { l: 'Cadete', v: '$28.100' }, { l: 'Carnet Alta', v: '$15.000' }, { l: 'Reposición', v: '$19.000' }].map((p, i) => (
                    <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-blue-300 transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{p.l}</p>
                        <p className="text-xl font-black text-blue-900">{p.v}</p>
                        <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity"><CreditCard size={48} /></div>
                    </div>
                ))}
            </div>

            {/* Resultados de Búsqueda Múltiple */}
            {searchResults.length > 0 && (
                <div className="bg-orange-50 rounded-3xl border-2 border-orange-200 overflow-hidden animate-in zoom-in-95">
                    <div className="bg-orange-500 p-3 flex justify-between items-center text-white">
                        <h3 className="font-bold text-sm">Se encontraron {searchResults.length} socios</h3>
                        <button onClick={() => setSearchResults([])}><X size={16} /></button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {searchResults.map(s => (
                            <div key={s.id} onClick={() => selectMember(s)} className="p-3 border-b border-orange-100 hover:bg-orange-100 cursor-pointer flex justify-between items-center transition-colors">
                                <div>
                                    <p className="font-bold text-slate-800 text-xs">{s.fullName || s.nombre}</p>
                                    <p className="text-[10px] text-slate-500">Socio N° {s.memberNumber || s.numero} | DNI: {s.dni}</p>
                                </div>
                                <span className="text-[9px] font-black text-orange-600 bg-white px-2 py-1 rounded-full uppercase">{s.category || s.categoria}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MÓDULOS DE GESTIÓN RÁPIDA */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-blue-900 uppercase">Gestión por Módulo (Vista Operador)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {PORTAL_MODULES.map((mod) => (
                        <button
                            key={mod.id}
                            onClick={() => alert(`Acceso directo a ${mod.label} - Funcionalidad en desarrollo para V6.0`)}
                            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col justify-between h-32 group"
                        >
                            <mod.icon size={24} className="text-blue-900 group-hover:text-red-500 transition-colors" />
                            <div>
                                <p className="font-black text-slate-800 text-sm">{mod.label}</p>
                                <p className="text-[10px] text-slate-500 leading-tight mt-1">{mod.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Plan Director */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg mt-8 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HeartHandshake className="text-red-500" />
                                <h3 className="text-lg font-bold uppercase tracking-widest">Plan Director 2026</h3>
                            </div>
                            <p className="text-3xl font-black text-blue-300 mb-1">{directorPlan.phase}</p>
                            <p className="text-sm opacity-80">Estado: {directorPlan.status} • Foco: {directorPlan.focus}</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Nivel de Riesgo Operativo</p>
                            <p className="text-xl font-black text-orange-400">{directorPlan.riskLevel}</p>
                            <p className="text-xs">Próx: {directorPlan.nextMatch}</p>
                        </div>
                    </div>
                    <img src={SHIELD_URL} className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10" alt="bg" />
                </div>
            </div>

            {/* Partidos & Padrones */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Próximos Partidos */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-blue-900 p-4 flex items-center justify-between">
                        <h3 className="text-white font-bold flex items-center gap-2 text-sm"><Calendar className="text-red-500" size={18} /> Próximos Partidos</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {matches.map((match, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 p-2 rounded-xl text-center min-w-[50px]">
                                        <p className="text-[8px] font-black text-slate-400 uppercase">{match.fecha.split(' ')[0]}</p>
                                        <p className="text-sm font-black text-blue-900">{match.fecha.split(' ')[1]}</p>
                                    </div>
                                    <div><p className="font-bold text-slate-800 text-xs">VS {match.rival}</p><p className="text-[10px] text-slate-500">{match.torneo}</p></div>
                                </div>
                                <button onClick={() => { setActiveTab('entradas'); setTicketModal(match); }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md">Vender</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Socios Recientes */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 p-4 flex items-center justify-between">
                        <h3 className="text-white font-bold flex items-center gap-2 text-sm"><Users className="text-blue-400" size={18} /> Padrones Recientes</h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Mock DB</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {database.slice(1, 6).map((socio) => (
                            <div key={socio.id} onClick={() => selectMember(socio)} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">{(socio.fullName || socio.nombre).charAt(0)}</div>
                                    <div><p className="font-bold text-slate-800 text-xs">{socio.fullName || socio.nombre}</p><p className="text-[10px] text-slate-500">N° {socio.memberNumber || socio.numero}</p></div>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-1 rounded-full ${(socio.status || socio.estado).includes('ACTIVO') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{socio.status || socio.estado}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
