import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Loader2, Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function ClassesPage() {
  const queryClient = useQueryClient();
  const [editingClass, setEditingClass] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    duration: 60,
    max_students: 1,
    scheduled_at: '',
    status: 'scheduled',
    meeting_link: '',
  });

  // Fetch classes
  const { data: classesResponse, isLoading, isError } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await api.get('/admin/classes');
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const classes = classesResponse?.data || classesResponse || [];

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/classes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      closeModal();
    },
    onError: (err) => alert('Error al actualizar clase: ' + (err.response?.data?.message || err.message))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/classes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
    onError: (err) => alert('Error al eliminar clase: ' + (err.response?.data?.message || err.message))
  });

  // Handlers
  const handleOpenModal = (cls) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title || '',
      description: cls.description || '',
      price: cls.price || 0,
      duration: cls.duration || 60,
      max_students: cls.max_students || 1,
      // Format datetime-local requires YYYY-MM-DDThh:mm format
      scheduled_at: cls.scheduled_at ? new Date(cls.scheduled_at).toISOString().slice(0, 16) : '',
      status: cls.status || 'scheduled',
      meeting_link: cls.meeting_link || '',
    });
    document.getElementById('class_modal').showModal();
  };

  const closeModal = () => {
    document.getElementById('class_modal').close();
    setEditingClass(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);

    updateMutation.mutate({ id: editingClass.id, data: formData }, {
      onSettled: () => setIsLoadingAction(false)
    });
  };

  const handleDelete = (id) => {
    setClassToDelete(id);
    document.getElementById('delete_modal').showModal();
  };

  const confirmDelete = () => {
    if (classToDelete) {
      deleteMutation.mutate(classToDelete);
      document.getElementById('delete_modal').close();
      setClassToDelete(null);
    }
  };

  return (
    <div className="p-2 sm:p-6 w-full max-w-7xl mx-auto animation-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Gestión de Clases
          </h1>
          <p className="text-base-content/60 mt-1">
            Revisa, actualiza o elimina las sesiones de coaching programadas.
          </p>
        </div>
        {/* Administradores generalmente no crean clases, lo hacen los coaches */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>Ocurrió un error al cargar las clases desde el servidor. O es posible que la base de datos esté vacía de clases.</span>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl shadow-xl border border-base-200">
          <h2 className="text-xl font-bold">No hay clases registradas</h2>
          <p className="opacity-70 mt-2">Los coaches aún no han creado ninguna sesión de juego.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200/60 pb-4">
          <table className="table w-full">
            <thead className="bg-base-200/50 text-base-content/80 text-sm">
              <tr>
                <th className="rounded-tl-2xl w-16">ID</th>
                <th>Clase y Relación</th>
                <th>Programación</th>
                <th>Detalles</th>
                <th>Estado</th>
                <th className="text-center rounded-tr-2xl">Gestión</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-base-200/40 transition-colors group">
                  <td className="font-mono text-xs opacity-50">#{cls.id}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-base">{cls.title}</div>
                      <div className="text-xs opacity-70">Coach: {cls.coach?.name || `ID ${cls.coach_id}`}</div>
                      <div className="text-xs opacity-70 text-primary font-semibold">Juego: {cls.game?.name || `ID ${cls.game_id}`}</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 text-sm opacity-80">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(cls.scheduled_at).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(cls.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.duration} min)</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1 text-sm opacity-80">
                      <div className="flex items-center gap-1 text-warning"><DollarSign className="w-3 h-3" /> {cls.price}</div>
                      <div className="flex items-center gap-1 text-info"><Users className="w-3 h-3" /> Máx: {cls.max_students}</div>
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-sm border-0 font-semibold uppercase tracking-wider text-[10px] ${cls.status === 'in_progress' ? 'bg-success/15 text-success' :
                      cls.status === 'completed' ? 'bg-info/15 text-info' :
                        cls.status === 'cancelled' ? 'bg-error/15 text-error' :
                          'bg-warning/15 text-warning' // scheduled
                      }`}>
                      {cls.status}
                    </div>
                  </td>
                  <th>
                    <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button className="btn btn-square btn-sm bg-info/10 hover:bg-info hover:text-white text-info border-0 transition-all duration-200" title="Ver detalles" onClick={() => handleOpenModal(cls)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-square btn-sm bg-success/10 hover:bg-success hover:text-white text-success border-0 transition-all duration-200"
                        title="Actualizar"
                        onClick={() => handleOpenModal(cls)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="btn btn-square btn-sm bg-error/10 hover:bg-error hover:text-white text-error border-0 transition-all duration-200"
                        title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Edición */}
      <dialog id="class_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-xl text-primary mb-2">Editar Clase</h3>
          <p className="py-2 text-sm opacity-70 mb-4">Solo administradores pueden modificar información sensible de las clases.</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full col-span-full">
                <label className="label"><span className="label-text font-medium">Título de la Clase</span></label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input input-bordered w-full focus:input-primary" />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Fecha y Hora</span></label>
                <input required type="datetime-local" value={formData.scheduled_at} onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })} className="input input-bordered w-full focus:input-primary" />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Estado</span></label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="select select-bordered w-full focus:select-primary">
                  <option value="scheduled">Programado (Scheduled)</option>
                  <option value="in_progress">En Progreso (In Progress)</option>
                  <option value="completed">Completada (Completed)</option>
                  <option value="cancelled">Cancelada (Cancelled)</option>
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Precio (USD)</span></label>
                <input required type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="input input-bordered w-full" />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Duración (minutos)</span></label>
                <input required type="number" step="1" min="1" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} className="input input-bordered w-full" />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Cupo Máximo</span></label>
                <input required type="number" step="1" min="1" value={formData.max_students} onChange={(e) => setFormData({ ...formData, max_students: Number(e.target.value) })} className="input input-bordered w-full" />
              </div>

              <div className="form-control w-full col-span-full">
                <label className="label"><span className="label-text font-medium">Enlace de la Reunión (Zoom/Discord)</span></label>
                <input type="url" value={formData.meeting_link} onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })} placeholder="https://..." className="input input-bordered w-full" />
              </div>

              <div className="form-control w-full col-span-full">
                <label className="label"><span className="label-text font-medium">Descripción</span></label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="textarea textarea-bordered h-24"></textarea>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button type="button" onClick={closeModal} className="btn btn-ghost mr-2" disabled={isLoadingAction}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={isLoadingAction}>
                {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>cerrar</button>
        </form>
      </dialog>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-secondary">Confirmar Eliminación</h3>
          <p className="py-4">¿Estás seguro de que deseas eliminar esta clase y sus inscripciones? Esta acción no se puede deshacer.</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost mr-2" onClick={() => setClassToDelete(null)}>Cancelar</button>
              <button type="button" className="btn btn-outline btn-secondary" onClick={confirmDelete}>Eliminar</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
