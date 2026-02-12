'use client';

import { Calendar } from 'lucide-react';

export default function EntradasSection({ matches, setTicketModal }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right">
            {matches.map(match => (
                <div key={match.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">{match.torneo}</p>
                    <h3 className="text-xl font-black text-blue-900 mb-1">VS {match.rival}</h3>
                    <p className="text-sm font-medium text-slate-600 mb-6 flex items-center gap-2"><Calendar size={14} /> {match.fecha}</p>
                    <button onClick={() => setTicketModal(match)} className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700">Vender Ticket</button>
                </div>
            ))}
        </div>
    );
}
