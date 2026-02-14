'use client';
import { useState, useEffect } from 'react';
import { Search, Bell, MapPin } from 'lucide-react';

const CATEGORIES = [
    { id: 'FUTBOL', label: 'Fútbol', emoji: '⚽' },
    { id: 'REUNION_CD', label: 'Reunión CD', emoji: '🎧' },
    { id: 'POLIDEPORTIVO', label: 'Polideportivo', emoji: '🏀' },
    { id: 'CIUDAD_DEPORTIVA', label: 'Ciudad Dep.', emoji: '🏗️' },
];

export default function HomeTab({ member, unreadCount, onNotifications, onEventSelect, isDesktop }) {
    const [category, setCategory] = useState('FUTBOL');
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [gestiones] = useState([
        { id: 1, fecha: '12 Feb 2026', tramite: 'Renovación de Carnet', tipo: 'Trámite', estado: 'RESUELTO', color: '#22c55e' },
        { id: 2, fecha: '10 Feb 2026', tramite: 'Consulta de Deuda Social', tipo: 'Llamada', estado: 'PENDIENTE', color: '#f59e0b' },
        { id: 3, fecha: '05 Feb 2026', tramite: 'Adhesión a Débito Automático', tipo: 'Caja', estado: 'RESUELTO', color: '#22c55e' },
    ]);

    useEffect(() => {
        fetch(`/api/events?category=${category}`)
            .then(r => r.json())
            .then(data => { setEvents(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [category]);

    const filtered = search
        ? events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
        : events;

    const fmtDate = (dateStr) => {
        const d = new Date(dateStr);
        return { day: d.getDate(), month: d.toLocaleString('es-AR', { month: 'short' }).toUpperCase() };
    };

    if (isDesktop) {
        return (
            <div style={{ color: '#1e293b' }}>
                {/* Header Superior Desktop */}
                <div style={{ marginBottom: 40 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 900, color: '#002e5d', marginBottom: 4 }}>
                        Hola, {member?.fullName?.split(' ')[0] || 'Mariano'}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 16, fontWeight: 500 }}>¡Bienvenido de vuelta a tu casa!</p>
                </div>

                {/* Secciones del Dashboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

                    {/* Historial de Gestiones (CRM) */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#002e5d' }}>Historial de Gestiones</h2>
                            <button style={{ color: '#3b82f6', background: 'none', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                Ver todas
                            </button>
                        </div>

                        <div style={{ background: '#fff', borderRadius: 24, padding: 0, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '20px 24px', fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>FECHA</th>
                                        <th style={{ padding: '20px 24px', fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>GESTIÓN</th>
                                        <th style={{ padding: '20px 24px', fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>TIPO</th>
                                        <th style={{ padding: '20px 24px', fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gestiones.map((g) => (
                                        <tr key={g.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '20px 24px', fontSize: 14, fontWeight: 600, color: '#64748b' }}>{g.fecha}</td>
                                            <td style={{ padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{g.tramite}</td>
                                            <td style={{ padding: '20px 24px', fontSize: 14, color: '#64748b' }}>{g.tipo}</td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{
                                                    background: `${g.color}15`, color: g.color,
                                                    padding: '6px 12px', borderRadius: 12, fontSize: 11, fontWeight: 800
                                                }}>{g.estado}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Eventos Próximos */}
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#002e5d' }}>Próximos Eventos</h2>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {CATEGORIES.map(c => (
                                    <button key={c.id} onClick={() => { setCategory(c.id); setLoading(true); }}
                                        style={{
                                            padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                                            border: category === c.id ? '2px solid #002e5d' : '1px solid #e2e8f0',
                                            background: category === c.id ? '#fff' : 'transparent',
                                            color: category === c.id ? '#002e5d' : '#888',
                                            cursor: 'pointer'
                                        }}>{c.label}</button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando eventos...</div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>🏟️</div>
                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Sin eventos</h3>
                                <p style={{ color: '#64748b', fontSize: 14 }}>No hay eventos en esta categoría</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                                {filtered.map(event => {
                                    const { day, month } = fmtDate(event.date);
                                    const location = typeof event.location === 'string'
                                        ? (event.location.startsWith('{') ? JSON.parse(event.location).name : event.location)
                                        : event.location?.name || 'Estadio Pedro Bidegain';

                                    return (
                                        <button key={event.id} onClick={() => onEventSelect?.(event)} style={{
                                            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #e2e8f0',
                                            textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 20,
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{ textAlign: 'center', minWidth: 60, flexShrink: 0 }}>
                                                <div style={{ fontSize: 32, fontWeight: 900, color: '#002e5d', lineHeight: 1 }}>{day}</div>
                                                <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', marginTop: 2 }}>{month}</div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>{event.title}</div>
                                                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>{event.description}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <MapPin size={14} color="#94a3b8" />
                                                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{location}</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '16px 20px', paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={member?.avatarUrl || '/images/avatar_male_casla.png'}
                        alt="avatar" style={{
                            width: 44, height: 44, borderRadius: '50%', background: '#eee',
                            border: '2px solid #e8eef5'
                        }} />
                    <div>
                        <div style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>Bienvenido</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>
                            Hola {member?.fullName?.split(' ')[0] || 'Mariano'}!
                        </div>
                    </div>
                </div>
                <button onClick={onNotifications} style={{
                    position: 'relative', background: 'none', border: 'none',
                    cursor: 'pointer', padding: 8
                }}>
                    <Bell size={24} color="#333" />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute', top: 4, right: 4, background: '#e41c23', borderRadius: '50%',
                            width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 800, color: '#fff'
                        }}>{unreadCount}</span>
                    )}
                </button>
            </div>

            {/* Search */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 14,
                padding: '12px 16px', marginBottom: 20, border: '1px solid #eee',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
                <Search size={18} color="#bbb" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar evento..." style={{
                        border: 'none', background: 'none', outline: 'none',
                        flex: 1, fontSize: 15, color: '#333'
                    }} />
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                {CATEGORIES.map(c => {
                    const active = category === c.id;
                    return (
                        <button key={c.id} onClick={() => { setCategory(c.id); setLoading(true); }}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                minWidth: 80, padding: '14px 8px', borderRadius: 16, cursor: 'pointer',
                                background: active ? '#fff' : 'transparent',
                                border: active ? '2px solid #002e5d' : '2px solid transparent',
                                boxShadow: active ? '0 4px 12px rgba(0,46,93,0.12)' : 'none',
                                transition: 'all 0.2s'
                            }}>
                            <span style={{ fontSize: 28 }}>{c.emoji}</span>
                            <span style={{
                                fontSize: 11, fontWeight: active ? 700 : 500,
                                color: active ? '#002e5d' : '#888'
                            }}>{c.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Events */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Cargando eventos...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏟️</div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', margin: '0 0 4px' }}>Sin eventos</h3>
                    <p style={{ color: '#999', fontSize: 14, margin: 0 }}>No hay eventos en esta categoría</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filtered.map(event => {
                        const { day, month } = fmtDate(event.date);
                        const location = typeof event.location === 'string'
                            ? (event.location.startsWith('{') ? JSON.parse(event.location).name : event.location)
                            : event.location?.name || 'Estadio Pedro Bidegain';
                        return (
                            <button key={event.id} onClick={() => onEventSelect?.(event)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 16, padding: 18, background: '#fff',
                                    borderRadius: 16, border: '1px solid #eee', cursor: 'pointer', textAlign: 'left',
                                    width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.15s'
                                }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 4, textTransform: 'uppercase' }}>
                                        {event.title}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>{event.description}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <MapPin size={12} color="#999" />
                                        <span style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>{location}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', minWidth: 50, flexShrink: 0 }}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: '#002e5d', lineHeight: 1 }}>{day}</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#e41c23', letterSpacing: 1 }}>{month}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
