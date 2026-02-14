'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Home as HomeIcon, Star, QrCode, Ticket, Building2, MoreHorizontal } from 'lucide-react';
import HomeTab from '@/components/socio/HomeTab';
import AdnPlusTab from '@/components/socio/AdnPlusTab';
import CarnetQRTab from '@/components/socio/CarnetQRTab';
import EntradasTab from '@/components/socio/EntradasTab';
import GobernanzaTab from '@/components/socio/GobernanzaTab';
import MasTab from '@/components/socio/MasTab';
import PurchaseFlow from '@/components/socio/PurchaseFlow';
import SocioSidebar from '@/components/socio/SocioSidebar';
import SocioRightPanel from '@/components/socio/SocioRightPanel';

const TABS = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'adn', label: 'ADN+', icon: Star },
    { id: 'carnet', label: 'CARNET QR', icon: QrCode },
    { id: 'entradas', label: 'Entradas', icon: Ticket },
    { id: 'gobernanza', label: 'Gobernanza', icon: Building2 },
    { id: 'mas', label: 'Más', icon: MoreHorizontal },
];

export default function SocioPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tab, setTab] = useState('home');
    const [member, setMember] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/socio/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.memberId) {
            fetch(`/api/member?id=${session.user.memberId}`)
                .then(r => r.json())
                .then(data => {
                    if (data && !data.error) {
                        setMember(data);
                        fetch(`/api/notifications?memberId=${data.id}`)
                            .then(r => r.json())
                            .then(d => setUnreadCount(d.unreadCount || 0))
                            .catch(() => { });
                    }
                })
                .catch(() => {
                    setMember({
                        id: session.user.memberId,
                        fullName: session.user.name || 'Mariano Pérez',
                        email: session.user.email,
                        memberNumber: '85001', dni: '33000000', category: 'Activo Pleno',
                        status: 'ACTIVO - AL DÍA', seniority: '8 años', phone: '+5491155001234',
                        avatarUrl: '/images/avatar_male_casla.png',
                    });
                });
        }
    }, [status, session]);

    if (status === 'loading') {
        return <div style={{ background: '#002e5d', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Cargando...</div>;
    }

    if (!session) return null;

    if (selectedEvent) {
        return (
            <div style={{ maxWidth: isDesktop ? 1000 : 430, margin: '0 auto', background: '#fff', minHeight: '100dvh', padding: isDesktop ? 40 : 0 }}>
                <PurchaseFlow event={selectedEvent} member={member}
                    onBack={() => setSelectedEvent(null)} />
            </div>
        );
    }

    const renderTab = () => {
        switch (tab) {
            case 'home':
                return <HomeTab member={member} unreadCount={unreadCount}
                    onNotifications={() => setTab('mas')}
                    onEventSelect={setSelectedEvent} isDesktop={isDesktop} />;
            case 'adn': return <AdnPlusTab isDesktop={isDesktop} />;
            case 'carnet': return <CarnetQRTab member={member} isDesktop={isDesktop} />;
            case 'entradas': return <EntradasTab member={member} isDesktop={isDesktop} />;
            case 'gobernanza': return <GobernanzaTab isDesktop={isDesktop} />;
            case 'mas': return <MasTab member={member} onLogout={() => signOut({ callbackUrl: '/socio/login' })} isDesktop={isDesktop} />;
            default: return null;
        }
    };

    if (isDesktop) {
        return (
            <div style={{
                background: '#f1f5f9',
                minHeight: '100vh',
                fontFamily: "'Inter', sans-serif"
            }}>
                <SocioSidebar activeTab={tab} onTabChange={setTab} onLogout={() => signOut({ callbackUrl: '/socio/login' })} />

                <main style={{
                    marginLeft: 280,
                    marginRight: 360,
                    padding: '40px 60px',
                    minHeight: '100vh'
                }}>
                    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                        {renderTab()}
                    </div>
                </main>

                <SocioRightPanel member={member} />
            </div>
        );
    }

    // Mobile View (Legacy)
    return (
        <div style={{
            maxWidth: 430, margin: '0 auto', background: '#fafafa', minHeight: '100dvh',
            position: 'relative', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
            <div style={{ paddingBottom: 80 }}>
                {renderTab()}
            </div>

            <div style={{
                position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '100%', maxWidth: 430, background: '#fff', borderTop: '1px solid #f0f0f0',
                display: 'flex', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
                paddingBottom: 'env(safe-area-inset-bottom, 8px)',
                height: 85, alignItems: 'center'
            }}>
                {TABS.map(t => {
                    const Icon = t.icon;
                    const active = tab === t.id;
                    return (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            style={{
                                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', gap: 4, border: 'none',
                                background: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: '0 4px'
                            }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: 12,
                                background: active ? '#13294b' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: active ? '0 4px 12px rgba(19,41,75,0.4), inset 0 -2px 0 rgba(0,0,0,0.2)' : 'none',
                                border: active ? 'none' : '1px solid transparent',
                                transition: 'all 0.2s',
                                transform: active ? 'scale(1.05)' : 'scale(1)'
                            }}>
                                <Icon size={22} color={active ? '#fff' : '#94a3b8'} strokeWidth={active ? 2.5 : 2} />
                            </div>
                            <span style={{
                                fontSize: 9, fontWeight: active ? 800 : 500,
                                color: active ? '#13294b' : '#94a3b8', letterSpacing: 0.1,
                                transition: 'all 0.2s'
                            }}>{t.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
