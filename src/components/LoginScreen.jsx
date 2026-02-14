'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

const SHIELD_URL = '/logos/CASLA_logo.png';

export default function LoginScreen() {
    const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
    const [loginError, setLoginError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        const result = await signIn('credentials', {
            username: loginForm.user,
            password: loginForm.pass,
            redirect: false,
        });

        if (result?.error) {
            setLoginError('Credenciales inválidas');
        }
    };

    return (
        <div className="min-h-screen bg-[#002D58] flex flex-col items-center justify-center p-4 relative">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg border-4 border-slate-100">
                        <img src={SHIELD_URL} className="w-full h-full object-contain" alt="CASLA" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-blue-900 mb-1">PORTAL SOCIOS V6.0</h2>
                <p className="text-slate-500 text-sm mb-8 font-bold">ACCESO CORPORATIVO</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        value={loginForm.user}
                        onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })}
                        className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800"
                        placeholder="Usuario (admin@casla.com.ar)"
                    />
                    <input
                        type="password"
                        value={loginForm.pass}
                        onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
                        className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800"
                        placeholder="Contraseña"
                    />
                    {loginError && (
                        <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">{loginError}</p>
                    )}
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black tracking-widest shadow-lg">
                        INGRESAR
                    </button>
                </form>
                <div className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    San Lorenzo de Almagro © 2026
                </div>
            </div>
        </div>
    );
}
