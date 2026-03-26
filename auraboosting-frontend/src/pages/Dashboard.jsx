import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Users, BookOpen, Gamepad2, Bookmark, Loader2 } from 'lucide-react';

function DashboardPage() {
  // Fetch lists
  const queryFnSafe = (url) => api.get(url).then(res => {
    let payload = res.data;
    if (payload?.status === 'success' && payload?.data) payload = payload.data;
    if (payload?.data && Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  });

  const { data: usersData, isLoading: loadUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => queryFnSafe('/admin/users')
  });

  const { data: gamesData, isLoading: loadGames } = useQuery({
    queryKey: ['games'],
    queryFn: () => queryFnSafe('/games')
  });

  const { data: classesData, isLoading: loadClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: () => queryFnSafe('/admin/classes')
  });

  const { data: enrollsData, isLoading: loadEnrolls } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => queryFnSafe('/admin/enrollments')
  });

  const isLoading = loadUsers || loadGames || loadClasses || loadEnrolls;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const usersCount = Array.isArray(usersData) ? usersData.length : 0;
  const gamesCount = Array.isArray(gamesData) ? gamesData.length : 0;
  
  const activeClasses = Array.isArray(classesData) ? classesData.filter(c => c.status === 'scheduled' || c.status === 'in_progress').length : 0;
  const totalEnrolls = Array.isArray(enrollsData) ? enrollsData.length : 0;
  
  const recentEnrolls = Array.isArray(enrollsData) ? enrollsData.slice(0, 5) : []; // Últimas 5 inscripciones

  const stats = [
    { label: 'Usuarios totales', value: usersCount, icon: <Users className="w-6 h-6 opacity-60 text-primary-content" />, color: 'text-primary', bgIcon: 'bg-primary/20 text-primary' },
    { label: 'Juegos disponibles', value: gamesCount, icon: <Gamepad2 className="w-6 h-6 opacity-60 text-secondary-content" />, color: 'text-secondary', bgIcon: 'bg-secondary/20 text-secondary' },
    { label: 'Clases activas', value: activeClasses, icon: <BookOpen className="w-6 h-6 opacity-60 text-success-content" />, color: 'text-success', bgIcon: 'bg-success/20 text-success' },
    { label: 'Inscripciones', value: totalEnrolls, icon: <Bookmark className="w-6 h-6 opacity-60 text-info-content" />, color: 'text-info', bgIcon: 'bg-info/20 text-info' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animation-fade-in sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Dashboard
          </h1>
          <p className="text-sm opacity-70 mt-1">Resumen general del sistema en tiempo real</p>
        </div>
        <div className="badge badge-accent badge-outline font-semibold py-3 px-4 shadow-sm text-xs">🟢 Conectado con API</div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="opacity-70 text-sm font-semibold">{stat.label}</p>
                  <p className={`text-5xl font-black mt-3 flex items-center gap-2 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform ${stat.bgIcon}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 mt-8 mb-8 overflow-hidden">
        <div className="bg-base-200/50 px-8 py-4 border-b border-base-200 flex items-center justify-between">
          <h3 className="font-bold text-lg">Actividad Reciente</h3>
          <span className="text-xs font-semibold opacity-60 uppercase tracking-widest">Últimas Inscripciones</span>
        </div>
        
        <div className="card-body px-0 py-0">
          {recentEnrolls.length === 0 ? (
            <div className="text-center py-10 opacity-70">
              <p>Aún no hay inscripciones en la plataforma.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="table">
                <thead>
                  <tr className="bg-base-100 uppercase text-[10px] tracking-wider font-bold">
                    <th className="pl-6">Fecha y Hora</th>
                    <th>Alumno</th>
                    <th>Clase Seleccionada</th>
                    <th>Progreso</th>
                    <th className="pr-6 text-right">Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrolls.map((enr) => (
                    <tr key={enr.id} className="hover:bg-base-200/30 transition-colors">
                      <td className="whitespace-nowrap shadow-none text-xs font-mono opacity-60 pl-6">
                        {new Date(enr.created_at || enr.enrolled_at || Date.now()).toLocaleString()}
                      </td>
                      <td>
                        <div className="font-bold text-sm">
                          {enr.student?.name || `Estudiante #${enr.student_id}`}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-medium">
                          {enr.class?.title || `Clase #${enr.class_id}`}
                        </div>
                      </td>
                      <td>
                        <div className={`badge badge-sm border-0 font-bold uppercase text-[9px] ${
                          enr.status === 'attended' ? 'bg-success/15 text-success' :
                          enr.status === 'missed' ? 'bg-error/15 text-error' :
                          'bg-warning/15 text-warning' // enrolled
                        }`}>
                          {enr.status}
                        </div>
                      </td>
                      <td className="pr-6 text-right">
                        <div className={`badge badge-sm font-bold uppercase tracking-widest text-[9px] ${
                          enr.payment_status === 'paid' ? 'badge-success badge-outline' :
                          enr.payment_status === 'refunded' ? 'badge-error badge-outline' :
                          'badge-warning badge-outline'
                        }`}>
                          {enr.payment_status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
