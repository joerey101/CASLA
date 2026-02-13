'use client';
import { ADN_PLUS_LINKS } from '@/data/gobernanza';

export default function AdnPlusTab() {
    return (
        <div style={{ padding: 20, paddingBottom: 100 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: '#111' }}>ADN+</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {ADN_PLUS_LINKS.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100,
                            background: '#13294b', borderRadius: 20, textDecoration: 'none',
                            boxShadow: '0 8px 16px rgba(19,41,75,0.2)', transition: 'transform 0.15s, box-shadow 0.15s',
                            overflow: 'hidden', padding: 20
                        }}>
                        <img
                            src={link.logoUrl}
                            alt={link.label}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '85%',
                                objectFit: 'contain'
                            }}
                        />
                    </a>
                ))}
            </div>

            <div style={{ marginTop: 32, padding: 20, background: '#f8fafc', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
                    Accede a beneficios exclusivos y herramientas premium para socios ADN CASLA.
                </p>
            </div>
        </div>
    );
}
