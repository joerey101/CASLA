'use client';

import React, { useState, useEffect } from 'react';
import { Tent, MapPin, Users, Calendar, Clock, CheckCircle2, UserPlus, Search, X, Lock } from 'lucide-react';

export default function EspaciosSection({ currentUser }) {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availability, setAvailability] = useState([]);

    // Booking State
    const [bookingSlot, setBookingSlot] = useState(null); // Slot being booked
    const [memberQuery, setMemberQuery] = useState('');
    const [foundMember, setFoundMember] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Roles: Only ADMIN and STAFF can book
    const canManage = currentUser?.role === 'admin' || currentUser?.role === 'STAFF';

    // Fetch Spaces on mount
    useEffect(() => {
        fetch('/api/spaces')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSpaces(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load spaces", err);
                setLoading(false);
            });
    }, []);

    // Fetch Availability when space or date changes
    useEffect(() => {
        if (selectedSpace && selectedDate) {
            fetch(`/api/availability?spaceId=${selectedSpace.id}&date=${selectedDate}`)
                .then(res => res.json())
                .then(data => setAvailability(data))
                .catch(err => console.error("Failed to load availability", err));
        }
    }, [selectedSpace, selectedDate]);

    // Handle Member Search (Admin Only)
    const searchMember = async () => {
        if (!canManage) return;
        setFoundMember(null);
        try {
            const res = await fetch('/api/members');
            const data = await res.json();
            const found = data.find(m => m.dni === memberQuery || m.memberNumber === memberQuery || m.taxId === memberQuery);
            if (found) setFoundMember(found);
            else alert("Socio no encontrado");
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateBooking = async () => {
        if (!canManage || !foundMember || !bookingSlot) return;
        setBookingLoading(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId: selectedSpace.id,
                    memberId: foundMember.id,
                    date: selectedDate,
                    timeSlot: bookingSlot,
                    createdBy: 'STAFF'
                })
            });
            const data = await res.json();

            if (res.ok) {
                alert(`✅ Reserva confirmada: ${bookingSlot} - ${foundMember.fullName}`);
                setBookingSlot(null);
                setFoundMember(null);
                setMemberQuery('');

                // Refresh availability
                const availRes = await fetch(`/api/availability?spaceId=${selectedSpace.id}&date=${selectedDate}`);
                const availData = await availRes.json();
                setAvailability(availData);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (e) {
            alert("Error de conexión");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right">
            {/* Header */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-black text-blue-900 flex items-center gap-2">
                            <Tent size={24} className="text-blue-600" /> Gestión de Espacios
                        </h2>
                        {!canManage && (
                            <p className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1 inline-flex items-center gap-1 uppercase tracking-tight">
                                <Lock size={10} /> Sólo lectura (Gst. por Operador)
                            </p>
                        )}
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <div className="p-10 text-center text-slate-400">Cargando espacios...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {spaces.map(space => (
                            <div key={space.id}
                                className={`border rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between h-full
                                    ${selectedSpace?.id === space.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-100 bg-white hover:shadow-md'}
                                `}
                                onClick={() => setSelectedSpace(space)}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{space.category}</span>
                                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Users size={10} /> {space.capacity}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-900 transition-colors">{space.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1 font-bold text-blue-600">${space.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Availability Grid */}
            {selectedSpace && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in zoom-in-50 duration-300">
                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-green-600" /> Disponibilidad: {selectedSpace.name}
                        <span className="text-sm font-normal text-slate-400 ml-auto">{selectedDate}</span>
                    </h3>

                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {availability.map(slot => (
                            <button
                                key={slot.time}
                                disabled={!slot.available || !canManage}
                                onClick={() => canManage && setBookingSlot(slot.time)}
                                className={`
                                    p-2 rounded-xl text-center transition-all border
                                    ${slot.available
                                        ? (canManage ? 'bg-white border-slate-200 hover:border-green-500 hover:bg-green-50 text-slate-700' : 'bg-green-50 border-green-100 text-green-700 cursor-default')
                                        : 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed'}
                                `}
                            >
                                <p className="text-xs font-bold">{slot.time}</p>
                                <div className={`mt-1 h-1.5 w-1.5 rounded-full mx-auto ${slot.available ? 'bg-green-500' : 'bg-red-300'}`} />
                            </button>
                        ))}
                    </div>
                    {!canManage && (
                        <p className="mt-4 text-[10px] text-slate-400 font-bold italic">Seleccione una fecha para consultar disponibilidad. Las reservas se gestionan en mostrador/atención al socio.</p>
                    )}
                </div>
            )}

            {/* Booking Modal (Admin Only) */}
            {bookingSlot && canManage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
                        <button onClick={() => { setBookingSlot(null); setFoundMember(null); setMemberQuery(''); }} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"><X /></button>

                        <h3 className="text-xl font-black text-blue-900 mb-1">Nueva Reserva Administrativa</h3>
                        <p className="text-sm text-slate-500 mb-6">{selectedSpace?.name} | {selectedDate} @ {bookingSlot}</p>

                        {!foundMember ? (
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase">Buscar Socio que solicita turno</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-800 focus:outline-blue-500"
                                        placeholder="DNI, CUIT o N° Socio"
                                        value={memberQuery}
                                        onChange={(e) => setMemberQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && searchMember()}
                                        autoFocus
                                    />
                                    <button onClick={searchMember} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700">
                                        <Search size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4">
                                    <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                                        {(foundMember.fullName || foundMember.nombre).charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-900">{foundMember.fullName || foundMember.nombre}</p>
                                        <p className="text-xs text-green-700">N° {foundMember.memberNumber || foundMember.numero} | DNI: {foundMember.dni}</p>
                                    </div>
                                    <button onClick={() => setFoundMember(null)} className="ml-auto text-green-600 hover:text-green-800 text-xs font-bold uppercase tracking-tighter">Cambiar</button>
                                </div>

                                <button
                                    onClick={handleCreateBooking}
                                    disabled={bookingLoading}
                                    className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-800 flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs"
                                >
                                    {bookingLoading ? <><Clock className="animate-spin" /> Procesando...</> : 'Confirmar Reserva Administrativa'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
