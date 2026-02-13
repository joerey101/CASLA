'use client';
import { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';

export default function EntradasTab({ member }) {
    const [tab, setTab] = useState('ENTRADA');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!member?.id) return;
        setLoading(true);
        fetch(`/api/tickets?memberId=${member.id}&type=${tab}`)
            .then(r => r.json())
            .then(data => { setTickets(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [tab, member?.id]);

    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Entradas</h2>

            {/* Sub-tabs */}
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
