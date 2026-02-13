'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, CheckCircle2, CreditCard, X, QrCode, Share2,
  Printer, Settings, Bell
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

// --- Components ---
import LoginScreen from '@/components/LoginScreen';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

// --- Sections ---
import DashboardSection from '@/components/sections/DashboardSection';
import MemberProfileSection from '@/components/sections/MemberProfileSection';
import AltaExpressSection from '@/components/sections/AltaExpressSection';
import EntradasSection from '@/components/sections/EntradasSection';
import AbonosSection from '@/components/sections/AbonosSection';
import EspaciosSection from '@/components/sections/EspaciosSection';
import SolicitudesSection from '@/components/sections/SolicitudesSection';
import TramitesSection from '@/components/sections/TramitesSection';
import ScriptsSection from '@/components/sections/ScriptsSection';
import GestionSection from '@/components/sections/GestionSection';
import CasosSection from '@/components/sections/CasosSection';

const SHIELD_URL = '/logos/CASLA_logo.png';
const WHATSAPP_NUMBER = "+54 9 11 5333-6237";

export default function App() {
  // === AUTH ===
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const currentUser = isAuthenticated && session ? {
    name: session.user.name || 'Usuario',
    role: (session.user.role || 'admin').toLowerCase(),
    avatar: (session.user.name || 'U').charAt(0).toUpperCase(),
    memberId: session.user.memberId
  } : null;

  // === GLOBAL DATA ===
  const [database, setDatabase] = useState([]);
  const [news] = useState({
    title: "¡Venta de Abonos 2026 Habilitada!",
    content: "Ya se encuentra disponible la renovación de Tu Lugar con 10% OFF pagando en efectivo en Sede Av. La Plata.",
    type: "info"
  });
  const [matches, setMatches] = useState([
    { id: 1, rival: "Estudiantes (RC)", torneo: "Copa LPF", fecha: "19/02 21:15", precios: { pop: 15000, platea: 45000 } },
    { id: 2, rival: "Instituto", torneo: "Copa LPF", fecha: "24/02 18:00", precios: { pop: 15000, platea: 40000 } },
    { id: 3, rival: "Independiente", torneo: "Clásico", fecha: "07/03 19:15", precios: { pop: 20000, platea: 60000 }, highlight: true },
  ]);
  const [directorPlan] = useState({
    phase: "Fase 1: Estabilización", status: "En curso (Semana 2)",
    riskLevel: "Alto (Pre-Partido)", nextMatch: "vs Huracán (08 Feb)",
    focus: "Control de Daños & Wiki v1"
  });
  const [commonSpaces] = useState([
    { id: 'q1', name: 'Quincho Mayor', type: 'Social', capacity: 150, status: 'Disponible', price: 50000, location: 'Ciudad Deportiva' },
    { id: 'q2', name: 'Quincho Tenis', type: 'Social', capacity: 50, status: 'Ocupado', price: 30000, location: 'Ciudad Deportiva' },
    { id: 't1', name: 'Cancha Tenis 1', type: 'Deportivo', capacity: 4, status: 'Disponible', price: 8000, location: 'Ciudad Deportiva' },
    { id: 't2', name: 'Cancha Tenis 2', type: 'Deportivo', capacity: 4, status: 'Mantenimiento', price: 8000, location: 'Ciudad Deportiva' },
    { id: 'pando', name: 'Polideportivo Pando', type: 'Estadio', capacity: 2000, status: 'Reservado (Futsal)', price: 0, location: 'Boedo' },
    { id: 'sum', name: 'SUM Vitalicios', type: 'Social', capacity: 80, status: 'Disponible', price: 40000, location: 'Boedo' },
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([]);

  // === SCRIPTS & KB ===
  const scripts = {
    whatsapp: [
      { id: 'ws1', title: 'Bienvenida (Cercanía)', text: `¡Hola, Cuervo/a! 💙❤️ Qué alegría darte la bienvenida oficial. Ya sos parte de esta familia. Tu trámite de alta está completo y ya podés disfrutar del Club. Cualquier duda, estoy acá para ayudarte.` },
      { id: 'ws2', title: 'Alta Web (Autogestión)', text: `Para asociarte sin moverte de casa, ingresá acá: botm.cc/alta. Es rápido, seguro y empezás a disfrutar los beneficios hoy mismo.` },
      { id: 'ws3', title: 'Gestión de Mora (Empatía)', text: `Hola, te escribimos para ayudarte a regularizar tu situación. Queremos que sigas siendo parte. Tenemos planes especiales de 3 y 6 cuotas sin interés. ¿Te cuento más?` },
      { id: 'ws4', title: 'Zona de Débito (Tranquilidad)', text: `¡Quedate tranquilo! 🛑 Si en MiCASLA ves "Pedido por débito" en rojo, es solo un aviso de que el cobro está en proceso bancario. Tu carnet está habilitado y podés entrar a la cancha sin problemas.` },
      { id: 'ws5', title: 'Error de Cobro (Resolución)', text: `Te pedimos disculpas por el inconveniente. Ya detectamos el error administrativo. No te preocupes, gestionamos el reintegro inmediato o te dejamos el saldo a favor, lo que prefieras. Gracias por la paciencia.` },
      { id: 'ws6', title: 'Info Carnet', text: `💳 *Carnet Físico*\nCosto Alta/Renovación: $15.000.\nReposición (Pérdida): $19.000.\nPor Robo: SIN CARGO (con denuncia policial).` },
      { id: 'ws7', title: 'Acceso Pando/Deportes', text: `Para ingresar al Pando o actividades deportivas, recordá tener tu cuota al día y el apto médico vigente.` },
      { id: 'ws8', title: 'Abono Familiar', text: `El Abono Familiar cubre a todo tu grupo (Titular + Adicionales). Podés gestionarlo desde la sección 'Abono Familiar' en tu perfil.` }
    ],
    email: [
      { id: 'em1', title: 'Resolución Reclamo', text: "Estimado/a Socio/a:\n\nNos ponemos en contacto para informarte que hemos resuelto el inconveniente reportado.\n\nAtentamente,\nAtención al Socio." },
      { id: 'em2', title: 'Confirmación Baja', text: "Confirmamos la recepción de tu solicitud. Lamentamos que tengas que dejar el Club momentáneamente." }
    ]
  };

  const requestsKB = [
    { id: 1, tag: "Administrativo", title: "Error en Ranking", question: "¿Fuiste al partido y no sumaste?", solution: "Verificar molinete y cargar presente manual." },
    { id: 2, tag: "Cobranzas", title: "Doble Débito", question: "¿Te cobraron dos veces la cuota?", solution: "Pedir comprobante y generar Nota de Crédito." },
    { id: 3, tag: "Accesos", title: "Carnet no pasa", question: "¿Luz roja en molinete?", solution: "Verificar pago o chip dañado." },
    { id: 4, tag: "Categoría", title: "Pase a Activo", question: "¿Cumpliste 18 años?", solution: "El pase es automático, verificar padrón." },
    { id: 5, tag: "Abonos", title: "Renovación", question: "¿Querés mantener tu lugar?", solution: "Ventana de prioridad hasta el día 15." },
    { id: 6, tag: "Tecnología", title: "Error App", question: "¿No abre MiCASLA?", solution: "Reinstalar App o resetear contraseña." },
    { id: 7, tag: "Tienda", title: "Descuento Indumentaria", question: "¿No aplica el 15%?", solution: "Verificar que el DNI esté cargado en Nike." },
    { id: 8, tag: "Vitalicios", title: "Diploma", question: "¿Cuándo se entrega?", solution: "Acto anual en noviembre." },
    { id: 9, tag: "Peñas", title: "Oficialización", question: "¿Requisitos nueva peña?", solution: "Enviar nómina de 15 socios al Depto de Peñas." },
    { id: 10, tag: "Deportes", title: "Cupo Natación", question: "¿Hay vacantes?", solution: "Consultar sistema de Deportes en tiempo real." },
  ];

  const tramitesGuia = [
    { title: "Alta de Socio", steps: ["Cargar datos personales", "Seleccionar categoría", "Adjuntar DNI frente/dorso", "Pagar inscripción"], action: "Iniciar Alta" },
    { title: "Adhesión Débito", steps: ["Buscar socio", "Ir a 'Pagos Extras'", "Cargar tarjeta", "Validar $1"], action: "Adherir" },
    { title: "Renovación Carnet", steps: ["Verificar estado al día", "Cobrar $15.000", "Tomar foto nueva", "Imprimir"], action: "Renovar" },
    { title: "Baja Voluntaria", steps: ["Validar identidad", "Ofrecer alternativa económica", "Registrar motivo", "Confirmar baja"], action: "Procesar Baja" },
    { title: "Cambio Categoría", steps: ["Verificar edad", "Calcular prorrateo", "Actualizar en sistema"], action: "Cambiar" },
  ];

  const faqs = [
    { q: "¿Qué trámites puedo hacer por WhatsApp?", a: `A través del ${WHATSAPP_NUMBER} podés: consultar tu estado de deuda, solicitar el alta como nuevo socio, adherirte al débito automático y resolver dudas sobre accesos al estadio.` },
    { q: "¿A partir de qué edad pagan cuota los menores?", a: "Los menores de 6 años tienen cuota $0. Deben tramitar el carnet infantil por cuestiones de seguro y control de capacidad." },
    { q: "¿Cómo funciona el Ranking de Entradas?", a: "Sumás puntos por antigüedad, cuota al día y asistencia a partidos previos. Es fundamental apoyar el carnet en el molinete para dar el presente." },
    { q: "¿Qué puerta me corresponde si tengo Abono a Platea?", a: "Platea Sur (Puerta 10/11), Platea Norte (Puerta 4/5), Popular local (Puerta 1)." },
  ];

  // === UI STATE ===
  const [activeTab, setActiveTab] = useState('inicio');
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [ticketModal, setTicketModal] = useState(null);
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [editMatchModal, setEditMatchModal] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);

  // === DATA FETCHING ===
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/member')
        .then(res => res.json())
        .then(data => { if (data && !data.error) { setSearchResult(data); setShowMemberProfile(true); } })
        .catch(err => console.error("Failed to fetch member", err));

      fetch('/api/members')
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setDatabase(data); })
        .catch(err => console.error("Failed to fetch database", err));
    }
  }, [isAuthenticated]);

  // === HANDLERS ===
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleSearch = (query) => {
    if (!query) return;
    const cleanQuery = query.replace(/\./g, "").replace(/\s/g, "").toLowerCase();
    const found = database.filter(s => {
      const cleanNumero = (s.memberNumber || s.numero || "").toString().replace(/\./g, "");
      const cleanDNI = (s.dni || "").toString().replace(/\./g, "");
      const fullName = (s.fullName || s.nombre || "").toLowerCase();
      return cleanNumero === cleanQuery || cleanDNI === cleanQuery || fullName.includes(query.toLowerCase());
    });

    if (found.length === 1) {
      setSearchResult(found[0]); setSearchResults([]); setShowMemberProfile(true);
    } else if (found.length > 1) {
      setSearchResults(found); setSearchResult(null); setShowMemberProfile(false); setActiveTab('inicio');
    } else {
      alert("Socio no encontrado. Tip: Probá con 'Juan Carlos Cuervo' o '90123'.");
      setSearchResult(null); setSearchResults([]);
    }
    setIsMobileMenuOpen(false);
  };

  const selectMember = (member) => {
    setSearchResult(member); setSearchResults([]); setShowMemberProfile(true);
  };

  const handleGenerateTicket = (type) => {
    const price = type === 'popular' ? ticketModal.precios.pop : ticketModal.precios.platea;
    setGeneratedTicket({
      match: ticketModal.rival, date: ticketModal.fecha,
      sector: type === 'popular' ? 'Popular Local' : 'Platea Sur',
      price, id: Math.random().toString(36).substring(7).toUpperCase(),
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CASLA-TICKET-${Math.floor(Math.random() * 10000)}`
    });
  };

  const shareOnWhatsApp = () => {
    const text = `🎟️ Tu entrada para SAN LORENZO vs ${generatedTicket.match}\n📍 Sector: ${generatedTicket.sector}\n🔑 Código: ${generatedTicket.id}\n🟦🟥 ¡VAMOS CICLÓN!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const handleSaveMatch = (e) => {
    e.preventDefault();
    if (currentUser.role === 'admin') {
      setMatches(matches.map(m => m.id === editMatchModal.id ? editMatchModal : m));
      alert("Cambio guardado.");
    } else {
      setPendingApprovals([...pendingApprovals, { id: Date.now(), type: 'match_update', description: `Actualización ${editMatchModal.rival}`, payload: editMatchModal, user: currentUser.name }]);
      alert("Enviado a aprobación.");
    }
    setEditMatchModal(null);
  };

  const handleSpaceAction = (space) => {
    alert(`Gestionar el espacio: ${space.name} - Funcionalidad en desarrollo para v5.2`);
  };

  // === RENDER: LOGIN ===
  if (!isAuthenticated) return <LoginScreen />;

  // === RENDER: ACTIVE SECTION ===
  const renderSection = () => {
    if (showMemberProfile && searchResult) {
      return <MemberProfileSection searchResult={searchResult} onBack={() => { setShowMemberProfile(false); setActiveTab('inicio'); }} />;
    }

    switch (activeTab) {
      case 'inicio':
        return <DashboardSection searchResults={searchResults} setSearchResults={setSearchResults} selectMember={selectMember} matches={matches} database={database} setActiveTab={setActiveTab} setTicketModal={setTicketModal} directorPlan={directorPlan} />;
      case 'inbox':
        return <CasosSection database={database} />;
      case 'alta':
        return <AltaExpressSection />;
      case 'entradas':
        return <EntradasSection matches={matches} setTicketModal={setTicketModal} />;
      case 'abonos':
        return <AbonosSection />;
      case 'tramites':
        return <TramitesSection tramitesGuia={tramitesGuia} />;
      case 'solicitudes':
        return <SolicitudesSection requestsKB={requestsKB} />;
      case 'espacios':
        return <EspaciosSection commonSpaces={commonSpaces} onManageSpace={handleSpaceAction} />;
      case 'scripts':
      case 'faq':
        return <ScriptsSection activeTab={activeTab} scripts={scripts} faqs={faqs} />;
      case 'gestion':
        return <GestionSection database={database} />;
      default:
        return <DashboardSection searchResults={searchResults} setSearchResults={setSearchResults} selectMember={selectMember} matches={matches} database={database} setActiveTab={setActiveTab} setTicketModal={setTicketModal} directorPlan={directorPlan} />;
    }
  };

  // === RENDER: MAIN LAYOUT ===
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative overflow-x-hidden">
      <Header
        currentUser={currentUser}
        onSearch={handleSearch}
        onLogout={handleLogout}
        onHomeClick={() => { setActiveTab('inicio'); setShowMemberProfile(false); }}
        onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 z-10">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setShowMemberProfile(false); setIsMobileMenuOpen(false); }}
          currentUser={currentUser}
          pendingApprovals={pendingApprovals}
          caseCount={database.flatMap(u => u.casos || []).filter(c => c.estado !== 'Cerrado').length}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="flex-1 min-w-0">
          {/* News Banner */}
          <div className={`mb-6 p-4 rounded-2xl border-l-4 shadow-sm flex items-start gap-4 ${news.type === 'alert' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'}`}>
            <Bell className="flex-shrink-0 animate-bounce" />
            <div><h3 className="font-black uppercase text-sm">{news.title}</h3><p className="text-sm opacity-90">{news.content}</p></div>
          </div>

          {/* Active Section */}
          {renderSection()}

          {/* === MODALS === */}

          {/* Edit Match Modal */}
          {editMatchModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
                <h3 className="font-black text-blue-900 mb-4">Editar Partido</h3>
                <form onSubmit={handleSaveMatch} className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500">Rival</label><input type="text" value={editMatchModal.rival} onChange={(e) => setEditMatchModal({ ...editMatchModal, rival: e.target.value })} className="w-full bg-slate-50 p-2 rounded-lg font-bold" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500">Popular</label><input type="number" value={editMatchModal.precios.pop} onChange={(e) => setEditMatchModal({ ...editMatchModal, precios: { ...editMatchModal.precios, pop: parseInt(e.target.value) } })} className="w-full bg-slate-50 p-2 rounded-lg font-bold" /></div>
                    <div><label className="text-xs font-bold text-slate-500">Platea</label><input type="number" value={editMatchModal.precios.platea} onChange={(e) => setEditMatchModal({ ...editMatchModal, precios: { ...editMatchModal.precios, platea: parseInt(e.target.value) } })} className="w-full bg-slate-50 p-2 rounded-lg font-bold" /></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setEditMatchModal(null)} className="flex-1 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-100">Cancelar</button>
                    <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-800">{currentUser.role === 'admin' ? 'Guardar' : 'Solicitar Aprobación'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Ticket Modal */}
          {ticketModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
                <button onClick={() => { setTicketModal(null); setGeneratedTicket(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"><X size={24} /></button>
                <div className="bg-blue-900 p-6 text-white text-center relative overflow-hidden">
                  <img src={SHIELD_URL} className="absolute -left-4 -bottom-4 w-24 h-24 opacity-10" alt="bg" />
                  <h3 className="text-xl font-black uppercase tracking-widest mb-1">Boletería Digital</h3>
                  <p className="text-blue-200 text-sm">{ticketModal.rival} - {ticketModal.fecha}</p>
                </div>
                <div className="p-6">
                  {!generatedTicket ? (
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-4">Seleccionar Ubicación</p>
                      <button onClick={() => handleGenerateTicket('popular')} className="w-full flex justify-between items-center p-4 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                        <div className="text-left"><p className="font-black text-slate-800 group-hover:text-blue-900">POPULAR</p><p className="text-xs text-slate-500">Cabecera Local</p></div><p className="font-black text-xl text-blue-900">${ticketModal.precios.pop}</p>
                      </button>
                      <button onClick={() => handleGenerateTicket('platea')} className="w-full flex justify-between items-center p-4 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                        <div className="text-left"><p className="font-black text-slate-800 group-hover:text-blue-900">PLATEA SUR</p><p className="text-xs text-slate-500">Sector Preferencial</p></div><p className="font-black text-xl text-blue-900">${ticketModal.precios.platea}</p>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center animate-in zoom-in-50 duration-300">
                      <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-6"><CheckCircle2 size={14} /> TICKET EMITIDO</div>
                      <div className="bg-white p-4 border-2 border-dashed border-slate-300 rounded-2xl mb-6 relative">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Escanear en Molinete</p>
                        <div className="bg-slate-900 p-4 inline-block rounded-xl mb-2"><QrCode size={120} className="text-white" /></div>
                        <p className="font-black text-blue-900 text-lg uppercase">{generatedTicket.sector}</p>
                        <p className="text-sm font-medium text-slate-500 mb-1">{generatedTicket.match}</p>
                      </div>
                      <button onClick={shareOnWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Share2 size={18} /> Enviar por WhatsApp</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full relative z-10 flex flex-col mt-auto">
        <div className="bg-[#002B49] py-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg">
              <img src="/logos/emblema.svg" alt="CASLA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <h3 className="text-white font-black text-xl uppercase tracking-widest leading-none">SAN LORENZO</h3>
              <p className="text-white/60 font-light text-[10px] uppercase tracking-[0.5em]">DE ALMAGRO</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#E30613_10px,#E30613_20px)] opacity-30" />
        </div>
        <div className="bg-[#E30613] text-white py-2 px-6 flex flex-col md:flex-row justify-between items-center text-[8px] font-bold uppercase tracking-widest gap-2">
          <span>Sitio Oficial CASLA © 2026</span>
          <span className="opacity-80">Portal de Administración Socios 5.1</span>
        </div>
      </footer>
    </div>
  );
}
