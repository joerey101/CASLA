'use client';
import { Home, Star, QrCode, Ticket, Building2, MoreHorizontal, Settings, LogOut } from 'lucide-react';

const MENU_ITEMS = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'adn', label: 'ADN+', icon: Star },
    { id: 'carnet', label: 'Mi Carnet', icon: QrCode },
    { id: 'entradas', label: 'Entradas', icon: Ticket },
    { id: 'gobernanza', label: 'Gobierno', icon: Building2 },
];

export default function SocioSidebar({ activeTab, onTabChange, onLogout }) {
    return (
        <aside style={{
            width: 280,
            background: 'linear-gradient(180deg, #002e5d 0%, #001a3a 100%)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 20px',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            color: '#fff'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60, paddingLeft: 10 }}>
                <img src="/logos/CASLA_logo.png" alt="CASLA" style={{ width: 40, height: 40 }} />
                <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>
                    CASLA <span style={{ color: '#3b82f6' }}>ADN</span>
                </span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                                padding: '14px 20px',
                                borderRadius: 16,
                                border: 'none',
                                background: isActive ? '#fff' : 'transparent',
                                color: isActive ? '#002e5d' : 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'left',
                                fontWeight: isActive ? 700 : 500,
                                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: isActive ? '0 10px 20px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            <Icon size={22} color={isActive ? '#002e5d' : 'rgba(255,255,255,0.7)'} strokeWidth={isActive ? 2.5 : 2} />
                            <span style={{ fontSize: 16 }}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                    onClick={() => onTabChange('mas')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 12,
                        border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                        fontSize: 14, fontWeight: 600
                    }}
                >
                    <Settings size={18} /> Configuración
                </button>
                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 12,
                        border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer',
                        fontSize: 14, fontWeight: 600
                    }}
                >
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
