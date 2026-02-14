'use client';
import { useState } from 'react';
import { ChevronRight, ExternalLink, ArrowLeft, FileText } from 'lucide-react';
import { GOBERNANZA } from '@/data/gobernanza';

export default function GobernanzaTab({ isDesktop }) {
    const [subView, setSubView] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const allItems = [...GOBERNANZA.institucional, ...GOBERNANZA.extras];
    const deportes = GOBERNANZA.deportes;

    const handleBack = () => {
        setSubView(null);
        setSelectedItem(null);
    };

    // Sub-view: Marco Institucional
    if (subView === 'marco') {
        const doc = allItems.find(i => i.id === 'marco');
        return (
            <div style={{ padding: 20, paddingBottom: 100 }}>
                <button onClick={handleBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: '#3b82f6', fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontSize: 14
                    }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <h2 style={{ fontSize: isDesktop ? 28 : 20, fontWeight: 800, marginBottom: 24, color: '#002e5d' }}>Marco Institucional</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
                    gap: 12
                }}>
                    {doc.documents.map((d, i) => (
                        <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20,
                                background: '#fff', borderRadius: 20, textDecoration: 'none', color: '#1e293b',
                                border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                transition: 'transform 0.15s'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FileText size={20} color="#002e5d" />
                                <span style={{ fontSize: 14, fontWeight: 700 }}>{d.label}</span>
                            </div>
                            <ExternalLink size={16} color="#94a3b8" />
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    // Sub-view: Balances
    if (subView === 'balances') {
        const balances = allItems.find(i => i.id === 'balances');
        const years = Object.entries(balances.yearLinks).sort((a, b) => b[0] - a[0]);
        return (
            <div style={{ padding: 20, paddingBottom: 100 }}>
                <button onClick={handleBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: '#3b82f6', fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontSize: 14
                    }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <h2 style={{ fontSize: isDesktop ? 28 : 20, fontWeight: 800, marginBottom: 24, color: '#002e5d' }}>Balances y Estados Contables</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(180px, 1fr))' : '1fr 1fr',
                    gap: 12
                }}>
                    {years.map(([year, url]) => (
                        <a key={year} href={url} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                padding: 24, background: '#fff', borderRadius: 20, textDecoration: 'none',
                                border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s'
                            }}>
                            <FileText size={20} color="#002e5d" />
                            <span style={{ fontSize: 18, fontWeight: 800, color: '#002e5d' }}>{year}</span>
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    // Sub-view: Deportes
    if (subView === 'deportes') {
        return (
            <div style={{ padding: 20, paddingBottom: 100 }}>
                <button onClick={handleBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: '#3b82f6', fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontSize: 14
                    }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <h2 style={{ fontSize: isDesktop ? 28 : 20, fontWeight: 800, marginBottom: 24, color: '#002e5d' }}>Deportes y Actividades</h2>
                <div style={{
                    background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                            <thead>
                                <tr style={{ background: '#002e5d' }}>
                                    <th style={{ textAlign: 'left', padding: '16px 24px', color: '#fff', fontWeight: 800 }}>Deporte/Actividad</th>
                                    <th style={{ textAlign: 'left', padding: '16px 24px', color: '#fff', fontWeight: 800 }}>Responsable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deportes.map((d, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                        <td style={{ padding: '16px 24px', fontWeight: 700, color: '#1e293b' }}>{d.deporte}</td>
                                        <td style={{ padding: '16px 24px', color: '#64748b', fontWeight: 500 }}>{d.responsable}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Sub-view: Contact (New - missing info fix)
    if (subView === 'contact' && selectedItem) {
        return (
            <div style={{ padding: 20, paddingBottom: 100 }}>
                <button onClick={handleBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: '#3b82f6', fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontSize: 14
                    }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <div style={{ maxWidth: 800, margin: isDesktop ? '0 auto' : '0' }}>
                    <h2 style={{ fontSize: isDesktop ? 32 : 24, fontWeight: 900, marginBottom: 20, color: '#002e5d' }}>
                        {selectedItem.label}
                    </h2>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 32, fontWeight: 500 }}>
                            {selectedItem.description}
                        </p>
                        <div style={{ height: '1px', background: '#f1f5f9', marginBottom: 32 }} />
                        <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: 20, alignItems: isDesktop ? 'center' : 'stretch' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Contacto vía Email</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{selectedItem.email}</div>
                            </div>
                            <a href={`mailto:${selectedItem.email}`}
                                style={{
                                    background: '#002e5d', color: '#fff', padding: '16px 32px', borderRadius: 16,
                                    textDecoration: 'none', fontSize: 15, fontWeight: 800, textAlign: 'center',
                                    boxShadow: '0 10px 20px rgba(0,46,93,0.2)'
                                }}>
                                Enviar Consulta
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main menu
    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            <h2 style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 800, marginBottom: 24, color: isDesktop ? '#002e5d' : '#111' }}>Gobernanza Abierta</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
                gap: 12
            }}>
                {allItems.map(item => {
                    const handleClick = () => {
                        if (item.type === 'link') window.open(item.url, '_blank');
                        else if (item.type === 'document_list') setSubView('marco');
                        else if (item.type === 'survey') window.open(item.url, '_blank');
                        else if (item.type === 'year_list') setSubView('balances');
                        else if (item.id === 'deportes') setSubView('deportes');
                        else if (item.type === 'contact') {
                            setSelectedItem(item);
                            setSubView('contact');
                        }
                    };

                    return (
                        <button key={item.id} onClick={handleClick}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20,
                                background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', cursor: 'pointer',
                                textAlign: 'left', width: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s',
                                overflow: 'hidden'
                            }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{item.label}</span>
                            {item.type === 'coming_soon' ? (
                                <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 900, background: '#ef444415', padding: '4px 8px', borderRadius: 8 }}>PRÓXIMAMENTE</span>
                            ) : <ChevronRight size={18} color="#cbd5e1" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
