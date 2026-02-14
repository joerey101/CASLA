'use client';
import { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';

export default function EntradasTab({ member, isDesktop }) {
    const [tab, setTab] = useState('ENTRADA');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!member?.id) return;
        setTimeout(() => setLoading(true), 0);
        fetch(`/api/tickets?memberId=${member.id}&type=${tab}`)
            .then(r => r.json())
            .then(data => { setTickets(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [tab, member?.id]);

    // --- MOBILE VIEW (LEGACY PRESERVED) ---
    if (!isDesktop) {
        return (
            <div style={{ padding: 20, paddingBottom: 100 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Entradas</h2>
                <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#f5f5f5', borderRadius: 10, overflow: 'hidden' }}>
                    {['ENTRADA', 'ABONO'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{
                                flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                background: tab === t ? '#002e5d' : 'transparent', color: tab === t ? '#fff' : '#666',
                                border: 'none', transition: 'all 0.2s'
                            }}>
                            {t === 'ENTRADA' ? 'Entrada' : 'Abonos'}
                        </button>
                    ))}
                </div>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Cargando...</div>
                ) : tickets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <Ticket size={48} color="#ccc" />
                        <h3 style={{ fontSize: 16, fontWeight: 600, margin: '16px 0 8px', color: '#333' }}>No posees tickets</h3>
                        <p style={{ color: '#999', fontSize: 14 }}>Cuando compres tickets aparecerán aquí</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {tickets.map(t => (
                            <div key={t.id} style={{
                                padding: 16, background: '#fff', borderRadius: 12,
                                border: '1px solid #eee', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.event?.title || 'Evento'}</div>
                                <div style={{ fontSize: 13, color: '#666' }}>Sector: {t.sector} · Cant: {t.quantity}</div>
                                <div style={{ fontSize: 12, color: t.status === 'ACTIVE' ? '#16a34a' : '#999', marginTop: 4 }}>
                                    {t.status === 'ACTIVE' ? '● Activo' : '● ' + t.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, color: '#002e5d' }}>Entradas</h2>
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#e2e8f0', borderRadius: 16, overflow: 'hidden', maxWidth: 400 }}>
                {['ENTRADA', 'ABONO'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        style={{
                            flex: 1, padding: '14px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            background: tab === t ? '#002e5d' : 'transparent', color: tab === t ? '#fff' : '#64748b',
                            border: 'none', transition: 'all 0.2s'
                        }}>
                        {t === 'ENTRADA' ? 'Entrada' : 'Abonos'}
                    </button>
                ))}
            </div>
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando...</div>
            ) : tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0' }}>
                    <Ticket size={64} color="#cbd5e1" style={{ marginBottom: 20 }} />
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', color: '#1e293b' }}>No posees tickets</h3>
                    <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>Cuando compres tickets aparecerán aquí</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {tickets.map(t => (
                        <div key={t.id} style={{
                            padding: 24, background: '#fff', borderRadius: 20,
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>{t.event?.title || 'Evento'}</div>
                            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Sector: {t.sector} · Cant: {t.quantity}</div>
                            <div style={{
                                display: 'inline-block', marginTop: 12, padding: '4px 10px', borderRadius: 10,
                                fontSize: 11, fontWeight: 800, background: t.status === 'ACTIVE' ? '#22c55e15' : '#f1f5f9',
                                color: t.status === 'ACTIVE' ? '#22c55e' : '#94a3b8'
                            }}>{t.status === 'ACTIVE' ? 'ACTIVO' : t.status}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
