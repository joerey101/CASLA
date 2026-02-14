'use client';
import { useState, useEffect, useCallback } from 'react';

export default function CarnetQRTab({ member }) {
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

    return (
        <div style={{ padding: 20, paddingBottom: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#111' }}>Carnet Digital</h2>

            {/* Premium Member Card */}
            <div style={{
                width: '100%', maxWidth: 340, borderRadius: 20, overflow: 'hidden',
                background: 'linear-gradient(135deg, #002e5d 0%, #001a3a 60%, #0a0a2e 100%)',
                padding: '28px 24px', position: 'relative', marginBottom: 24,
                boxShadow: '0 12px 40px rgba(0,46,93,0.35)'
            }}>
                {/* Pattern overlay */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.06,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                }} />

                {/* Club crest placeholder */}
                <div style={{ textAlign: 'center', marginBottom: 20, position: 'relative' }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, fontWeight: 600, textTransform: 'uppercase' }}>
                        Club Atlético San Lorenzo
                    </div>
                </div>

                {/* Avatar */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
                    <img src={member?.avatarUrl || '/logos/CASLA_logo.png'}
                        alt="avatar" style={{
                            width: 72, height: 72, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)',
                            background: 'rgba(255,255,255,0.1)'
                        }} />
                </div>

                {/* Name */}
                <div style={{ textAlign: 'center', marginBottom: 16, position: 'relative' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' }}>
                        {member?.fullName || 'MARIANO PÉREZ'}
                    </div>
                </div>

                {/* Details row */}
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

            {/* QR Code */}
            <div style={{
                background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 340
            }}>
                {loading ? (
                    <div style={{
                        width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#999'
                    }}>Cargando...</div>
                ) : (
                    <img src={qrUrl} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 12 }} />
                )}

                {/* Timer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                    <div style={{ position: 'relative', width: 36, height: 36 }}>
                        <svg width="36" height="36" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="3" />
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#002e5d" strokeWidth="3"
                                strokeDasharray={`${progress * 100.53} 100.53`}
                                strokeLinecap="round" transform="rotate(-90 18 18)" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#002e5d', fontVariantNumeric: 'tabular-nums' }}>
                        {mins}:{secs.toString().padStart(2, '0')}
                    </span>
                </div>

                <p style={{ fontSize: 14, color: '#999', marginTop: 12, textAlign: 'center' }}>
                    Presentá este código al ingresar
                </p>
            </div>
        </div>
    );
}
