'use client';
import { useState, useEffect, useCallback } from 'react';
import { User, Users, CreditCard, LogOut, ChevronRight, ArrowLeft, Search } from 'lucide-react';

function ProfileView({ member, onBack }) {
    return (
        <div style={{ padding: 20 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: '#002e5d' }}>
                <ArrowLeft size={20} /></button>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img src={member?.avatarUrl || '/images/avatar_male_casla.png'} alt="Perfil"
                    style={{ width: 80, height: 80, borderRadius: '50%', background: '#eee', marginBottom: 12, border: '3px solid #e8eef5' }} />
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#002e5d' }}>{member?.fullName || 'Socio'}</h2>
                <p style={{ color: '#666', fontSize: 14, margin: '4px 0' }}>{member?.email || ''}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                    { label: 'N° Socio', value: member?.memberNumber },
                    { label: 'DNI', value: member?.dni },
                    { label: 'Categoría', value: member?.category },
                    { label: 'Estado', value: member?.status },
                    { label: 'Antigüedad', value: member?.seniority },
                    { label: 'Teléfono', value: member?.phone || '-' },
                ].map((item, i) => (
                    <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', padding: '16px',
                        background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#333' }}>{item.value || '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FamilyView({ member, onBack }) {
    const [family, setFamily] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!member?.id) return;
        setTimeout(() => setLoading(true), 0);
        fetch(`/api/family?memberId=${member.id}`)
            .then(r => r.json()).then(d => { setFamily(Array.isArray(d) ? d : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [member?.id]);

    return (
        <div style={{ padding: 20 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: '#002e5d' }}>
                <ArrowLeft size={20} /></button>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#002e5d' }}>Grupo familiar</h2>
            {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Cargando...</div> :
                family.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <Users size={48} color="#ccc" />
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '16px 0 8px', color: '#333' }}>No posees ningún integrante</h3>
                        <p style={{ color: '#999', fontSize: 14 }}>Contactate con atención al socio para agregarlo</p>
                    </div>
                ) : family.map(f => (
                    <div key={f.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#fff',
                        borderRadius: 14, border: '1px solid #eee', marginBottom: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '50%', background: '#e8eef5', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#002e5d'
                        }}>
                            {f.fullName[0]}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>{f.fullName}</div>
                            <div style={{ fontSize: 13, color: '#666' }}>{f.relationship} · {f.category || 'Socio'}</div>
                        </div>
                    </div>
                ))}
        </div>
    );
}

function PaymentsView({ member, onBack }) {
    const [payments, setPayments] = useState([]);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const LIMIT = 10;

    const load = useCallback((o) => {
        if (!member?.id) return;
        setTimeout(() => setLoading(true), 0);
        fetch(`/api/payments?memberId=${member.id}&limit=${LIMIT}&offset=${o}`)
            .then(r => r.json()).then(d => {
                setPayments(prev => o === 0 ? (d.payments || []) : [...prev, ...(d.payments || [])]);
                setTotal(d.total || 0);
                setLoading(false);
            }).catch(() => setLoading(false));
    }, [member]);

    useEffect(() => { load(0); }, [load]);

    const fmt = (n) => n?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: '#002e5d' }}>
                <ArrowLeft size={20} /></button>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#002e5d' }}>Historial de pagos</h2>
            {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Cargando...</div> :
                payments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <CreditCard size={48} color="#ccc" />
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '16px 0 8px', color: '#333' }}>Sin transacciones</h3>
                        <p style={{ color: '#999', fontSize: 14 }}>Aún no tienes transacciones registradas</p>
                    </div>
                ) : (
                    <>
                        {payments.map(p => (
                            <div key={p.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px 0', borderBottom: '1px solid #f0f0f0'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>{p.concept}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>
                                        {new Date(p.createdAt).toLocaleDateString('es-AR')}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: p.status === 'COMPLETED' ? '#16a34a' : '#e41c23', fontSize: 15 }}>
                                        {fmt(p.amount)}</div>
                                    <div style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>{p.status === 'COMPLETED' ? 'Pagado' : p.status}</div>
                                </div>
                            </div>
                        ))}
                        {payments.length < total && (
                            <button onClick={() => { const o = offset + LIMIT; setOffset(o); load(o); }}
                                style={{
                                    width: '100%', padding: 14, marginTop: 16, background: '#f5f5f5', border: 'none',
                                    borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#002e5d'
                                }}>
                                Cargar más ▾
                            </button>
                        )}
                    </>
                )}
        </div>
    );
}

