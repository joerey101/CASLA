'use client';
import { useState } from 'react';
import { ChevronRight, ExternalLink, ArrowLeft, FileText } from 'lucide-react';
import { GOBERNANZA } from '@/data/gobernanza';

export default function GobernanzaTab() {
    const [subView, setSubView] = useState(null);

    const allItems = [...GOBERNANZA.institucional, ...GOBERNANZA.extras];
    const deportes = GOBERNANZA.deportes;

    // Sub-view: Marco Institucional
    if (subView === 'marco') {
        const doc = allItems.find(i => i.id === 'marco');
        return (
            <div style={{ padding: 20, paddingBottom: 100 }}>
                <button onClick={() => setSubView(null)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: '#002e5d', fontWeight: 600, cursor: 'pointer', marginBottom: 20, fontSize: 14
                    }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: '#111' }}>Marco Institucional</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {doc.documents.map((d, i) => (
                        <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16,
                                background: '#fff', borderRadius: 14, textDecoration: 'none', color: '#333',
                                border: '1px solid #eee', boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FileText size={18} color="#002e5d" />
                                <span style={{ fontSize: 14, fontWeight: 500 }}>{d.label}</span>
                            </div>
                            <ExternalLink size={14} color="#999" />
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
                <button onClick={() => setSubView(null)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: '#002e5d', fontWeight: 600, cursor: 'pointer', marginBottom: 20, fontSize: 14
                    }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: '#111' }}>Balances y Estados Contables</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {years.map(([year, url]) => (
                        <a key={year} href={url} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: 16, background: '#fff', borderRadius: 14, textDecoration: 'none',
                                border: '1px solid #eee', boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                                transition: 'transform 0.15s'
                            }}>
                            <FileText size={16} color="#002e5d" />
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#002e5d' }}>{year}</span>
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
                <button onClick={() => setSubView(null)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                        color: '#002e5d', fontWeight: 600, cursor: 'pointer', marginBottom: 20, fontSize: 14
                    }}>
                    <ArrowLeft size={18} /> Volver
                </button>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: '#111' }}>Deportes y Actividades</h2>
                <div style={{
                    background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #eee',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: '#002e5d' }}>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#fff', fontWeight: 600 }}>Deporte/Actividad</th>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#fff', fontWeight: 600 }}>Responsable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deportes.map((d, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 500, color: '#333' }}>{d.deporte}</td>
                                        <td style={{ padding: '12px 16px', color: '#666' }}>{d.responsable}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Main menu
    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: '#111' }}>Gobernanza Abierta</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allItems.map(item => {
                    const handleClick = () => {
                        if (item.type === 'link') window.open(item.url, '_blank');
                        else if (item.type === 'document_list') setSubView('marco');
                        else if (item.type === 'survey') window.open(item.url, '_blank');
                        else if (item.type === 'year_list') setSubView('balances');
                        else if (item.id === 'deportes') setSubView('deportes');
                        else if (item.type === 'contact') window.open(`mailto:${item.email}`, '_blank');
                    };

                    return (
                        <button key={item.id} onClick={handleClick}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16,
                                background: '#fff', borderRadius: 14, border: '1px solid #eee', cursor: 'pointer',
                                textAlign: 'left', width: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                                transition: 'transform 0.15s'
                            }}>
                            <span style={{ fontSize: 15, fontWeight: 500, color: '#333' }}>{item.label}</span>
                            {item.type === 'coming_soon' ? (
                                <span style={{ fontSize: 11, color: '#e41c23', fontWeight: 700, letterSpacing: 0.5 }}>PRÓXIMAMENTE</span>
                            ) : <ChevronRight size={16} color="#999" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
