import React, { useState } from 'react';
import { Eye, Pencil, Loader2, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function EnrollmentsPage() {
  const queryClient = useQueryClient();
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);


  const [statusVal, setStatusVal] = useState('enrolled');


  const { data: enrollResponse, isLoading, isError } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const response = await api.get('/admin/enrollments');
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const enrollments = enrollResponse?.data || enrollResponse || [];


  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/enrollments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      closeModal();
    },
    onError: (err) => alert('Error al actualizar inscripción: ' + (err.response?.data?.message || err.message))
  });

  // Handlers
  const handleOpenModal = (enrollment) => {
    setEditingEnrollment(enrollment);
    setStatusVal(enrollment.status || 'enrolled');
    document.getElementById('enrollment_modal').showModal();
  };

  const closeModal = () => {
    document.getElementById('enrollment_modal').close();
    setEditingEnrollment(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);

    updateStatusMutation.mutate({ id: editingEnrollment.id, status: statusVal }, {
      onSettled: () => setIsLoadingAction(false)
    });
  };

  return (
    <div className="p-2 sm:p-6 w-full max-w-7xl mx-auto animation-fade-in">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Control de Inscripciones
          </h1>
          <p className="text-base-content/60 mt-1">
            Supervisa las reservas de los estudiantes y el estado de sus clases.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>Ocurrió un error al cargar las inscripciones.</span>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl shadow-xl border border-base-200">
          <h2 className="text-xl font-bold">No hay inscripciones</h2>
          <p className="opacity-70 mt-2">Aún no existen registros de estudiantes en clases.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200/60 pb-4">
          <table className="table w-full">
            <thead className="bg-base-200/50 text-base-content/80 text-sm">
              <tr>
                <th className="rounded-tl-2xl w-16">ID</th>
                <th>Estudiante</th>
                <th>Clase</th>
                <th>Inscripción / Precio</th>
                <th>Estado Progreso</th>
                <th className="text-center rounded-tr-2xl">Ajustar</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-base-200/40 transition-colors group">
                  <td className="font-mono text-xs opacity-50">#{enr.id}</td>
                  <td>
                    <div className="font-bold text-sm">{enr.student?.name || `Estudiante #${enr.student_id}`}</div>
                    <div className="text-xs opacity-60">ID Estudiante: {enr.student_id}</div>
                  </td>
                  <td>
                    <div className="font-bold text-sm text-primary">{enr.class?.title || `Clase #${enr.class_id}`}</div>
                    <div className="text-xs opacity-60 font-mono">Modificación de reserva</div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 text-xs opacity-80">
                      <div className="flex items-center gap-1 font-semibold text-success"><CreditCard className="w-3 h-3" /> Pago: {enr.payment_status}</div>
                      <div>Registrado: {new Date(enr.enrolled_at).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-sm border-0 font-semibold uppercase tracking-wider text-[10px] ${enr.status === 'attended' ? 'bg-success/15 text-success' :
                        enr.status === 'missed' ? 'bg-error/15 text-error' :
                          'bg-warning/15 text-warning' // enrolled
                      }`}>
                      {enr.status}
                    </div>
                  </td>
                  <th>
                    <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button className="btn btn-square btn-sm bg-info/10 hover:bg-info hover:text-white text-info border-0 transition-all duration-200" title="Ver" onClick={() => handleOpenModal(enr)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-square btn-sm bg-success/10 hover:bg-success hover:text-white text-success border-0 transition-all duration-200"
                        title="Cambiar Estado"
                        onClick={() => handleOpenModal(enr)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Status de Inscripción */}
      <dialog id="enrollment_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-primary mb-2">Administrar Inscripción</h3>
          <p className="py-2 text-sm opacity-70 mb-4">Actualizar el estado de la reserva. ID: #{editingEnrollment?.id}</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-medium">Estado de la reserva</span></label>
              <select value={statusVal} onChange={(e) => setStatusVal(e.target.value)} className="select select-bordered w-full focus:select-primary">
                <option value="enrolled">Inscrito (Enrolled)</option>
                <option value="attended">Asistió (Attended)</option>
                <option value="missed">Ausente (Missed)</option>
              </select>
            </div>

            <div className="modal-action mt-6">
              <button type="button" onClick={closeModal} className="btn btn-ghost mr-2" disabled={isLoadingAction}>Cerrar</button>
              <button type="submit" className="btn btn-primary" disabled={isLoadingAction}>
                {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Guardar Status
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>cerrar</button>
        </form>
      </dialog>
    </div>
  );
}
