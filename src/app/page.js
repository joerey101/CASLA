'use client';

import React, { useState } from 'react';
import {
  Search, Home as HomeIcon, Users, CreditCard, ClipboardCheck, MessageSquare,
  AlertTriangle, HelpCircle, Phone, Copy, CheckCircle2, Mail,
  Smartphone, ShieldCheck, TrendingUp, Car, MapPin, Ticket,
  Settings, BarChart3, Lock, LogOut, UserPlus, Info, ExternalLink,
  UserMinus, RefreshCw, FileText, Calendar, Clock
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [copiedId, setCopiedId] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const WHATSAPP_NUMBER = "+54 9 11 5333-6237";
  const SHIELD_URL = "https://upload.wikimedia.org/wikipedia/commons/7/7b/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg";

  // Simulación de búsqueda en ADN con Lógica de Accesos
  // NOTA: Aquí es donde conectaremos con la Base de Datos real en el futuro
  const handleSearch = () => {
    if (!searchQuery) return;
    setSearchResult({
      nombre: "Juan Carlos Cuervo",
      numero: "90.123",
      dni: "32.456.789",
      estado: "ACTIVO - AL DÍA",
      categoria: "Activo Pleno",
      antiguedad: "12 años",
      entitlements: {
        abono: "Platea Norte Baja",
        sector: "Sector C - Fila 12",
        puerta: "Puerta 4",
        acceso: "Av. La Plata",
        cochera: "Playón A - Fila 4",
        actividades: "Habilitado (Natación)"
      }
    });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scripts = {
    whatsapp: [
      { id: 'ws1', title: 'Bienvenida Nuevo Socio', text: `¡Hola! 👋 ¡Qué alegría que ya seas parte de la familia más grande del mundo! 🟦🟥 Tu trámite de alta en Socios Cuervos 2.0 se procesó correctamente. Ante cualquier duda, agendá nuestro WhatsApp oficial: ${WHATSAPP_NUMBER}. ¡Nos vemos en el Bidegain! 🏟️` },
      { id: 'ws2', title: 'Rechazo Débito Automático', text: `Hola [Nombre], te escribimos desde el Depto. de Socios porque el banco rechazó el pago. 💳 Podés regularizarlo por acá o en el portal para no perder beneficios ni puntos de ranking. ¡Cuidemos juntos al Club! ❤️` },
      { id: 'ws3', title: 'Socio Exterior / Interior', text: `¡Hola, Cuervo/a! 🌍 Tu categoría de Socio Exterior te permite mantener tu antigüedad y beneficios a distancia. ¿Te envío el link para el pago de la cuota o el alta de grupo familiar?` },
      { id: 'ws4', title: 'Pérdida de Carnet', text: `¡Hola! No te preocupes. Gestioná la reposición en sede Av. La Plata ($19.000) o usá el carnet digital de la App Oficial. El digital es válido para entrar al estadio hoy mismo. 🏟️` }
    ],
    email: [
      { id: 'em1', title: 'Resolución de Reclamo Ranking', text: "Estimado/a [Nombre]: Revisamos tu historial de asistencia y detectamos que no se computó el último partido vs Huracán. Hemos procedido a cargar manualmente el presente. Tus puntos de ranking ya están actualizados." },
      { id: 'em2', title: 'Confirmación Baja de Abono', text: "Hola [Nombre]: Te confirmamos que la baja de la renovación automática de tu abono 'Tu Lugar' ha sido procesada. Tu butaca quedará liberada para la venta general el próximo torneo." }
    ]
  };

  const faqs = [
    { q: "¿Qué trámites puedo hacer por WhatsApp?", a: `A través del ${WHATSAPP_NUMBER} podés: consultar tu estado de deuda, solicitar el alta como nuevo socio, adherirte al débito automático y resolver dudas sobre accesos al estadio.` },
    { q: "¿A partir de qué edad pagan cuota los menores?", a: "Los menores de 6 años tienen cuota $0. Deben tramitar el carnet infantil por cuestiones de seguro y control de capacidad." },
    { q: "¿Cómo funciona el Ranking de Entradas?", a: "Sumás puntos por antigüedad, cuota al día y asistencia a partidos previos. Es fundamental apoyar el carnet en el molinete para dar el presente." },
    { q: "¿Qué puerta me corresponde si tengo Abono a Platea?", a: "Platea Sur (Puerta 10/11), Platea Norte (Puerta 4/5), Popular local (Puerta 1). Siempre verificalo en el buscador arriba." },
  ];

  const operationalProcedures = [
    {
      title: "Alta de Socio (Presencial/Web)",
      icon: UserPlus,
      color: "blue",
      steps: [
        "Solicitar DNI físico y validar identidad en RENAPER.",
        "Seleccionar categoría (Activo/Cadete/Infantil) en Socios Cuervos 2.0.",
        "Cobrar: Cuota mes en curso + Costo Carnet Plástico.",
        "Tomar fotografía digital (Fondo blanco, sin gorra).",
        "Entregar Carnet provisorio o habilitar App Digital."
      ]
    },
    {
      title: "Gestión de Abonos 'Tu Lugar'",
      icon: Ticket,
      color: "red",
      steps: [
        "Verificar Cuota al Día (Excluyente).",
        "Abrir mapa de estadio en sistema y seleccionar butaca disponible.",
        "Confirmar período (Semestral/Anual/Copa).",
        "Generar link de pago o cobrar en terminal POS.",
        "Vincular butaca al Chip del Carnet (No requiere carnet nuevo)."
      ]
    },
    {
      title: "Baja de Socio",
      icon: UserMinus,
      color: "slate",
      steps: [
        "Consultar motivo (Económico/Disconformidad/Mudanza).",
        "Verificar saldo deudor. Si debe > 3 meses, ofrecer plan de quita.",
        "Si confirma baja: Solicitar nota firmada o mail de renuncia.",
        "Inactivar en padrón y bloquear acceso a molinetes.",
        "Informar que pierde antigüedad acumulada."
      ]
    },
    {
      title: "Cambio de Categoría",
      icon: RefreshCw,
      color: "green",
      steps: [
        "Automático: Cadete a Activo al cumplir 18 años.",
        "Manual: Socio Simple (Cancha) a Pleno (Deportes).",
        "Calcular prorrateo de diferencia de cuota.",
        "Actualizar derechos de acceso a Ciudad Deportiva."
      ]
    }
  ];

  const upcomingMatches = [
    { date: "Jueves 19/02", time: "21:15", rival: "Estudiantes (RC)", torneo: "Copa LPF" },
    { date: "Martes 24/02", time: "18:00", rival: "Instituto", torneo: "Copa LPF" },
    { date: "Sábado 07/03", time: "19:15", rival: "Independiente", torneo: "Copa LPF (Clásico)", highlight: true },
    { date: "Lunes 16/03", time: "17:45", rival: "Defensa y Justicia", torneo: "Copa LPF" },
  ];

  const claimsLogic = [
    {
      issue: "No suma puntos de Ranking",
      action: "Verificar log de molinetes fecha por fecha. Si hubo falla técnica, cargar 'Presente Administrativo'.",
      priority: "Alta"
    },
    {
      issue: "Doble débito de Cuota",
      action: "Solicitar comprobante bancario. Si se confirma, generar Nota de Crédito para el mes siguiente. No hacer reintegro efectivo salvo excepción.",
      priority: "Media"
    },
    {
      issue: "Acceso Denegado en Molinete",
      action: "Leer chip en Tablet de control. 1) Falta de pago -> Boletería. 2) Chip dañado -> Ingreso manual con DNI y reemisión de carnet posterior.",
      priority: "Crítica (Día de Partido)"
    },
    {
      issue: "Butaca Ocupada",
      action: "Verificar titularidad en sistema. Si está ocupada por un intruso, solicitar asistencia a Seguridad/Utedyc con el ticket de titularidad.",
      priority: "Alta (Día de Partido)"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative overflow-hidden">

      {/* MARCA DE AGUA GLOBAL - ESCUDO */}
      <div className="fixed -bottom-20 -right-20 pointer-events-none opacity-[0.03] z-0">
        <img
          src={SHIELD_URL}
          alt="Marca de Agua CASLA"
          className="h-[60vh] w-auto grayscale"
        />
      </div>

      {/* HEADER */}
      <header className="bg-[#002D58] text-white shadow-xl sticky top-0 z-50 border-b-4 border-[#E30613]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg border-2 border-slate-200">
              <img
                src={SHIELD_URL}
                alt="CASLA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight uppercase tracking-tight">
                PORTAL <span className="text-red-500">ADM SOCIOS</span>
              </h1>
              <p className="text-[10px] tracking-[0.2em] uppercase opacity-70 font-bold">Socios Cuervos 2.0</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-blue-950/50 p-2 rounded-xl border border-blue-800">
            <input
              type="text"
              placeholder="Buscar por DNI, N° Socio o Nombre..."
              className="bg-transparent text-sm w-72 outline-none border-none placeholder-blue-300 px-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all active:scale-95 shadow-lg">
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isAdmin ? 'bg-white text-blue-900 border-white shadow-lg' : 'bg-transparent text-white border-blue-700 hover:bg-blue-800'}`}
            >
              {isAdmin ? <><Lock size={14} /> Salir Admin</> : <><Settings size={14} /> Admin</>}
            </button>
            <button
              onClick={() => setShowEmergency(!showEmergency)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all shadow-lg ${showEmergency ? 'bg-red-600 animate-pulse' : 'bg-red-900/60 hover:bg-red-800'}`}
            >
              <AlertTriangle size={16} /> DÍA DE PARTIDO
            </button>
          </div>
        </div>
      </header>

      {/* RESULTADO DE BÚSQUEDA */}
      {searchResult && (
        <div className="bg-white border-b-2 border-slate-200 shadow-2xl p-6 animate-in slide-in-from-top duration-300 relative z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-10">
                <div className="border-l-4 border-blue-900 pl-4">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Socio Identificado</p>
                  <p className="font-black text-xl text-blue-900 uppercase">{searchResult.nombre}</p>
                  <p className="text-sm font-medium text-slate-500">DNI: {searchResult.dni} | N° {searchResult.numero}</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Estado Administrativo</p>
                  <p className="text-green-600 font-black text-xl flex items-center gap-2 uppercase">
                    <CheckCircle2 size={20} /> {searchResult.estado}
                  </p>
                  <p className="text-sm font-medium text-slate-500">{searchResult.categoria}</p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-6 shadow-2xl border border-blue-800">
                <div className="text-center px-4 border-r border-slate-700">
                  <p className="text-[10px] text-red-400 uppercase font-black mb-1">Puerta</p>
                  <p className="text-4xl font-black">{searchResult.entitlements.puerta}</p>
                </div>
                <div>
                  <p className="text-[10px] text-blue-400 uppercase font-black mb-1">Sector & Acceso</p>
                  <p className="text-lg font-bold">{searchResult.entitlements.abono}</p>
                  <p className="text-xs opacity-70 flex items-center gap-1 font-bold">
                    <MapPin size={12} className="text-red-500" /> Ingreso por: {searchResult.entitlements.acceso}
                  </p>
                </div>
                <button onClick={() => setSearchResult(null)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                  <LogOut size={20} className="text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-6 z-10">
        {/* SIDEBAR */}
        <aside className="md:w-64 flex flex-col gap-2">
          {!isAdmin ? (
            <>
              {[
                { id: 'inicio', label: 'Dashboard General', icon: HomeIcon },
                { id: 'tramites', label: 'Trámites Operativos', icon: ClipboardCheck },
                { id: 'reclamos', label: 'Gestión de Reclamos', icon: AlertTriangle },
                { id: 'scripts', label: 'Scripts de Respuesta', icon: MessageSquare },
                { id: 'faq', label: 'Ayuda / FAQ', icon: HelpCircle },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-[#002D58] text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-200 hover:text-blue-900'}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="p-4 mb-2 bg-blue-900 text-white rounded-2xl shadow-lg border-b-4 border-red-600">
                <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Sesión de Admin</p>
                <p className="text-sm font-bold">Admin_Socio_ADN</p>
              </div>
              {[
                { id: 'admin-stats', label: 'Métricas ADN', icon: BarChart3 },
                { id: 'admin-access', label: 'Control Molinetes', icon: ShieldCheck },
                { id: 'admin-users', label: 'Staff / Permisos', icon: Users },
                { id: 'admin-config', label: 'Configuración ADN', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </>
          )}

          <div className="mt-auto space-y-3">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone size={16} className="text-green-600" />
                <p className="text-[10px] font-black text-green-900 uppercase tracking-tighter">WhatsApp Oficial</p>
              </div>
              <p className="text-xs font-black text-green-700">{WHATSAPP_NUMBER}</p>
              <p className="text-[9px] text-green-600 mt-1 italic">Atención Lun a Vie 10-19h</p>
            </div>

            <div className="p-4 bg-slate-200/50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-blue-900" />
                <p className="text-[10px] font-black text-blue-950 uppercase tracking-tighter">Ubicación Sedes</p>
              </div>
              <p className="text-[10px] font-bold text-slate-600 leading-tight">
                <strong>Av. La Plata:</strong> 10:00 a 19:00<br />
                <strong>Ciudad Dep:</strong> 09:00 a 20:00
              </p>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 min-w-0">
          {!isAdmin ? (
            <>
              {activeTab === 'inicio' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Activo Pleno', val: '$33.500' },
                      { label: 'Cadete', val: '$28.100' },
                      { label: 'Exterior / Interior', val: '$16.200' },
                      { label: 'Reposición Carnet', val: '$19.000' },
                    ].map((p, i) => (
                      <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:scale-105 transition-transform relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-[0.05]">
                          <img src={SHIELD_URL} className="w-16 h-16" alt="shield bg" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{p.label}</p>
                        <p className="text-2xl font-black text-blue-900">{p.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* CALENDARIO DE PARTIDOS LOCAL */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-blue-900 p-4 flex items-center justify-between">
                      <h3 className="text-white font-bold flex items-center gap-2">
                        <Calendar className="text-red-500" size={20} /> Próximos Partidos en el Bidegain
                      </h3>
                      <span className="text-[10px] text-blue-200 uppercase font-black tracking-widest bg-blue-950 px-2 py-1 rounded">Local</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {upcomingMatches.map((match, idx) => (
                        <div key={idx} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${match.highlight ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                          <div className="flex items-center gap-4">
                            <div className="bg-slate-100 p-2 rounded-xl text-center min-w-[60px]">
                              <span className="text-[10px] font-black text-slate-400 uppercase">{match.date.split(' ')[0]}</span>
                              <p className="text-lg font-black text-blue-900">{match.date.split(' ')[1]}</p>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 flex items-center gap-2">
                                VS {match.rival}
                                {match.highlight && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-black">Clásico</span>}
                              </p>
                              <p className="text-xs text-slate-500">{match.torneo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end text-slate-600 font-bold">
                              <Clock size={14} /> {match.time} hs
                            </div>
                            <button className="text-[10px] text-blue-600 font-bold mt-1 hover:underline">Ver accesos &gt;</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden shadow-inner">
                    <div className="relative z-10">
                      <h2 className="text-3xl font-black text-[#002D58] mb-4 uppercase italic">Módulo Socios Cuervos 2.0</h2>
                      <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl font-medium">
                        Bienvenidos al sistema unificado de gestión. Este módulo centraliza Alta, Baja y Modificación de socios (ABM) junto con el nuevo motor de Abonos. Recordá que cada interacción es una oportunidad para fidelizar.
                      </p>
                      <div className="flex gap-4">
                        <button onClick={() => setActiveTab('tramites')} className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2 uppercase tracking-widest">
                          <ClipboardCheck size={16} /> Operaciones
                        </button>
                        <button onClick={() => setActiveTab('reclamos')} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-red-700 transition-all flex items-center gap-2 uppercase tracking-widest">
                          <AlertTriangle size={16} /> Reclamos
                        </button>
                      </div>
                    </div>
                    <img
                      src={SHIELD_URL}
                      className="absolute -right-10 -bottom-10 w-72 h-72 opacity-[0.06] rotate-12"
                      alt="CASLA Mark"
                    />
                  </div>
                </div>
              )}

              {/* TRAMITES OPERATIVOS */}
              {activeTab === 'tramites' && (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-900">
                      <ClipboardCheck size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Manual de Trámites</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Socios Cuervos 2.0</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {operationalProcedures.map((proc, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden">
                        <img src={SHIELD_URL} className="absolute -right-6 -top-6 w-24 h-24 opacity-[0.03]" alt="bg" />
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                            <proc.icon size={20} />
                          </div>
                          <h3 className="font-bold text-lg text-slate-800">{proc.title}</h3>
                        </div>
                        <ul className="space-y-3 relative z-10">
                          {proc.steps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-3 text-sm text-slate-600">
                              <span className="flex-shrink-0 w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 mt-0.5">{sIdx + 1}</span>
                              <span className="leading-tight">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GESTIÓN DE RECLAMOS */}
              {activeTab === 'reclamos' && (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-100 rounded-lg text-red-900">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-red-700 uppercase tracking-tight">Mesa de Ayuda Crítica</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Resolución de Conflictos</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                      <img src={SHIELD_URL} className="w-96 h-96" alt="bg claim" />
                    </div>
                    <table className="w-full text-left relative z-10">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Incidencia</th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Protocolo de Acción</th>
                          <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Prioridad</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {claimsLogic.map((claim, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-5 font-bold text-blue-900 text-sm align-top w-1/4">{claim.issue}</td>
                            <td className="p-5 text-slate-600 text-sm align-top leading-relaxed">{claim.action}</td>
                            <td className="p-5 align-top">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${claim.priority.includes("Crítica") ? "bg-red-100 text-red-800" :
                                claim.priority.includes("Alta") ? "bg-orange-100 text-orange-800" :
                                  "bg-blue-100 text-blue-800"
                                }`}>
                                {claim.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                    <Info className="text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm mb-1">Nota Importante sobre Reintegros</h4>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Toda devolución de dinero en efectivo superior a $50.000 requiere autorización de Tesorería. Priorizar siempre la emisión de Notas de Crédito aplicables a futuras cuotas sociales o abonos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'scripts' && (
                <div className="space-y-8 animate-in slide-in-from-bottom duration-300">
                  <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 relative overflow-hidden">
                    <img src={SHIELD_URL} className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.05]" alt="bg" />
                    <h2 className="text-2xl font-black text-green-900 mb-6 flex items-center gap-3 relative z-10">
                      <Smartphone className="text-green-600" /> WhatsApp Oficial {WHATSAPP_NUMBER}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 relative z-10">
                      {scripts.whatsapp.map(s => (
                        <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-green-400 transition-all">
                          <div>
                            <p className="text-[10px] font-black text-green-600 uppercase mb-2 tracking-widest">{s.title}</p>
                            <p className="text-sm text-slate-700 italic">"{s.text}"</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(s.text, s.id)}
                            className={`mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${copiedId === s.id ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700 shadow-md'}`}
                          >
                            {copiedId === s.id ? <><CheckCircle2 size={14} /> Copiado</> : <><Copy size={14} /> Copiar Respuesta</>}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-3 uppercase">
                      <Mail className="text-blue-600" /> Resoluciones Formales (E-mail)
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {scripts.email.map(s => (
                        <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-blue-300 transition-all">
                          <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest">{s.title}</p>
                            <p className="text-sm text-slate-700 italic leading-relaxed">"{s.text}"</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(s.text, s.id)}
                            className={`mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${copiedId === s.id ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white group-hover:bg-blue-950 shadow-md'}`}
                          >
                            {copiedId === s.id ? <><CheckCircle2 size={14} /> Copiado</> : <><Copy size={14} /> Copiar Cuerpo de Mail</>}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-4 animate-in fade-in">
                  <h2 className="text-2xl font-black text-blue-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                    <HelpCircle className="text-red-600" /> Centro de Ayuda ADN
                  </h2>
                  <div className="grid gap-4">
                    {faqs.map((f, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl transition-all shadow-sm">
                        <div className="font-black text-blue-900 mb-2 flex items-center gap-2 text-lg">
                          <div className="w-2 h-2 rounded-full bg-red-600"></div> {f.q}
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed border-l-2 border-slate-100 pl-4 ml-1">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* BACKEND DE ADMINISTRADOR - MANTENIDO */
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-green-500">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salud Socios Cuervos 2.0</p>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                  </div>
                  <p className="text-3xl font-black text-blue-900 tracking-tighter">ONLINE</p>
                  <p className="text-xs text-slate-500 mt-1">Sincronización Molinetes: OK</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-red-500">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reclamos Pendientes</p>
                  <p className="text-3xl font-black text-red-600">42</p>
                  <p className="text-xs text-slate-500 mt-1">SLA Promedio: 14m</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-blue-500">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recaudación ADN hoy</p>
                  <p className="text-3xl font-black text-blue-900">$2.4M</p>
                  <p className="text-xs text-slate-500 mt-1">124 Cobros procesados</p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border-b-8 border-red-600">
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3 uppercase italic tracking-tight">
                      <Lock size={24} className="text-red-500 shadow-lg" /> Control de Molinetes
                    </h3>
                    <p className="text-sm opacity-80 mb-6 leading-relaxed">
                      Protocolo de contingencia para apertura manual de molinetes. Solo habilitar en caso de fallo crítico en el handshake de la Puerta 4 o 10.
                    </p>
                    <div className="flex gap-4">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl transition-all active:scale-95 uppercase tracking-[0.1em]">Bypass General</button>
                      <button className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Reiniciar P10</button>
                    </div>
                  </div>
                  <div className="bg-blue-950/40 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <h4 className="text-[10px] font-black uppercase mb-4 opacity-50 tracking-widest flex items-center gap-2">
                      <BarChart3 size={12} /> Actividad en Tiempo Real
                    </h4>
                    <ul className="text-[11px] space-y-2 font-mono">
                      <li className="flex justify-between border-b border-white/5 pb-1"><span className="text-green-400 font-bold">09:42</span> Alta Socio #90.124 [OK]</li>
                      <li className="flex justify-between border-b border-white/5 pb-1"><span className="text-yellow-400 font-bold">09:43</span> Pago Rechazado DNI 32.XXX</li>
                      <li className="flex justify-between border-b border-white/5 pb-1"><span className="text-red-400 font-bold">09:44</span> Error Sync Molinete P4</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-100 border-t border-slate-200 py-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex flex-col items-center gap-2 z-10 relative">
        <div className="flex gap-4 mb-2 opacity-30 grayscale">
          <img src={SHIELD_URL} alt="logo footer" className="w-6 h-6" />
        </div>
        SAN LORENZO DE AlMAGRO | SISTEMA SOCIOS CUERVOS 2.0 | USO INTERNO EXCLUSIVO
      </footer>
    </div>
  );
}
