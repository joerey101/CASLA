'use client';
import { useState } from 'react';
import { UserPlus, CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function AltaExpressSection() {
    const [formData, setFormData] = useState({
        cuit: '',
        nombre: '',
        apellido: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg: '' }
    const [extractedDni, setExtractedDni] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'cuit') {
            if (value.length === 11 && !isNaN(value)) {
                setExtractedDni(value.substring(2, 10));
            } else {
                setExtractedDni('');
            }
        }
    };

    const handleAlta = async () => {
        if (!formData.cuit || formData.cuit.length !== 11 || !formData.nombre || !formData.apellido) {
            setStatus({ type: 'error', msg: 'Por favor completá CUIT (11 dígitos), Nombre y Apellido.' });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch('/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cuit: formData.cuit,
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    category: 'Activo Pleno'
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al procesar el alta');
            }

            setStatus({
                type: 'success',
                msg: `¡Alta exitosa! Socio N° ${data.memberNumber} | DNI: ${data.dni}`
            });
            setFormData({ cuit: '', nombre: '', apellido: '', email: '' });
            setExtractedDni('');

        } catch (error) {
            setStatus({ type: 'error', msg: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right">
            <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10"><h2 className="text-2xl font-black mb-1 uppercase italic">Alta Express</h2><p className="opacity-80 text-sm">Formulario de alta inmediata. Recordá validar DNI físico.</p></div>
                <UserPlus className="absolute right-4 top-4 text-white opacity-10 w-24 h-24" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-bold text-blue-900">Datos Personales</h3>
                    <div>
                        <input
                            name="cuit" value={formData.cuit} onChange={handleChange}
                            type="text" placeholder="CUIT/CUIL (11 dígitos, sin guiones)"
                            className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-blue-300 transition-colors"
                            maxLength={11}
                        />
                        {extractedDni && (
                            <p className="text-xs text-slate-500 mt-1 ml-1 font-bold animate-in fade-in">
                                DNI Detectado: <span className="text-blue-600">{extractedDni}</span>
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="nombre" value={formData.nombre} onChange={handleChange}
                            type="text" placeholder="Nombre" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-blue-300 transition-colors"
                        />
                        <input
                            name="apellido" value={formData.apellido} onChange={handleChange}
                            type="text" placeholder="Apellido" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-blue-300 transition-colors"
                        />
                    </div>
                    <input
                        name="email" value={formData.email} onChange={handleChange}
                        type="email" placeholder="Email" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-blue-300 transition-colors"
                    />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-blue-900 mb-4">Pagos & Adhesión</h3>
                        <div className="space-y-2 mb-4">
                            <button className="w-full p-3 border border-blue-100 rounded-xl flex justify-between items-center text-sm font-bold text-blue-900 hover:bg-blue-50">
                                <span className="flex items-center gap-2"><CreditCard size={16} /> Adherir Débito Automático</span>
                                <CheckCircle2 size={16} className="text-green-500" />
                            </button>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-xl text-sm space-y-2">
                            <div className="flex justify-between"><span>Cuota:</span><span className="font-bold">$33.500</span></div>
                            <div className="flex justify-between"><span>Carnet:</span><span className="font-bold">$15.000</span></div>
                            <div className="border-t pt-2 font-black text-blue-900 flex justify-between"><span>Total:</span><span>$48.500</span></div>
                        </div>
                    </div>

                    {status && (
                        <div className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {status.msg}
                        </div>
                    )}

                    <button
                        onClick={handleAlta}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Procesando...</> : 'Confirmar Alta & Cobrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
