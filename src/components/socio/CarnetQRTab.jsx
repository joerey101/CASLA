'use client';
import { useState, useEffect, useCallback } from 'react';

export default function CarnetQRTab({ member, isDesktop }) {
    const [qrData, setQrData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(180);
    const [loading, setLoading] = useState(true);

    const fetchQR = useCallback(async () => {
        setTimeout(() => setLoading(true), 0);
        try {
            const res = await fetch('/api/member/qr');
            const data = await res.json();
            setQrData(data);
            setTimeLeft(180);
        } catch {
            setQrData({ token: member?.memberNumber || '85001' });
            setTimeLeft(180);
        }
        setLoading(false);
    }, [member]);

    useEffect(() => { setTimeout(fetchQR, 0); }, [fetchQR]);

    useEffect(() => {
        if (timeLeft <= 0) { setTimeout(fetchQR, 0); return; }
        const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, fetchQR]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const progress = timeLeft / 180;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrData?.token || member?.memberNumber || 'CASLA-MEMBER'
    )}`;

    // --- MOBILE VIEW (LEGACY PRESERVED) ---
    if (!isDesktop) {
        return (
            <div style={{ padding: 20, paddingBottom: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#111' }}>Carnet Digital</h2>

                <div style={{
                    width: '100%', maxWidth: 340, borderRadius: 20, overflow: 'hidden',
                    background: 'linear-gradient(135deg, #002e5d 0%, #001a3a 60%, #0a0a2e 100%)',
                    padding: '28px 24px', position: 'relative', marginBottom: 24,
                    boxShadow: '0 12px 40px rgba(0,46,93,0.35)'
                }}>
                    <div style={{
                        position: 'absolute', inset: 0, opacity: 0.06,
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                    }} />
                    <div style={{ textAlign: 'center', marginBottom: 20, position: 'relative' }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, fontWeight: 600, textTransform: 'uppercase' }}>
                            Club Atlético San Lorenzo
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
                        <img src={member?.avatarUrl || '/images/avatar_male_casla.png'}
                            alt="avatar" style={{
                                width: 72, height: 72, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)',
                                background: 'rgba(255,255,255,0.1)'
                            }} />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: 16, position: 'relative' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>
                            {member?.fullName || 'MARIANO PÉREZ'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        <div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 2 }}>N° SOCIO</div>
                            <div style={{ fontSize: 16, color: '#fff', fontWeight: 700 }}>{member?.memberNumber || '85001'}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 2 }}>CATEGORÍA</div>
                            <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{member?.category || 'Activo Pleno'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 2 }}>ESTADO</div>
                            <span style={{
                                background: member?.status === 'MOROSO' ? '#ef4444' : '#16a34a',
                                color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px',
                                borderRadius: 20,
                                textTransform: 'uppercase'
                            }}>{member?.status || 'AL DÍA'}</span>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 340
                }}>
                    {loading ? (
                        <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Cargando...</div>
                    ) : (
                        <img src={qrUrl} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 12 }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                        <div style={{ position: 'relative', width: 36, height: 36 }}>
                            <svg width="36" height="36" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="3" />
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#002e5d" strokeWidth="3"
                                    strokeDasharray={`${progress * 100.53} 100.53`}
                                    strokeLinecap="round" transform="rotate(-90 18 18)" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 700, color: '#002e5d' }}>{mins}:{secs.toString().padStart(2, '0')}</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#999', marginTop: 12, textAlign: 'center' }}>Presentá este código al ingresar</p>
                </div>
            </div>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: '32px', justifyContent: 'center', width: '100%' }}>
            {/* Premium Member Card */}
            <div style={{
                flex: 1, maxWidth: '600px', borderRadius: 32, overflow: 'hidden',
                background: 'linear-gradient(135deg, #002e5d 0%, #001a3a 60%, #0a0a2e 100%)',
                padding: '40px', position: 'relative', boxShadow: '0 20px 50px rgba(0,46,93,0.3)',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.1,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src="/logos/CASLA_logo.png" alt="logo" style={{ width: 32 }} />
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 2, fontWeight: 800 }}>CARNET SOCIO</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 160, height: 160, borderRadius: 24, border: '4px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                <img src={member?.avatarUrl || '/images/avatar_male_casla.png'} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{
                                width: '100%', background: member?.status === 'MOROSO' ? '#ef4444' : '#22c55e',
                                color: '#fff', padding: '12px 24px', borderRadius: 16, textAlign: 'center', fontSize: 18, fontWeight: 900,
                                boxShadow: member?.status === 'MOROSO' ? '0 0 20px rgba(239,68,68,0.4)' : '0 0 20px rgba(34,197,94,0.4)',
                                textTransform: 'uppercase', letterSpacing: 1
                            }}>{member?.status || 'AL DÍA'}</div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
                            <div style={{ display: 'flex', gap: 48 }}>
                                <div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 4 }}>N° SOCIO</div>
                                    <div style={{ fontSize: 24, color: '#fff', fontWeight: 900, fontFamily: 'monospace' }}>{member?.memberNumber || '85001'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 4 }}>DNI</div>
                                    <div style={{ fontSize: 24, color: '#fff', fontWeight: 900 }}>{member?.dni || '---'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* QR Code Section */}
            <div style={{
                width: '340px', maxWidth: '340px', background: '#fff', borderRadius: 32, padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#002e5d', marginBottom: 20, letterSpacing: 1 }}>TOKEN DE ACCESO</div>
                {loading ? (
                    <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', background: '#f8fafc', borderRadius: 20 }}>Cargando...</div>
                ) : (
                    <div style={{ background: '#fff', padding: 10, borderRadius: 20, border: '1px solid #f1f5f9' }}><img src={qrUrl} alt="QR Code" style={{ width: 200, height: 200 }} /></div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, padding: '8px 16px', background: '#f1f5f9', borderRadius: 12 }}>
                    <div style={{ position: 'relative', width: 24, height: 24 }}>
                        <svg width="24" height="24" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#002e5d" strokeWidth="4" strokeDasharray={`${progress * 100.53} 100.53`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#002e5d' }}>{mins}:{secs.toString().padStart(2, '0')}</span>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16, textAlign: 'center', fontWeight: 600 }}>Se actualiza automáticamente cada 3 minutos</p>
            </div>
        </div>
    );
}
