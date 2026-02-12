'use client';

import { MessageSquare, HelpCircle, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ScriptsSection({ activeTab, scripts, faqs }) {
    const [copiedId, setCopiedId] = useState(null);

    const copyToClipboard = (text, id) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in">
            <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                {activeTab === 'scripts' ? <MessageSquare size={20} /> : <HelpCircle size={20} />}
                {activeTab === 'scripts' ? 'Biblioteca de Respuestas' : 'Ayuda / FAQ'}
            </h2>

            {activeTab === 'scripts' ? (
                <div className="grid md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2">
                    {scripts.whatsapp.map(s => (
                        <button key={s.id} onClick={() => copyToClipboard(s.text, s.id)} className="text-left p-4 rounded-xl border border-slate-100 hover:border-green-400 hover:bg-green-50 transition-all group relative">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-xs text-green-700 uppercase tracking-widest">{s.title}</span>
                                <Copy size={14} className="opacity-0 group-hover:opacity-100 text-green-600" />
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 group-hover:text-slate-800">{s.text}</p>
                            {copiedId === s.id && <div className="absolute inset-0 bg-green-600/90 rounded-xl flex items-center justify-center text-white font-bold animate-in fade-in">¡Copiado!</div>}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
                    {faqs.map((f, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl">
                            <p className="font-bold text-blue-900 mb-1 flex items-center gap-2"><HelpCircle size={16} className="text-red-500" /> {f.q}</p>
                            <p className="text-sm text-slate-700 pl-6">{f.a}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
