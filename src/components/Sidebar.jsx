'use client';

import {
    Home, Users, CreditCard, ClipboardCheck, MessageSquare,
    AlertTriangle, HelpCircle, Ticket, BarChart3, LogOut, UserPlus,
    Edit3, Inbox, Tent
} from 'lucide-react';

const TAB_CONFIG = [
    { id: 'alta', label: 'Alta Express', icon: UserPlus },
    { id: 'entradas', label: 'Entradas', icon: Ticket },
    { id: 'abonos', label: 'Abonos', icon: CreditCard },
    { id: 'tramites', label: 'Trámites', icon: ClipboardCheck },
    { id: 'solicitudes', label: 'Solicitudes', icon: AlertTriangle },
    { id: 'espacios', label: 'Espacios Comunes', icon: Tent },
    { id: 'scripts', label: 'Scripts', icon: MessageSquare },
    { id: 'faq', label: 'Ayuda / FAQ', icon: HelpCircle },
];

export default function Sidebar({
    activeTab,
    onTabChange,
    currentUser,
    pendingApprovals = [],
    caseCount = 0,
    isMobileMenuOpen = false,
}) {
    return (
        <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2 w-full md:w-64 flex-shrink-0 animate-in slide-in-from-left duration-200`}>
            <div className="bg-white md:bg-transparent rounded-2xl shadow-xl md:shadow-none p-2 md:p-0 space-y-1">

                {/* Dashboard */}
                <button
                    onClick={() => onTabChange('inicio')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'inicio' ? 'bg-[#002D58] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    <Home size={18} /> Dashboard
                </button>

                {/* Gestión de Casos */}
                <button
                    onClick={() => onTabChange('inbox')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'inbox' ? 'bg-[#002D58] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                    <div className="relative">
                        <Inbox size={18} />
                        {caseCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
                    </div>
                    Gestión de Casos
                </button>

                {/* Separador */}
                <div className="my-2 border-t border-slate-200/50" />
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operativo</p>

                {/* Tabs Operativos */}
                {TAB_CONFIG.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold capitalize ${activeTab === tab.id ? 'bg-[#002D58] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}

                {/* Gestión (admin/supervisor) */}
                {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
                    <>
                        <div className="my-2 border-t border-slate-200/50" />
                        <p className="px-4 text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Gestión</p>
                        <button
                            onClick={() => onTabChange('gestion')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'gestion' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            <BarChart3 size={18} /> KPIs & Control
                        </button>
                    </>
                )}

                {/* Aprobaciones (admin only) */}
                {currentUser.role === 'admin' && (
                    <button
                        onClick={() => onTabChange('cms')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'cms' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        <div className="relative">
                            <Edit3 size={18} />
                            {pendingApprovals.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />}
                        </div>
                        Aprobaciones
                    </button>
                )}
            </div>
        </aside>
    );
}
