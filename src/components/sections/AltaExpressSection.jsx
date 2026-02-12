'use client';

import { UserPlus, CreditCard, CheckCircle2 } from 'lucide-react';

export default function AltaExpressSection() {
    return (
        <div className="space-y-6 animate-in slide-in-from-right">
            <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10"><h2 className="text-2xl font-black mb-1 uppercase italic">Alta Express</h2><p className="opacity-80 text-sm">Formulario de alta inmediata. Recordá validar DNI físico.</p></div>
                <UserPlus className="absolute right-4 top-4 text-white opacity-10 w-24 h-24" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-bold text-blue-900">Datos Personales</h3>
                    <input type="text" placeholder="DNI" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Nombre" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                        <input type="text" placeholder="Apellido" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                    </div>
                    <input type="email" placeholder="Email" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-blue-900 mb-4">Pagos & Adhesión</h3>
                        <div className="space-y-2 mb-4">
                            <button className="w-full p-3 border border-blue-100 rounded-xl flex justify-between items-center text-sm font-bold text-blue-900 hover:bg-blue-50"><span className="flex items-center gap-2"><CreditCard size={16} /> Adherir Débito Automático</span><CheckCircle2 size={16} className="text-green-500" /></button>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-xl text-sm space-y-2">
                            <div className="flex justify-between"><span>Cuota:</span><span className="font-bold">$33.500</span></div>
                            <div className="flex justify-between"><span>Carnet:</span><span className="font-bold">$15.000</span></div>
                            <div className="border-t pt-2 font-black text-blue-900 flex justify-between"><span>Total:</span><span>$48.500</span></div>
                        </div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg hover:bg-green-700">Confirmar Alta & Cobrar</button>
                </div>
            </div>
        </div>
    );
}
