'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Home, Users, CreditCard, ClipboardCheck, MessageSquare,
  AlertTriangle, HelpCircle, Phone, Copy, CheckCircle2, Mail,
  Smartphone, ShieldCheck, TrendingUp, Car, MapPin, Ticket,
  Settings, BarChart3, Lock, LogOut, UserPlus, Info, ExternalLink,
  UserMinus, RefreshCw, FileText, Calendar, Clock, CreditCard as CardIcon,
  DollarSign, Receipt, Printer, X, Armchair, QrCode, Menu, Share2,
  User, Send, Edit3, Save, Trash2, Inbox, Bell, Eye, Check, XCircle,
  Filter, BookOpen, ChevronRight, PlayCircle
} from 'lucide-react';

// --- GENERADOR DE BASE DE DATOS (MOCK 100 SOCIOS) ---
const generateMockDatabase = () => {
  const names = ["Juan", "Maria", "Pedro", "Ana", "Luis", "Sofia", "Carlos", "Lucia", "Miguel", "Elena", "Diego", "Valentina", "Javier", "Camila", "Fernando", "Martina", "Roberto", "Julia", "Daniel", "Paula"];
  const lastnames = ["Perez", "Garcia", "Lopez", "Martinez", "Gonzalez", "Rodriguez", "Fernandez", "Torres", "Ramirez", "Flores", "Acosta", "Benitez", "Castro", "Diaz", "Escobar", "Gimenez", "Herrera", "Ibarra", "Juarez", "Luna"];
  const categories = ["Activo Pleno", "Activo Simple", "Cadete", "Infantil", "Vitalicio", "Socio Interior"];
  const activities = ["Natación", "Tenis", "Futsal", "Voley", "Hockey", "Básquet", "Ninguna"];

  const mockData = Array.from({ length: 100 }, (_, i) => {
    const id = i + 2; // Empezamos en 2 porque el 1 es el fijo
    const name = names[Math.floor(Math.random() * names.length)];
    const lastname = lastnames[Math.floor(Math.random() * lastnames.length)];
    return {
      id: id.toString(),
      nombre: `${name} ${lastname}`,
      numero: (90000 + id).toString(),
      dni: (30000000 + id).toString(),
      estado: Math.random() > 0.1 ? "ACTIVO - AL DÍA" : "MOROSO (2 Cuotas)",
      categoria: categories[Math.floor(Math.random() * categories.length)],
      antiguedad: `${Math.floor(Math.random() * 20) + 1} años`,
      saldo: Math.random() > 0.8 ? -15000 : 0,
      actividad: activities[Math.floor(Math.random() * activities.length)],
      domicilio: `Av. La Plata ${1700 + id}, CABA`,
      grupoFamiliar: Math.random() > 0.7 ? [`Hijo/a ${lastname}`] : [],
      servicios: Math.random() > 0.5 ? ["Débito Automático"] : [],
      estadio: {
        sector: Math.random() > 0.5 ? "Popular Local" : "Platea Sur",
        bloque: "A",
        fila: Math.floor(Math.random() * 20),
        asiento: Math.floor(Math.random() * 100),
        puerta: Math.random() > 0.5 ? "10" : "4",
      },
      cochera: Math.random() > 0.9 ? { asignada: true, sector: "Playón A", numero: id } : { asignada: false },
      canje: Math.random() > 0.3 ? { estado: "CONFIRMADO", partido: "Próximo", qr_token: `QR-${id}` } : { estado: "PENDIENTE" }
    };
  });

  // Agregamos el socio de prueba histórico para asegurar que siempre haya un resultado conocido
  const fixedMember = {
    id: "1",
    nombre: "Juan Carlos Cuervo",
    numero: "90123",
    dni: "32456789",
    estado: "ACTIVO - AL DÍA",
    categoria: "Activo Pleno",
    antiguedad: "12 años",
    saldo: 0,
    actividad: "Natación",
    domicilio: "Av. La Plata 1700, CABA",
    grupoFamiliar: ["María Cuervo (Esposa)", "Tomás Cuervo (Hijo)"],
    servicios: ["Débito Automático", "Abono Platea"],
    estadio: {
      sector: "Platea Norte Baja",
      bloque: "C",
      fila: "12",
      asiento: "34",
      puerta: "4",
    },
    cochera: { asignada: true, sector: "Playón A", numero: "104" },
    canje: { estado: "CONFIRMADO", partido: "vs Independiente", qr_token: "QR-90123" }
  };

  return [fixedMember, ...mockData];
};

