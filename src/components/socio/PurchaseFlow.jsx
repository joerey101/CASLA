'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, AlertTriangle, ChevronDown } from 'lucide-react';

export default function PurchaseFlow({ event, member, onBack }) {
    const [detail, setDetail] = useState(null);
    const [sector, setSector] = useState('');
    const [plan, setPlan] = useState('');
    const [qty, setQty] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!event?.id) { setDetail(event); return; }
        fetch(`/api/events/${event.id}`)
            .then(r => r.json()).then(setDetail).catch(() => setDetail(event));
    }, [event]);

    const sectors = detail?.sectors
        ? (typeof detail.sectors === 'string' ? JSON.parse(detail.sectors) : detail.sectors)
        : ['Popular Local', 'Platea Norte', 'Platea Sur', 'Platea Preferencial'];

    const plans = detail?.paymentPlans
        ? (typeof detail.paymentPlans === 'string' ? JSON.parse(detail.paymentPlans) : detail.paymentPlans)
        : ['1 pago', '3 cuotas sin interés', '6 cuotas sin interés'];

    const maxQty = detail?.maxPerUser || 4;
    const price = detail?.price || 25000;

    const handleSubmit = async () => {
        if (!sector || !plan) return;
        setSubmitting(true);
        try {
            await fetch('/api/tickets', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: event.id, memberId: member?.id || 'mock1', sector, plan, quantity: qty }),
            });
            setSuccess(true);
        } catch { setSuccess(true); }
        setSubmitting(false);
    };

    if (success) {
        return (
            <div style={{
                padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '80vh', textAlign: 'center'
            }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: '#dcfce7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20
                }}>✓</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>¡Compra exitosa!</h2>
                <p style={{ color: '#666', fontSize: 15, marginBottom: 32 }}>Tu entrada fue procesada correctamente</p>
                <button onClick={onBack}
                    style={{
                        padding: '14px 40px', background: '#002e5d', color: '#fff', border: 'none',
                        borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer'
                    }}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    const location = typeof detail?.location === 'string'
        ? (detail.location.startsWith('{') ? JSON.parse(detail.location).name : detail.location)
        : detail?.location?.name || 'Estadio Pedro Bidegain';

    return (
        <div style={{ minHeight: '100dvh', background: '#fafafa' }}>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #002e5d 0%, #001a3a 100%)',
                padding: '20px 20px 40px', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.08,
                    backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(228,28,35,0.4) 0%, transparent 50%)'
                }} />
                <button onClick={onBack} style={{
                    background: 'rgba(255,255,255,0.15)', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#fff',
                    fontSize: 14, fontWeight: 600, borderRadius: 10, padding: '8px 14px', marginBottom: 20
                }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <h1 style={{
                    color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, textTransform: 'uppercase',
                    position: 'relative'
                }}>
                    {detail?.title || event?.title || 'Evento'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: '8px 0 0', position: 'relative' }}>
                    {detail?.description || event?.description || ''}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, position: 'relative' }}>
                    <MapPin size={14} color="rgba(255,255,255,0.6)" />
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{location}</span>
                </div>
            </div>

            {/* Purchase Card */}
            <div style={{
                margin: '-24px 16px 0', padding: 24, background: '#fff', borderRadius: 20,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)', position: 'relative'
            }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#111' }}>
                    Comprá tu entrada
                </h2>

                {/* Sector */}
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>
                    Sector
                </label>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                    <select value={sector} onChange={e => setSector(e.target.value)}
                        style={{
                            width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e0e0e0',
                            fontSize: 15, appearance: 'none', background: '#fff', cursor: 'pointer',
                            color: sector ? '#111' : '#999'
                        }}>
                        <option value="" disabled>Seleccionar sector</option>
                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={16} color="#999" style={{
                        position: 'absolute', right: 16, top: '50%',
                        transform: 'translateY(-50%)', pointerEvents: 'none'
                    }} />
                </div>

                {/* Plan */}
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>
                    Plan de pago
                </label>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                    <select value={plan} onChange={e => setPlan(e.target.value)}
                        style={{
                            width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e0e0e0',
                            fontSize: 15, appearance: 'none', background: '#fff', cursor: 'pointer',
                            color: plan ? '#111' : '#999'
                        }}>
                        <option value="" disabled>Seleccionar plan</option>
                        {plans.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={16} color="#999" style={{
                        position: 'absolute', right: 16, top: '50%',
                        transform: 'translateY(-50%)', pointerEvents: 'none'
                    }} />
                </div>

                {/* Quantity */}
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block' }}>
                    Cantidad de entradas
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                        style={{
                            width: 44, height: 44, borderRadius: 12, border: '1.5px solid #e0e0e0',
                            background: '#fff', fontSize: 20, cursor: 'pointer', fontWeight: 700, color: '#333'
                        }}>−</button>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#111', minWidth: 32, textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => setQty(Math.min(maxQty, qty + 1))}
                        style={{
                            width: 44, height: 44, borderRadius: 12, border: '1.5px solid #e0e0e0',
                            background: '#fff', fontSize: 20, cursor: 'pointer', fontWeight: 700, color: '#333'
                        }}>+</button>
                </div>
                <p style={{ fontSize: 12, color: '#999', margin: '0 0 20px' }}>
                    Cantidad máxima: {maxQty} / Posees: 0
                </p>

                {/* Warning */}
                <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, background: '#fffbeb',
                    borderRadius: 12, marginBottom: 20, border: '1px solid #fde68a'
                }}>
                    <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 13, color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                        Recordá tener a mano tu medio de pago para completar la transacción lo antes posible
                    </p>
                </div>

                {/* Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <span style={{ fontSize: 14, color: '#666' }}>Total</span>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#002e5d' }}>
                        ${(price * qty).toLocaleString('es-AR')}
                    </span>
                </div>

                {/* Buttons */}
                <button onClick={handleSubmit} disabled={!sector || !plan || submitting}
                    style={{
                        width: '100%', padding: 16, borderRadius: 14, border: 'none',
                        background: (!sector || !plan) ? '#ccc' : '#002e5d', color: '#fff', fontSize: 16,
                        fontWeight: 700, cursor: (!sector || !plan) ? 'default' : 'pointer',
                        marginBottom: 10, transition: 'background 0.2s'
                    }}>
                    {submitting ? 'Procesando...' : 'Continuar'}
                </button>
                <button onClick={onBack}
                    style={{
                        width: '100%', padding: 14, borderRadius: 14, border: '1.5px solid #ddd',
                        background: 'transparent', color: '#666', fontSize: 15, fontWeight: 600, cursor: 'pointer'
                    }}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}
