'use client';

import React, { useState, useEffect } from 'react';
import {
    DollarSign, Info, ChevronRight, User, Phone,
    Mail, MapPin, Calendar, Heart, GraduationCap,
    Clock, Shield, Edit2, Save, X, Activity, CheckCircle, AlertCircle
} from 'lucide-react';
import DigitalID from '@/components/DigitalID';

// Helper component outside of main render to prevent focus loss on state updates
const EditableField = ({ label, field, value, type = "text", placeholder = "N/A", isEditing, formData, onChange }) => (
    <div className="space-y-1 group relative">
        <div className="flex justify-between items-center pr-4">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{label}</p>
            {isEditing && <Edit2 size={10} className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
        {isEditing ? (
            <input
                type={type}
                value={formData[field] ?? ''}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full bg-blue-50/50 border border-blue-100 rounded-xl p-2.5 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder={placeholder}
            />
        ) : (
            <p className="text-sm font-bold text-slate-800 p-1">{value || placeholder}</p>
        )}
    </div>
);

export default function MemberProfileSection({ searchResult: initialData, onBack, selectMember }) {
    const [searchResult, setSearchResult] = useState(initialData);
    const [activeTab, setActiveTab] = useState('general');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(null);

    // Helper to format date for <input type="date"> (YYYY-MM-DD)
    const formatDateForInput = (dateVal) => {
        if (!dateVal) return '';
        try {
            const d = new Date(dateVal);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };

    // Sync local state with prop
    useEffect(() => {
        if (initialData) {
            setSearchResult(initialData);
            // Ensure dates are formatted for inputs
            const syncData = { ...initialData };
            if (syncData.birthDate) {
                syncData.birthDate = formatDateForInput(syncData.birthDate);
            }
            setFormData(syncData);
        }
    }, [initialData]);

    const seniorityYear = searchResult?.joinedAt
        ? new Date(searchResult.joinedAt).getFullYear()
        : '1986';

    const tabs = [
        { id: 'general', label: 'General', icon: User },
        { id: 'contacto', label: 'Contacto', icon: Phone },
        { id: 'admin', label: 'Administrativo', icon: Shield },
        { id: 'reservas', label: 'Mis Turnos', icon: Activity },
        { id: 'familia', label: 'Grupo Familiar', icon: Heart },
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: 'info', text: 'Guardando cambios...' });
        try {
            // Filter out relations and undefined fields to avoid Prisma errors
            const payload = { ...formData };
            delete payload.familyMembers;
            delete payload.bookings;
            delete payload.payments;
            delete payload.interactions;
            delete payload.accessLogs;
            delete payload.tickets;
            delete payload.notifications;
            delete payload.documents;

            const resp = await fetch(`/api/members/${searchResult.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const updated = await resp.json();
            if (resp.ok) {
                setSearchResult(updated);

                // Sync formData with updated results (formatting dates for inputs)
                const nextFormData = { ...updated };
                if (nextFormData.birthDate) {
                    nextFormData.birthDate = formatDateForInput(nextFormData.birthDate);
                }
                setFormData(nextFormData);

                setIsEditing(false);
                setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                throw new Error(updated.error || 'Error al guardar');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (!searchResult) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Mensajes de feedback */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-600 text-white' :
                    message.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-black">{message.text}</p>
                </div>
            )}

            {/* Nav Superior */}
            <div className="flex justify-between items-center mb-2">
                <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-blue-900 flex items-center gap-2">← Volver al Dashboard</button>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (isEditing) setFormData(searchResult);
                            setIsEditing(!isEditing);
                        }}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isEditing ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'}`}
                    >
                        {isEditing ? <><X size={14} /> Cancelar</> : <><Edit2 size={14} /> Editar Ficha</>}
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-blue-800 disabled:opacity-50 transition-all"
                        >
                            {isSaving ? <><Clock className="animate-spin" size={14} /> Guardando...</> : <><Save size={14} /> Guardar Cambios</>}
                        </button>
                    )}
                </div>
            </div>

            {/* Header del Socio */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="flex gap-6 items-center z-10">
                    <div className="relative">
                        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center text-4xl font-black text-slate-300 border-4 border-white shadow-sm">
                            {(searchResult.fullName || searchResult.nombre || '?').charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white">
                            <Shield size={16} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <input
                                    className="text-2xl font-black text-blue-900 uppercase bg-blue-50 p-2 rounded-xl outline-none border border-blue-100"
                                    value={formData.fullName || ''}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-2xl md:text-3xl font-black text-blue-900 uppercase leading-none">{searchResult.fullName || searchResult.nombre}</h2>
                            )}
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-100 transition-all">
                                Socio desde {seniorityYear}
                            </span>
                        </div>
                        <div className="flex gap-4 mt-2 text-sm text-slate-500 font-bold uppercase tracking-tight">
                            <span>#{searchResult.memberNumber || searchResult.numero}</span>
                            <span className="text-slate-300">•</span>
                            <span>{searchResult.category || searchResult.categoria}</span>
                            <span className="text-slate-300">•</span>
                            <span className={`font-black ${(searchResult.status || searchResult.estado || '').includes('ACTIVO') ? 'text-green-600' : 'text-red-600'}`}>
                                {searchResult.status || searchResult.estado}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 items-center z-10">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Total</p>
                        <p className={`text-3xl font-black ${searchResult.saldo < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            $ {searchResult.saldo?.toLocaleString() || '0'}
                        </p>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-slate-50 opacity-50 pointer-events-none" />
            </div>

            {/* 1. SECCIÓN: CARNET DIGITAL (NUEVA FILA COMPLETA) */}
            <div className="w-full mb-6">
                <DigitalID variant="horizontal" />
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Lateral: Tabs Menú (AHORA A LA IZQUIERDA SOLITO) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-1 sticky top-6">
                        <div className="px-4 py-3 mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navegación</p>
                        </div>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-blue-900 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 text-left'}`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && <ChevronRight size={16} className="ml-auto animate-in slide-in-from-left-2" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido Central (A LA DERECHA) */}
                <div className="lg:col-span-9">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[500px]">

                        {/* TAB: GENERAL */}
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Identidad & Datos Filiares</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <EditableField label="Nombre Completo" field="fullName" value={searchResult.fullName} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <EditableField label="DNI" field="dni" value={searchResult.dni} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <EditableField label="CUIT / CUIL" field="taxId" value={searchResult.taxId} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <EditableField label="Fecha de Nacimiento" field="birthDate" value={searchResult.birthDate ? new Date(searchResult.birthDate).toLocaleDateString() : '-'} type="date" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Pertenencia</h3>
                                    <div className="bg-blue-900 text-white p-8 rounded-3xl flex items-center gap-8 relative overflow-hidden group">
                                        <div className="bg-[#da291c] w-24 h-24 rounded-2xl flex flex-col items-center justify-center border border-white/20 shadow-lg">
                                            <p className="text-[10px] font-black opacity-80 uppercase">Desde</p>
                                            <p className="text-3xl font-black">{seniorityYear}</p>
                                        </div>
                                        <div className="relative z-10">
                                            <p className="font-black text-2xl tracking-tight mb-1">Pasión Cuerva</p>
                                            <p className="text-sm font-medium text-blue-100 italic opacity-90">"Llevás el sentimiento de Boedo desde hace {new Date().getFullYear() - seniorityYear} años"</p>
                                        </div>
                                        <Shield size={120} className="absolute -right-8 -bottom-8 opacity-5 text-white group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* TAB: CONTACTO */}
                        {activeTab === 'contacto' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2 flex items-center gap-2">
                                        <Mail size={16} className="text-blue-500" /> Comunicación Digital
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <EditableField label="Email Principal" field="email" value={searchResult.email} type="email" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <EditableField label="Email Secundario (+1)" field="secondaryEmail" value={searchResult.secondaryEmail} type="email" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2 flex items-center gap-2">
                                        <Phone size={16} className="text-green-500" /> Teléfonos de Contacto
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <EditableField label="Celular Principal" field="phone" value={searchResult.phone} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <EditableField label="Teléfono Alternativo (+1)" field="alternativePhone" value={searchResult.alternativePhone} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2 flex items-center gap-2">
                                        <MapPin size={16} className="text-red-500" /> Domicilio Registrado
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2"><EditableField label="Dirección de Cobro / Envío" field="addressBilling" value={searchResult.addressBilling} isEditing={isEditing} formData={formData} onChange={handleInputChange} /></div>
                                        <EditableField label="Localidad" field="city" value={searchResult.city} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <EditableField label="Código Postal" field="zipCode" value={searchResult.zipCode} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* TAB: ADMINISTRATIVO */}
                        {activeTab === 'admin' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Estado Administrativo</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <EditableField label="Categoría" field="category" value={searchResult.category} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <EditableField label="Estado" field="status" value={searchResult.status} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-400 font-black uppercase">Antigüedad</p>
                                            <p className="text-base font-bold text-slate-800 p-1">{searchResult.seniority || '-'}</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Abono & Cancha</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-6 border-2 border-slate-50 rounded-3xl bg-slate-50/30">
                                            <EditableField label="Ubicación" field="seatLocation" value={searchResult.seatLocation} placeholder="No Posee" isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <EditableField label="Sector" field="sector" value={searchResult.sector} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                                <EditableField label="Puerta" field="gate" value={searchResult.gate} isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="p-6 border-2 border-slate-100 rounded-3xl flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Padrón Electoral 2026</p>
                                                <p className="font-black text-xl text-slate-800">HABILITADO</p>
                                            </div>
                                            <div className="bg-green-100 text-green-700 w-12 h-12 rounded-2xl flex items-center justify-center">
                                                <CheckCircle size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* TAB: RESERVAS */}
                        {activeTab === 'reservas' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2 flex items-center gap-2">
                                        <Activity size={16} className="text-blue-500" /> Turnos & Reservas Asignadas
                                    </h3>
                                    <div className="space-y-4">
                                        {searchResult.bookings && searchResult.bookings.length > 0 ? (
                                            searchResult.bookings.map((booking, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-900 border border-slate-100">
                                                            <Calendar size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-blue-900">{booking.space?.name || 'Espacio'}</p>
                                                            <p className="text-xs text-slate-500 font-bold">{new Date(booking.date).toLocaleDateString()} • {booking.timeSlot} hs</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {booking.status}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                                <Activity size={40} className="mx-auto text-slate-300 mb-4" />
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No posee reservas vigentes</p>
                                                <p className="text-xs text-slate-400 mt-1">Los turnos deben ser cargados por un operador.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* TAB: FAMILIA */}
                        {activeTab === 'familia' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <section>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-2">Vínculos Familiares</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {searchResult.familyMembers && searchResult.familyMembers.length > 0 ? (
                                            searchResult.familyMembers.map((fam, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => selectMember(fam)}
                                                    className="group flex items-center gap-4 p-5 border border-slate-100 rounded-3xl hover:border-blue-400 transition-all cursor-pointer bg-white"
                                                >
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-blue-900 group-hover:text-white transition-all">
                                                        {fam.fullName.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-slate-800 text-sm group-hover:text-blue-900 transition-colors uppercase">{fam.fullName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold">{fam.relationship} • #{fam.memberNumber}</p>
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-900 transition-all" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="md:col-span-2 p-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                                <Heart size={40} className="mx-auto text-slate-100 mb-4" />
                                                <p className="text-sm font-black text-slate-400 uppercase">Sin grupo vinculado</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
