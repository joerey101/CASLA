'use client';

export default function TramitesSection({ tramitesGuia }) {
    return (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
            {tramitesGuia.map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-black text-blue-900 mb-4 flex justify-between items-center">
                        {t.title}
                        <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-100">{t.action}</button>
                    </h3>
                    <div className="space-y-4 relative">
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100" />
                        {t.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 relative items-center">
                                <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-900 text-blue-900 font-bold text-[10px] flex items-center justify-center z-10">{idx + 1}</div>
                                <p className="text-sm text-slate-600 font-medium">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
