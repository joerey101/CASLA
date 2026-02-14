'use client';
import { QrCode, ShieldCheck } from 'lucide-react';

export default function SocioRightPanel({ member }) {
    return (
        <aside style={{
            width: 360,
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            height: '100vh',
            position: 'fixed',
            right: 0,
            top: 0,
            background: '#f8fafc',
            borderLeft: '1px solid #e2e8f0',
            overflowY: 'auto'
        }}>
            {/* Carnet Card Widget - New Aesthetic */}
            <div style={{
                background: 'linear-gradient(135deg, #002e5c 0%, #001a3a 100%)',
                borderRadius: 24,
                padding: 24,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,26,58,0.2)'
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.1,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <div style={{ width: 24, height: 24, background: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src="/logos/CASLA_logo.png" alt="logo" style={{ width: 18 }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>CARNET SOCIO</span>
                    </div>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        {/* Left Side: Avatar + Alarm Status */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 80 }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: 12,
                                background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)',
                                overflow: 'hidden'
                            }}>
                                <img src={member?.avatarUrl || '/images/avatar_male_casla.png'} alt="user" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            {/* MINI MASTER ALARM */}
                            <div style={{
                                background: member?.status === 'MOROSO' ? '#ef4444' : '#22c55e',
                                padding: '4px 2px', borderRadius: 8, fontSize: 9, fontWeight: 900,
                                textAlign: 'center', boxShadow: member?.status === 'MOROSO' ? '0 0 10px rgba(239,68,68,0.3)' : '0 0 10px rgba(34,197,94,0.3)'
                            }}>
                                {member?.status === 'MOROSO' ? 'MOROSO' : 'AL DÍA'}
                            </div>
                        </div>

                        {/* Right Side: Information */}
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.2 }}>{member?.fullName?.toUpperCase()}</div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>{member?.category?.toUpperCase()}</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div>
                                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>N° SOCIO</div>
                                    <div style={{ fontSize: 14, fontWeight: 900, fontFamily: 'monospace' }}>{member?.memberNumber || '---'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>DNI</div>
                                    <div style={{ fontSize: 12, fontWeight: 700 }}>{member?.dni || '---'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Próximo Partido Card */}
            <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>PRÓXIMO PARTIDO</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>LIGA PROFESIONAL</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ textAlign: 'center' }}>
                        <img src="/logos/CASLA_logo.png" alt="casla" style={{ width: 44, marginBottom: 8 }} />
                        <div style={{ fontSize: 11, fontWeight: 800 }}>CASLA</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#cbd5e1' }}>VS</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 44, height: 44, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 20 }}>⚽</span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 800 }}>POR DEFINIR</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
                    {[{ v: '02', l: 'Días' }, { v: '14', l: 'Horas' }, { v: '25', l: 'Mins' }, { v: '39', l: 'Segs' }].map((t, i) => (
                        <div key={i} style={{ background: '#f8fafc', padding: '10px 4px', borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#1e293b' }}>{t.v}</div>
                            <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{t.l}</div>
                        </div>
                    ))}
                </div>

                <button style={{
                    width: '100%', padding: '14px', background: '#3b82f6', color: '#fff',
                    borderRadius: 16, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(59,130,246,0.3)'
                }}>
                    Comprar Entradas
                </button>
            </div>

            {/* Banner Tienda */}
            <div style={{
                marginTop: 'auto',
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=300") shadow-md',
                backgroundSize: 'cover',
                height: 120,
                borderRadius: 24,
                padding: 20,
                display: 'flex',
                alignItems: 'flex-end',
                color: '#fff',
                cursor: 'pointer'
            }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>TIENDA OFICIAL</div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>30% OFF INDUMENTARIA</div>
                </div>
            </div>
        </aside>
    );
}
