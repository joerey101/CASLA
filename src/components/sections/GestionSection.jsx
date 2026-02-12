'use client';

export default function GestionSection({ database }) {
    const totalSocios = database.length;
    const activos = database.filter(u => (u.estado || u.status || '').includes('ACTIVO')).length;
    const casosAbiertos = database.flatMap(u => u.casos || []).filter(c => c.estado !== 'Cerrado' && c.estado !== 'Resuelto').length;
    const casosCriticos = database.flatMap(u => u.casos || []).filter(c => c.prioridad === 'Crítica').length;
    const recaudacion = (database.filter(u => u.entitlements?.acceso_estadio).length * 15000 / 1000000).toFixed(1);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-blue-500">
                    <p className="text-[10px] uppercase font-black text-slate-400">Total Socios Mock</p>
                    <p className="text-3xl font-black text-slate-800">{totalSocios}</p>
                    <div className="flex justify-between text-[10px] mt-2 font-bold">
                        <span className="text-green-600">{totalSocios > 0 ? Math.round((activos / totalSocios) * 100) : 0}% Activos</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-orange-500">
                    <p className="text-[10px] uppercase font-black text-slate-400">Casos Abiertos</p>
                    <p className="text-3xl font-black text-orange-600">{casosAbiertos}</p>
                    <p className="text-xs text-slate-500">Pendientes de gestión</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-green-500">
                    <p className="text-[10px] uppercase font-black text-slate-400">Recaudación Estimada</p>
                    <p className="text-3xl font-black text-green-600">$ {recaudacion}M</p>
                    <p className="text-xs text-slate-500">Proyección cuota mensual</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-red-500">
                    <p className="text-[10px] uppercase font-black text-slate-400">Casos Críticos</p>
                    <p className="text-3xl font-black text-red-600">{casosCriticos}</p>
                    <p className="text-xs text-slate-500">Requieren atención inmediata</p>
                </div>
            </div>
        </div>
    );
}
