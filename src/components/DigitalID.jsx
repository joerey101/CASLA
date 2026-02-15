'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export default function DigitalID({ variant = 'vertical' }) {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    const fetchToken = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/member/qr');
            const data = await res.json();
            if (data.token) {
                setToken(data.token);
                const expires = new Date(data.expiresAt).getTime();
                const now = new Date().getTime();
                setTimeLeft(Math.max(0, Math.floor((expires - now) / 1000)));
            }
        } catch (e) {
            console.error("Error fetching QR", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchToken();
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    fetchToken(); // Auto refresh
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (variant === 'horizontal') {
        return (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:opacity-70 transition-opacity"></div>

                <div className="flex-1 space-y-4 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-blue-900 uppercase leading-none">Carnet Digital Activo</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Socio Identificado & Validado</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Estado de Identidad</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-black text-green-700 uppercase">Seguro / En Línea</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1 flex justify-between items-center">
                                Actualización <span className="text-blue-600 flex items-center gap-0.5"><Zap size={8} /> Auto</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-blue-900 uppercase">Expira en {timeLeft}s</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                            style={{ width: `${Math.min(100, (timeLeft / 300) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="z-10 relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-xl flex items-center justify-center relative overflow-hidden group-hover:border-blue-200 transition-colors">
                        {loading ? (
                            <RefreshCw className="animate-spin text-blue-600" />
                        ) : token ? (
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(token)}`}
                                alt="Access QR"
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        ) : (
                            <p className="text-xs text-red-500 font-bold">REINTENTAR</p>
                        )}
                        {/* Overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent pointer-events-none"></div>
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-blue-900 text-white p-1 rounded-lg shadow-lg border-2 border-white">
                        <QrCode size={14} />
                    </div>
                </div>
            </div>
        );
    }

    // Default Vertical (Carnet Style)
    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200 flex flex-col items-center text-center">
            <div className="mb-4">
                <h3 className="text-xl font-black text-blue-900 uppercase">Carnet Digital</h3>
                <p className="text-xs text-slate-500 font-bold">ACCESO SEGURO</p>
            </div>

            <div className="relative w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-slate-900">
                {loading ? (
                    <RefreshCw className="animate-spin text-slate-400" />
                ) : token ? (
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(token)}`}
                        alt="Access QR"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <p className="text-xs text-red-500 font-bold">Error de Token</p>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50 pointer-events-none animate-pulse"></div>
            </div>

            <div className="mt-4 w-full">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1">
                    <span>Actualización en</span>
                    <span>{timeLeft}s</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 300) * 100}%` }}
                    ></div>
                </div>
            </div>

            <p className="mt-4 text-[10px] text-slate-400 max-w-[200px]">
                Este código QR es único y personal. No compartas capturas de pantalla.
            </p>
        </div>
    );
}
