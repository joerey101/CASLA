'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Chrome, Facebook } from 'lucide-react';

export default function SocioLoginPage() {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            username: dni,
            password: password,
            redirect: false,
        });

        if (result?.error) {
            setError('DNI o contraseña incorrectos');
            setLoading(false);
        } else {
            router.push('/socio');
        }
    };

    return (
        <div style={{
            maxWidth: 430, margin: '0 auto', minHeight: '100dvh',
            background: '#0a1a35', color: '#fff', padding: '40px 24px',
            display: 'flex', flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header / Logo */}
            <div style={{ textAlign: 'center', marginTop: 40, marginBottom: 60 }}>
                <img src="/logos/emblema.svg" alt="CASLA" style={{ width: 80, height: 80, marginBottom: 20 }} />
                <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: 1, margin: 0 }}>MI CASLA</h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 8 }}>Portal Oficial de Socios</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>
                        <User size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="DNI"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: '16px 16px 16px 48px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 16, color: '#fff', fontSize: 16, outline: 'none'
                        }}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>
                        <Lock size={20} />
                    </div>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: '16px 16px 16px 48px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 16, color: '#fff', fontSize: 16, outline: 'none'
                        }}
                    />
                </div>

                {error && <p style={{ color: '#ff4d4d', fontSize: 13, margin: 0, textAlign: 'center' }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%', padding: 18, background: '#e41c23', color: '#fff',
                        borderRadius: 16, border: 'none', fontSize: 16, fontWeight: 800,
                        cursor: 'pointer', marginTop: 10, boxShadow: '0 8px 24px rgba(228,28,35,0.3)',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'INGRESANDO...' : 'INGRESAR'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
            </div>

            {/* Social Login Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '40px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase' }}>O entrar con</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Social Buttons */}
            <div style={{ display: 'flex', gap: 16 }}>
                <button
                    onClick={() => signIn('google')}
                    style={{
                        flex: 1, padding: 16, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        cursor: 'pointer'
                    }}
                >
                    <Chrome size={20} color="#fff" />
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Google</span>
                </button>
                <button
                    onClick={() => signIn('facebook')}
                    style={{
                        flex: 1, padding: 16, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        cursor: 'pointer'
                    }}
                >
                    <Facebook size={20} color="#fff" />
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Facebook</span>
                </button>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ textAlign: 'center', paddingBottom: 20 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    ¿Aún no eres socio? <a href="#" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Asóciate ahora</a>
                </p>
            </div>
        </div>
    );
}
