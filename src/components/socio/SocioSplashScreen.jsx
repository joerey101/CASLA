'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

export default function SocioSplashScreen({ onEnter }) {
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const trackRef = useRef(null);

    const SLIDER_WIDTH = 280;
    const KNOB_SIZE = 56;
    const MAX_DRAG = SLIDER_WIDTH - KNOB_SIZE - 8;

    const handleStart = (e) => {
        setIsDragging(true);
    };

    const handleMove = useCallback((e) => {
        if (!isDragging) return;
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const trackRect = trackRef.current.getBoundingClientRect();
        let newX = clientX - trackRect.left - KNOB_SIZE / 2;

        if (newX < 0) newX = 0;
        if (newX > MAX_DRAG) newX = MAX_DRAG;

        setDragX(newX);

        if (newX >= MAX_DRAG * 0.95) {
            setIsDragging(false);
            setDragX(MAX_DRAG);
            onEnter();
        }
    }, [isDragging, MAX_DRAG, onEnter]);

    const handleEnd = useCallback(() => {
        if (dragX < MAX_DRAG * 0.95) {
            setDragX(0);
        }
        setIsDragging(false);
    }, [dragX, MAX_DRAG]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, handleMove, handleEnd]); // Ahora con dependencias estables

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: '#002e5d', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
            padding: '80px 40px 60px', overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Background Image with Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/images/splash_bg.png)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: 0.4, zIndex: -1
            }} />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,46,93,0.8), #002e5d)',
                zIndex: -1
            }} />

            {/* Top Section: Shield and Brand */}
            <div style={{ textAlign: 'center', animation: 'fadeInDown 1s ease-out' }}>
                <img src="/logos/CASLA_logo.png" alt="CASLA"
                    style={{ width: 120, height: 120, marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }} />
                <h1 style={{
                    fontSize: 32, fontWeight: 900, color: '#fff',
                    letterSpacing: 2, margin: 0, textTransform: 'uppercase'
                }}>
                    ADN CASLA
                </h1>
                <p style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.6)',
                    marginTop: 8, fontWeight: 500, letterSpacing: 1
                }}>
                    EL CLUB MÁS HERMOSO DEL MUNDO
                </p>
            </div>

            {/* Middle Spacer */}
            <div style={{ flex: 1 }} />

            {/* Bottom Section: Slider */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                    ref={trackRef}
                    style={{
                        width: SLIDER_WIDTH, height: 64, background: 'rgba(255,255,255,0.1)',
                        borderRadius: 32, border: '1px solid rgba(255,255,255,0.2)',
                        position: 'relative', display: 'flex', alignItems: 'center',
                        padding: 4, backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Track Text */}
                    <div style={{
                        position: 'absolute', width: '100%', textAlign: 'center',
                        fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
                        pointerEvents: 'none', letterSpacing: 1, textTransform: 'uppercase'
                    }}>
                        Deslizar para entrar
                    </div>

                    {/* Knob */}
                    <div
                        onMouseDown={handleStart}
                        onTouchStart={handleStart}
                        style={{
                            width: KNOB_SIZE, height: KNOB_SIZE, borderRadius: '50%',
                            background: '#e41c23', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#fff', cursor: 'grab',
                            position: 'absolute', left: 4 + dragX,
                            transition: isDragging ? 'none' : 'left 0.3s ease-out',
                            boxShadow: '0 4px 12px rgba(228,28,35,0.4)',
                            zIndex: 2
                        }}
                    >
                        <ChevronRight size={28} strokeWidth={3} />
                    </div>

                    {/* Active Track Overlay */}
                    <div style={{
                        position: 'absolute', left: 4, top: 4, bottom: 4,
                        width: dragX + KNOB_SIZE / 2, background: 'rgba(228,28,35,0.2)',
                        borderRadius: 28, pointerEvents: 'none',
                        transition: isDragging ? 'none' : 'width 0.3s ease-out'
                    }} />
                </div>

                <p style={{
                    marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.4)',
                    textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1
                }}>
                    © 2026 San Lorenzo de Almagro
                </p>
            </div>

            <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
