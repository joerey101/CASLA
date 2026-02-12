'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, RefreshCw } from 'lucide-react';

// Using image API for simplicity and speed.

export default function DigitalID() {
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

                {/* Holographic overlay effect */}
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