function NotificationsView({ member, onBack }) {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!member?.id) return;
        setTimeout(() => setLoading(true), 0);
        const params = new URLSearchParams({ memberId: member.id });
        if (filter === 'unread') params.set('unread', 'true');
        if (search) params.set('search', search);
        fetch(`/api/notifications?${params}`)
            .then(r => r.json()).then(d => { setNotifications(d.notifications || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [member?.id, filter, search]);

    const markRead = async (id) => {
        await fetch('/api/notifications', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: '#002e5d' }}>
                <ArrowLeft size={20} /></button>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: '#002e5d' }}>Notificaciones</h2>

            <div style={{
                display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 12,
                padding: '12px 16px', marginBottom: 16, border: '1px solid #eee'
            }}>
                <Search size={18} color="#999" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
                    style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 15, color: '#333' }} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[{ id: 'all', label: 'Todas' }, { id: 'unread', label: 'No leídas' }].map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)}
                        style={{
                            padding: '10px 20px', borderRadius: 24, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            background: filter === f.id ? '#002e5d' : '#fff', color: filter === f.id ? '#fff' : '#666',
                            border: filter === f.id ? 'none' : '1px solid #eee', boxShadow: filter === f.id ? '0 4px 12px rgba(0,46,93,0.2)' : 'none'
                        }}>{f.label}</button>
                ))}
            </div>

            {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Cargando...</div> :
                notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>No hay notificaciones</div>
                ) : notifications.map(n => (
                    <button key={n.id} onClick={() => !n.isRead && markRead(n.id)}
                        style={{
                            display: 'block', width: '100%', textAlign: 'left', padding: 18, background: n.isRead ? '#fff' : '#f0f4ff',
                            borderRadius: 14, border: '1px solid #f0f0f0', marginBottom: 10, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                        <div style={{ fontWeight: n.isRead ? 600 : 800, fontSize: 15, marginBottom: 6, color: '#111' }}>{n.title}</div>
                        <div style={{ fontSize: 14, color: '#666', lineHeight: 1.4 }}>{n.body}</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 8, fontWeight: 500 }}>
                            {new Date(n.createdAt).toLocaleDateString('es-AR')}
                        </div>
                    </button>
                ))}
        </div>
    );
}

export default function MasTab({ member, onLogout }) {
    const [subView, setSubView] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    if (subView === 'profile') return <ProfileView member={member} onBack={() => setSubView(null)} />;
    if (subView === 'family') return <FamilyView member={member} onBack={() => setSubView(null)} />;
    if (subView === 'payments') return <PaymentsView member={member} onBack={() => setSubView(null)} />;
    if (subView === 'notifications') return <NotificationsView member={member} onBack={() => setSubView(null)} />;

    const items = [
        { id: 'profile', label: 'Mi cuenta', icon: <User size={22} /> },
        { id: 'family', label: 'Grupo familiar', icon: <Users size={22} /> },
        { id: 'payments', label: 'Historial de pagos', icon: <CreditCard size={22} /> },
    ];

    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            {/* Profile Summary Header */}
            <div style={{
                background: '#fff', padding: 20, borderRadius: 20, border: '1px solid #eee', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
                <img src={member?.avatarUrl || '/images/avatar_male_casla.png'} alt="Avatar"
                    style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #e8eef5' }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#002e5d' }}>{member?.fullName || 'Socio'}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{member?.email || ''}</div>
                    <div style={{
                        display: 'inline-block', background: '#f0f4f8', padding: '4px 10px', borderRadius: 8,
                        fontSize: 11, fontWeight: 700, color: '#002e5c', marginTop: 6
                    }}>
                        SOCIO N° {member?.memberNumber || '-'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                    <button key={item.id} onClick={() => setSubView(item.id)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20,
                            background: '#fff', borderRadius: 16, border: '1px solid #eee', cursor: 'pointer', width: '100%',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ color: '#002e5d' }}>{item.icon}</div>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>{item.label}</span>
                        </div>
                        <ChevronRight size={18} color="#bbb" />
                    </button>
                ))}
                <button onClick={() => setShowLogoutModal(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: 20, background: '#fff',
                        borderRadius: 16, border: '1px solid #eee', cursor: 'pointer', width: '100%', marginTop: 8,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}>
                    <LogOut size={22} color="#e41c23" />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#e41c23' }}>Cerrar sesión</span>
                </button>
            </div>

            {showLogoutModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24
                }}>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 340, width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: '#002e5d' }}>¿Cerrar sesión?</h3>
                        <p style={{ color: '#4b5563', marginBottom: 32, fontSize: 15, lineHeight: 1.5 }}>¿Estás seguro que deseas salir de tu cuenta de socio?</p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setShowLogoutModal(false)}
                                style={{
                                    flex: 1, padding: '16px 20px', borderRadius: 14, border: '1px solid #e5e7eb', background: '#f9fafb',
                                    color: '#374151', fontWeight: 700, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s'
                                }}>Cancelar</button>
                            <button onClick={onLogout}
                                style={{
                                    flex: 1, padding: '16px 20px', borderRadius: 14, border: 'none', background: '#e41c23',
                                    color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(228,28,35,0.2)'
                                }}>Cerrar sesión</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