export default function App() {
  // --- AUTENTICACIÓN & ROLES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');

  // --- DATOS GLOBALES ---
  const [database] = useState(generateMockDatabase()); // Base de 100 socios
  const [news, setNews] = useState({
    title: "¡Venta de Abonos 2026 Habilitada!",
    content: "Ya se encuentra disponible la renovación de Tu Lugar con 10% OFF pagando en efectivo en Sede Av. La Plata.",
    type: "info"
  });

  const [matches, setMatches] = useState([
    { id: 1, rival: "Estudiantes (RC)", torneo: "Copa LPF", fecha: "19/02 21:15", precios: { pop: 15000, platea: 45000 } },
    { id: 2, rival: "Instituto", torneo: "Copa LPF", fecha: "24/02 18:00", precios: { pop: 15000, platea: 40000 } },
    { id: 3, rival: "Independiente", torneo: "Clásico", fecha: "07/03 19:15", precios: { pop: 20000, platea: 60000 }, highlight: true },
  ]);

  // --- FLUJO DE APROBACIÓN ---
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // --- ESTADOS UI ---
  const [activeTab, setActiveTab] = useState('inicio');
  const [copiedId, setCopiedId] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // Nuevo: Para múltiples resultados
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modales
  const [ticketModal, setTicketModal] = useState(null);
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [editMatchModal, setEditMatchModal] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(null); // Para el wizard de solicitudes

  // Inbox Mock
  const [inboxMessages, setInboxMessages] = useState([
    { id: 1, channel: 'whatsapp', user: 'Socio #90005', text: 'Hola, quiero adherir al débito', time: '10:05', unread: true },
    { id: 2, channel: 'email', user: 'Maria Garcia', text: 'Solicito baja por mudanza.', time: '09:45', unread: true },
  ]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const WHATSAPP_NUMBER = "+54 9 11 5333-6237";
  const SHIELD_URL = "https://upload.wikimedia.org/wikipedia/commons/7/7b/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg";

  // --- BASES DE CONOCIMIENTO EXTENDIDA (20+ ITEMS) ---
  const scripts = {
    whatsapp: Array.from({ length: 20 }, (_, i) => ({
      id: `ws_${i}`,
      title: [
        "Bienvenida Nuevo Socio", "Alta Web", "Moratoria", "Zona de Débito", "Info Carnet", "Rechazo Débito",
        "Recupero Pass", "Horarios Sede", "Precios Entradas", "Abonos Info", "Baja Solicitud", "Cambio Categoría",
        "Pileta Info", "Colonia Vacaciones", "Futsal Info", "Tenis Info", "Vitalicios", "Discapacidad", "Prensa", "Proveedores"
      ][i],
      text: [
        "¡Bienvenido a la familia azulgrana! 💙❤️ Tu trámite está completo.",
        "Asociate online: botm.cc/alta",
        "Regularizá tu deuda: botm.cc/moratoria",
        "Zona de Débito: Tu pago está procesándose, podés ingresar.",
        "Carnet: $15.000 alta/renovación, $19.000 reposición.",
        "Tu pago fue rechazado. Por favor actualizá tu tarjeta.",
        "Recuperá tu clave en botm.cc/pass",
        "Sedes: Boedo 8-20h, Ciudad 9-20h.",
        "Populares desde $15.000, Plateas desde $40.000.",
        "Abonos: Renovación con 10% OFF en efectivo.",
        "Para gestionar la baja, enviá nota firmada a socios@sanlorenzo.com.ar",
        "El cambio de categoría es automático a los 18 años.",
        "Pileta: Revisación médica obligatoria en sede.",
        "Colonia: Inscripción abierta desde diciembre.",
        "Pruebas de Futsal: Martes y Jueves 18hs.",
        "Alquiler de canchas de Tenis por la App.",
        "Trámite Vitalicio: Presencial en Av. La Plata.",
        "Acreditación Discapacidad: 48hs antes del partido.",
        "Acreditaciones de prensa cerradas.",
        "Contacto proveedores: compras@sanlorenzo.com.ar"
      ][i]
    })),
    email: [
      { id: 'em1', title: 'Reclamo Ranking', text: "Estimado/a: Ajustamos manualmente tu puntaje por error de molinete." },
      { id: 'em2', title: 'Confirmación Baja', text: "Confirmamos la recepción de tu solicitud de baja." }
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
    { id: 11, tag: "Infraestructura", title: "Queja Limpieza", question: "¿Sector sucio?", solution: "Generar ticket a Intendencia." },
    { id: 12, tag: "Seguridad", title: "Objeto Perdido", question: "¿Perdiste algo en cancha?", solution: "Consultar en oficina de seguridad Av. La Plata." },
    { id: 13, tag: "Prensa", title: "Acreditación", question: "¿Medio partidario?", solution: "Formulario web 72hs antes." },
    { id: 14, tag: "Marketing", title: "Sponsor", question: "¿Propuesta comercial?", solution: "Derivar a Gerencia de Marketing." },
    { id: 15, tag: "Social", title: "Visita Guiada", question: "¿Colegios?", solution: "Coordinar con CASLA Social." },
    { id: 16, tag: "Legales", title: "Derecho Admisión", question: "¿Tribuna Segura?", solution: "Consultar listado oficial Min. Seguridad." },
    { id: 17, tag: "Cobranzas", title: "Plan de Pagos", question: "¿Deuda > 3 meses?", solution: "Ofrecer moratoria 3/6/12." },
    { id: 18, tag: "Accesos", title: "Discapacidad", question: "¿Acompañante?", solution: "Debe estar registrado en el certificado CUD." },
    { id: 19, tag: "Abonos", title: "Cesión de Abono", question: "¿No podés ir?", solution: "Se puede ceder 1 vez por torneo a otro socio." },
    { id: 20, tag: "Administrativo", title: "Cambio Domicilio", question: "¿Te mudaste?", solution: "Actualizar en ficha para envío de carnet." }
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
    { q: "¿Qué puerta me corresponde si tengo Abono a Platea?", a: "Platea Sur (Puerta 10/11), Platea Norte (Puerta 4/5), Popular local (Puerta 1). Siempre verificalo en el buscador arriba." },
  ];

  // --- FUNCIONES ---
  const handleLogin = (e) => {
    e.preventDefault();
    const { user, pass } = loginForm;
    if (user === 'admin' && pass === 'admin') setCurrentUser({ name: 'Administrador General', role: 'admin', avatar: 'AD' });
    else if (user === 'super' && pass === 'super') setCurrentUser({ name: 'Supervisor Tarde', role: 'supervisor', avatar: 'SV' });
    else if (user === 'oper' && pass === 'oper') setCurrentUser({ name: 'Operador Caja 4', role: 'operator', avatar: 'OP' });
    else { setLoginError('Credenciales inválidas'); return; }
    setIsAuthenticated(true);
  };

  const handleLogout = () => { setIsAuthenticated(false); setCurrentUser(null); setLoginForm({ user: '', pass: '' }); setActiveTab('inicio'); };

  const handleSearch = () => {
    if (!searchQuery) return;

    const cleanQuery = searchQuery.replace(/\./g, "").replace(/\s/g, "").toLowerCase();

    // Filtramos TODOS los que coincidan
    const matches = database.filter(s => {
      const cleanNumero = s.numero.replace(/\./g, "");
      const cleanDNI = s.dni.replace(/\./g, "");
      return (
        cleanNumero === cleanQuery ||
        cleanDNI === cleanQuery ||
        s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (matches.length === 1) {
      setSearchResult(matches[0]);
      setSearchResults([]);
      setShowMemberProfile(true);
    } else if (matches.length > 1) {
      setSearchResults(matches);
      setSearchResult(null);
      setShowMemberProfile(false);
      setActiveTab('inicio'); // Volvemos a inicio para mostrar la lista
    } else {
      alert("Socio no encontrado. Tip: Probá con 'Juan Carlos Cuervo' o '90123'.");
      setSearchResult(null);
      setSearchResults([]);
    }
    setIsMobileMenuOpen(false);
  };

  const selectMember = (member) => {
    setSearchResult(member);
    setSearchResults([]);
    setShowMemberProfile(true);
  };

  const copyToClipboard = (text, id) => {
    const textArea = document.createElement("textarea"); textArea.value = text; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditMatch = (match) => {
    setEditMatchModal(match);
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

  const handleGenerateTicket = (type) => {
    setGeneratedTicket({
      sector: type === 'popular' ? 'Popular Local' : 'Platea Sur',
      match: ticketModal.rival,
      id: Math.random().toString(36).substring(7).toUpperCase()
    });
  };

  const shareOnWhatsApp = () => {
    const text = `🎟️ Tu entrada para SAN LORENZO vs ${generatedTicket.match}\n📍 Sector: ${generatedTicket.sector}\n🔑 Código: ${generatedTicket.id}\n🟦🟥 ¡VAMOS CICLÓN!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  // --- RENDERIZADO LOGIN ---
  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#002D58] flex flex-col items-center justify-center p-4 relative">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-6"><div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg border-4 border-slate-100"><img src={SHIELD_URL} className="w-full h-full object-contain" /></div></div>
        <h2 className="text-2xl font-black text-blue-900 mb-1">PORTAL SOCIOS 4.0</h2>
        <p className="text-slate-500 text-sm mb-8 font-bold">ACCESO CORPORATIVO</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" value={loginForm.user} onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800" placeholder="Usuario (admin/super/oper)" />
          <input type="password" value={loginForm.pass} onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800" placeholder="Contraseña" />
          {loginError && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">{loginError}</p>}
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black tracking-widest shadow-lg">INGRESAR</button>
        </form>
        <div className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          San Lorenzo de Almagro © 2026
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative overflow-x-hidden">
      <header className="bg-[#002D58] text-white shadow-xl sticky top-0 z-50 border-b-4 border-[#E30613]">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-lg"><Menu size={24} /></button>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 cursor-pointer" onClick={() => { setActiveTab('inicio'); setShowMemberProfile(false); }}><img src={SHIELD_URL} className="w-full h-full object-contain" /></div>
            <div className="leading-tight"><h1 className="text-sm md:text-lg font-black uppercase tracking-tight">PORTAL <span className="text-red-500">ADM</span></h1><p className="hidden md:block text-[10px] tracking-widest uppercase opacity-70 font-bold">{currentUser.role.toUpperCase()}</p></div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-blue-950/50 p-2 rounded-xl border border-blue-800">
            <input type="text" placeholder="DNI, N° Socio o Apellido..." className="bg-transparent text-sm w-64 outline-none px-2 text-white placeholder-blue-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
            <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg shadow-lg"><Search size={18} /></button>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right mr-2"><span className="text-xs font-bold">{currentUser.name}</span><span className="text-[10px] opacity-70 uppercase">{currentUser.role}</span></div>
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center font-bold text-xs border border-blue-400">{currentUser.avatar}</div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-600/20 rounded-lg text-red-400"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 z-10">
        <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2 w-full md:w-64 flex-shrink-0 animate-in slide-in-from-left duration-200`}>
          <div className="bg-white md:bg-transparent rounded-2xl shadow-xl md:shadow-none p-2 md:p-0 space-y-1">
            <button key="inicio" onClick={() => { setActiveTab('inicio'); setShowMemberProfile(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'inicio' ? 'bg-[#002D58] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}><Home size={18} /> Dashboard</button>
            <button key="inbox" onClick={() => setActiveTab('inbox')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'inbox' ? 'bg-[#002D58] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
              <div className="relative"><Inbox size={18} />{inboxMessages.filter(m => m.unread).length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</div> Bandeja Entrada
            </button>
            <div className="my-2 border-t border-slate-200/50"></div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operativo</p>
            {['alta', 'entradas', 'abonos', 'tramites', 'solicitudes', 'scripts', 'faq'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setShowMemberProfile(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold capitalize ${activeTab === tab ? 'bg-[#002D58] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                {tab === 'alta' ? <UserPlus size={18} /> : tab === 'entradas' ? <Ticket size={18} /> : tab === 'abonos' ? <CreditCard size={18} /> : tab === 'tramites' ? <ClipboardCheck size={18} /> : tab === 'solicitudes' ? <AlertTriangle size={18} /> : tab === 'scripts' ? <MessageSquare size={18} /> : <HelpCircle size={18} />}
                {tab === 'solicitudes' ? 'Solicitudes' : tab === 'faq' ? 'Preguntas Frecuentes' : tab === 'alta' ? 'Alta Express' : tab}
              </button>
            ))}
            {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
              <>
                <div className="my-2 border-t border-slate-200/50"></div>
                <p className="px-4 text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Gestión</p>
                <button key="gestion" onClick={() => setActiveTab('gestion')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'gestion' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}><BarChart3 size={18} /> KPIs & Control</button>
              </>
            )}
            {currentUser.role === 'admin' && (
              <button key="cms" onClick={() => setActiveTab('cms')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeTab === 'cms' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                <div className="relative"><Edit3 size={18} />{pendingApprovals.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>}</div> Aprobaciones
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {/* ÚLTIMA NOVEDAD (Visible siempre en top) */}
          <div className={`mb-6 p-4 rounded-2xl border-l-4 shadow-sm flex items-start gap-4 ${news.type === 'alert' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'}`}>
            <Bell className="flex-shrink-0 animate-bounce" />
            <div><h3 className="font-black uppercase text-sm">{news.title}</h3><p className="text-sm opacity-90">{news.content}</p></div>
          </div>

          {/* --- DASHBOARD INICIO --- */}
          {activeTab === 'inicio' && !showMemberProfile && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ l: 'Activo Pleno', v: '$33.500' }, { l: 'Cadete', v: '$28.100' }, { l: 'Carnet Alta', v: '$15.000' }, { l: 'Reposición', v: '$19.000' }].map((p, i) => (
                  <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{p.l}</p>
                    <p className="text-xl font-black text-blue-900">{p.v}</p>
                  </div>
                ))}
              </div>

              {/* Resultados de Búsqueda Múltiple */}
              {searchResults.length > 0 && (
                <div className="bg-orange-50 rounded-3xl border-2 border-orange-200 overflow-hidden animate-in zoom-in-95">
                  <div className="bg-orange-500 p-3 flex justify-between items-center text-white">
                    <h3 className="font-bold text-sm">Se encontraron {searchResults.length} socios</h3>
                    <button onClick={() => setSearchResults([])}><X size={16} /></button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map(s => (
                      <div key={s.id} onClick={() => selectMember(s)} className="p-3 border-b border-orange-100 hover:bg-orange-100 cursor-pointer flex justify-between items-center transition-colors">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{s.nombre}</p>
                          <p className="text-[10px] text-slate-500">Socio N° {s.numero} | DNI: {s.dni}</p>
                        </div>
                        <span className="text-[9px] font-black text-orange-600 bg-white px-2 py-1 rounded-full uppercase">{s.categoria}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Próximos Partidos */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-blue-900 p-4 flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2 text-sm"><Calendar className="text-red-500" size={18} /> Próximos Partidos</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {matches.map((match, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-xl text-center min-w-[50px]">
                            <p className="text-[8px] font-black text-slate-400 uppercase">{match.fecha.split(' ')[0]}</p>
                            <p className="text-sm font-black text-blue-900">{match.fecha.split(' ')[1]}</p>
                          </div>
                          <div><p className="font-bold text-slate-800 text-xs">VS {match.rival}</p><p className="text-[10px] text-slate-500">{match.torneo}</p></div>
                        </div>
                        <button onClick={() => { setActiveTab('entradas'); setTicketModal(match); }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md">Vender</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Socios Recientes de la DB */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-800 p-4 flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2 text-sm"><Users className="text-blue-400" size={18} /> Padrones Recientes</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Mock DB</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {database.slice(1, 6).map((socio) => (
                      <div key={socio.id} onClick={() => selectMember(socio)} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">{socio.nombre.charAt(0)}</div>
                          <div><p className="font-bold text-slate-800 text-xs">{socio.nombre}</p><p className="text-[10px] text-slate-500">N° {socio.numero}</p></div>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full ${socio.estado.includes('ACTIVO') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{socio.estado}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- PERFIL DE SOCIO (RESULTADO BÚSQUEDA) --- */}
          {showMemberProfile && searchResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-2">
                <button onClick={() => setShowMemberProfile(false)} className="text-sm font-bold text-slate-500 hover:text-blue-900 flex items-center gap-2">← Volver al Dashboard</button>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-blue-900 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl font-black text-slate-300">{searchResult.nombre.charAt(0)}</div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-blue-900 uppercase">{searchResult.nombre}</h2>
                    <div className="flex gap-4 mt-1 text-sm text-slate-600"><span>#{searchResult.numero}</span><span>{searchResult.categoria}</span><span className={`font-bold ${searchResult.estado.includes('ACTIVO') ? 'text-green-600' : 'text-red-600'}`}>{searchResult.estado}</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Saldo</p>
                  <p className={`text-3xl font-black ${searchResult.saldo < 0 ? 'text-red-600' : 'text-green-600'}`}>$ {searchResult.saldo}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-red-500" /> Accesos</h3>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between"><span className="opacity-70 text-xs">Sector</span><span className="font-bold text-sm">{searchResult.estadio.sector}</span></div>
                      <div className="flex justify-between"><span className="opacity-70 text-xs">Puerta</span><span className="font-bold text-lg text-red-400">P{searchResult.estadio.puerta}</span></div>
                      <div className="flex justify-between"><span className="opacity-70 text-xs">Cochera</span><span className="font-bold text-sm">{searchResult.cochera.asignada ? searchResult.cochera.sector : 'NO'}</span></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><DollarSign size={18} /> Acciones Rápidas</h3>
                  <div className="space-y-2">
                    <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 font-medium text-sm"><span>Cobrar Cuota</span><ChevronRight size={16} /></button>
                    <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 font-medium text-sm"><span>Adherir Débito Automático</span><ChevronRight size={16} /></button>
                    <button className="w-full flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 font-medium text-sm"><span>Imprimir Carnet</span><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Info size={18} /> Datos</h3>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>DNI: {searchResult.dni}</p>
                    <p>Domicilio: {searchResult.domicilio}</p>
                    <p>Actividad: {searchResult.actividad}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- ALTA EXPRESS --- */}
          {activeTab === 'alta' && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10"><h2 className="text-2xl font-black mb-1 uppercase italic">Alta Express</h2><p className="opacity-80 text-sm">Formulario de alta inmediata. Recordá validar DNI físico.</p></div>
                <UserPlus className="absolute right-4 top-4 text-white opacity-10 w-24 h-24" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                  <h3 className="font-bold text-blue-900">Datos Personales</h3>
                  <input type="text" placeholder="DNI" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Nombre" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                    <input type="text" placeholder="Apellido" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                  </div>
                  <input type="email" placeholder="Email" className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none" />
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 mb-4">Pagos & Adhesión</h3>
                    <div className="space-y-2 mb-4">
                      <button className="w-full p-3 border border-blue-100 rounded-xl flex justify-between items-center text-sm font-bold text-blue-900 hover:bg-blue-50"><span className="flex items-center gap-2"><CreditCard size={16} /> Adherir Débito Automático</span><CheckCircle2 size={16} className="text-green-500" /></button>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-xl text-sm space-y-2">
                      <div className="flex justify-between"><span>Cuota:</span><span className="font-bold">$33.500</span></div>
                      <div className="flex justify-between"><span>Carnet:</span><span className="font-bold">$15.000</span></div>
                      <div className="border-t pt-2 font-black text-blue-900 flex justify-between"><span>Total:</span><span>$48.500</span></div>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg hover:bg-green-700">Confirmar Alta & Cobrar</button>
                </div>
              </div>
            </div>
          )}

          {/* --- ABONOS --- */}
          {activeTab === 'abonos' && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2"><CreditCard size={20} /> Gestión de Abonos "Tu Lugar"</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 cursor-pointer transition-all">
                    <p className="font-bold text-slate-800">Platea Norte</p>
                    <p className="text-xs text-slate-500">Alta / Baja</p>
                    <p className="text-lg font-black text-blue-900 mt-2">$250.000 <span className="text-xs font-normal text-slate-400">/ Semestre</span></p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 cursor-pointer transition-all">
                    <p className="font-bold text-slate-800">Platea Sur</p>
                    <p className="text-xs text-slate-500">Preferencial</p>
                    <p className="text-lg font-black text-blue-900 mt-2">$180.000 <span className="text-xs font-normal text-slate-400">/ Semestre</span></p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm">
                    Ver Mapa del Estadio
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <button className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-800">Renovar Abono</button>
                  <button className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50">Liberar Butaca</button>
                </div>
              </div>
            </div>
          )}

          {/* --- ENTRADAS (Boletería) --- */}
          {activeTab === 'entradas' && !ticketModal && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right">
              {matches.map(match => (
                <div key={match.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">{match.torneo}</p>
                  <h3 className="text-xl font-black text-blue-900 mb-1">VS {match.rival}</h3>
                  <p className="text-sm font-medium text-slate-600 mb-6 flex items-center gap-2"><Calendar size={14} /> {match.fecha}</p>
                  <button onClick={() => setTicketModal(match)} className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700">Vender Ticket</button>
                </div>
              ))}
            </div>
          )}

          {/* --- SOLICITUDES --- */}
          {activeTab === 'solicitudes' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-blue-900 mb-4">Base de Conocimiento & Solicitudes</h2>
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 bg-slate-50 p-3 rounded-xl flex items-center gap-2 border border-slate-200">
                    <Search size={18} className="text-slate-400" />
                    <input type="text" placeholder="Buscar problema (ej: ranking, cobro, carnet)..." className="bg-transparent outline-none w-full text-sm font-bold text-slate-700" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Todos', 'Administrativo', 'Cobranzas', 'Accesos', 'Abonos', 'Tecnología'].map(tag => (
                    <button key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 hover:bg-blue-100 hover:text-blue-800 transition-colors">{tag}</button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {requestsKB.slice(0, 8).map(kb => (
                    <div key={kb.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{kb.tag}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{kb.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 italic">"{kb.question}"</p>
                      <p className="text-xs text-slate-700 mt-2 font-medium bg-green-50 p-2 rounded border-l-2 border-green-500">Solución: {kb.solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- TRAMITES --- */}
          {activeTab === 'tramites' && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
              {tramitesGuia.map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="font-black text-blue-900 mb-4 flex justify-between items-center">
                    {t.title}
                    <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-100">{t.action}</button>
                  </h3>
                  <div className="space-y-4 relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                    {t.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 relative items-center">
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-900 text-blue-900 font-bold text-[10px] flex items-center justify-center z-10">{idx + 1}</div>
                        <p className="text-sm text-slate-600 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- SCRIPTS & FAQ --- */}
          {(activeTab === 'scripts' || activeTab === 'faq') && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in">
              <h2 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                {activeTab === 'scripts' ? <MessageSquare size={20} /> : <HelpCircle size={20} />}
                {activeTab === 'scripts' ? 'Biblioteca de Respuestas (20+)' : 'Preguntas Frecuentes'}
              </h2>

              {activeTab === 'scripts' ? (
                <div className="grid md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2">
                  {scripts.whatsapp.map(s => (
                    <button key={s.id} onClick={() => copyToClipboard(s.text, s.id)} className="text-left p-4 rounded-xl border border-slate-100 hover:border-green-400 hover:bg-green-50 transition-all group relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-xs text-green-700 uppercase tracking-widest">{s.title}</span>
                        <Copy size={14} className="opacity-0 group-hover:opacity-100 text-green-600" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 group-hover:text-slate-800">{s.text}</p>
                      {copiedId === s.id && <div className="absolute inset-0 bg-green-600/90 rounded-xl flex items-center justify-center text-white font-bold animate-in fade-in">¡Copiado!</div>}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
                  {faqs.map((f, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl">
                      <p className="font-bold text-blue-900 mb-1 flex items-center gap-2"><HelpCircle size={16} className="text-red-500" /> {f.q}</p>
                      <p className="text-sm text-slate-700 pl-6">{f.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- GESTIÓN --- */}
          {activeTab === 'gestion' && (currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-blue-500">
                  <p className="text-[10px] uppercase font-black text-slate-400">Mails Recibidos</p>
                  <p className="text-3xl font-black text-slate-800">120</p>
                  <div className="flex justify-between text-[10px] mt-2 font-bold"><span className="text-green-600">98 Respondidos</span><span className="text-red-500">22 Pendientes</span></div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-orange-500">
                  <p className="text-[10px] uppercase font-black text-slate-400">Tiempo Atención</p>
                  <p className="text-3xl font-black text-orange-600">4.5m</p>
                  <p className="text-xs text-slate-500">Promedio por ticket</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-green-500">
                  <p className="text-[10px] uppercase font-black text-slate-400">CSAT Score</p>
                  <p className="text-3xl font-black text-green-600">4.8</p>
                  <p className="text-xs text-slate-500">Satisfacción Socio</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-red-500">
                  <p className="text-[10px] uppercase font-black text-slate-400">Tickets Críticos</p>
                  <p className="text-3xl font-black text-red-600">5</p>
                  <p className="text-xs text-slate-500">Escalados a Admin</p>
                </div>
              </div>
            </div>
          )}

          {/* --- BANDEJA ENTRADA --- */}
          {activeTab === 'inbox' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[600px] animate-in fade-in">
              <div className="w-full md:w-80 border-r border-slate-100 flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-black text-blue-900 text-sm uppercase">Mensajes Pendientes</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {inboxMessages.map(msg => (
                    <button key={msg.id} onClick={() => setSelectedMessage(msg)} className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs">{msg.user}</span>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{msg.text}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${msg.channel === 'whatsapp' ? 'text-green-600' : 'text-blue-600'}`}>{msg.channel}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-slate-50/30">
                {selectedMessage ? (
                  <>
                    <div className="p-6 border-b border-slate-100 bg-white">
                      <h4 className="font-black text-blue-900">{selectedMessage.user}</h4>
                      <p className="text-sm text-slate-600 mt-2">{selectedMessage.text}</p>
                    </div>
                    <div className="flex-1 p-6">
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Escribir respuesta..." className="w-full h-40 bg-white border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 transition-all shadow-inner"></textarea>
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-2">
                      <button className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100">Cerrar</button>
                      <button className="bg-blue-900 text-white px-8 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-800 flex items-center gap-2"><Send size={16} /> Responder</button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold italic">Seleccioná un mensaje para responder</div>
                )}
              </div>
            </div>
          )}

          {/* --- MODALES --- */}
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
                      <button onClick={shareOnWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"><Share2 size={18} /> Enviar por WhatsApp</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="w-full relative z-10 flex flex-col mt-auto">
        <div className="bg-[#002B49] py-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg">
              <img src={SHIELD_URL} alt="CASLA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <h3 className="text-white font-black text-xl uppercase tracking-widest leading-none">SAN LORENZO</h3>
              <p className="text-white/60 font-light text-[10px] uppercase tracking-[0.5em]">DE ALMAGRO</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#E30613_10px,#E30613_20px)] opacity-30"></div>
        </div>

        <div className="bg-[#E30613] text-white py-2 px-6 flex flex-col md:flex-row justify-between items-center text-[8px] font-bold uppercase tracking-widest gap-2">
          <div className="flex items-center gap-2">
            <span>Sitio Oficial CASLA © 2026</span>
          </div>
          <div className="flex items-center gap-2 md:text-right opacity-80">
            <span>Portal de Administración Socios 4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
