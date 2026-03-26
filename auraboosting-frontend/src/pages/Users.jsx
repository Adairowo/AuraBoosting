import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Loader2, UserCheck, UserX, Star } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    bio: '',
    avatar: '',
    rating: 0,
    is_verified: false,
    experience_years: 0,
    specialties: '',
  });

  // Fetch users
  const { data: usersResponse, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const users = usersResponse?.data || usersResponse || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newUser) => api.post('/admin/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    },
    onError: (err) => alert('Error al crear usuario: ' + (err.response?.data?.message || err.message))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    },
    onError: (err) => alert('Error al actualizar usuario: ' + (err.response?.data?.message || err.message))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: (err) => alert('Error al eliminar usuario: ' + (err.response?.data?.message || err.message))
  });

  // Handlers
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Leave empty for edit
        role: user.role || 'student',
        bio: user.bio || '',
        avatar: user.avatar || '',
        rating: user.rating || 0,
        is_verified: user.is_verified || false,
        experience_years: user.experience_years || 0,
        specialties: Array.isArray(user.specialties) ? user.specialties.join(', ') : (user.specialties || ''),
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '', email: '', password: '', role: 'student', bio: '', avatar: '', rating: 0, is_verified: false, experience_years: 0, specialties: ''
      });
    }
    document.getElementById('user_modal').showModal();
  };

  const closeModal = () => {
    document.getElementById('user_modal').close();
    setEditingUser(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);

    // Prepare data
    const payload = { ...formData };
    if (!payload.password) delete payload.password; // Don't send empty password on update
    payload.specialties = typeof payload.specialties === 'string'
      ? payload.specialties.split(',').map(s => s.trim()).filter(s => s)
      : payload.specialties;

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: payload }, {
        onSettled: () => setIsLoadingAction(false)
      });
    } else {
      createMutation.mutate(payload, {
        onSettled: () => setIsLoadingAction(false)
      });
    }
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    document.getElementById('delete_modal').showModal();
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
      document.getElementById('delete_modal').close();
      setUserToDelete(null);
    }
  };

  return (
    <div className="p-2 sm:p-6 w-full max-w-7xl mx-auto animation-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-primary bg-clip-text text-transparent">
            Gestión de Usuarios
          </h1>
          <p className="text-base-content/60 mt-1">
            Administra a todos los estudiantes, coaches y administradores del sistema.
          </p>
        </div>
        <button
          className="btn btn-primary shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-5 h-5 mr-1" />
          Añadir Usuario
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>{error?.response?.status === 401 ? 'No estás autorizado. Asegúrate de iniciar sesión como administrador.' : 'Ocurrió un error al cargar los usuarios desde el servidor.'}</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl shadow-xl border border-base-200">
          <h2 className="text-xl font-bold">No hay usuarios</h2>
          <p className="opacity-70 mt-2">Agrega un usuario para empezar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200/60 pb-4">
          <table className="table w-full">
            <thead className="bg-base-200/50 text-base-content/80 text-sm">
              <tr>
                <th className="rounded-tl-2xl">ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Detalles Coach</th>
                <th>Verificado</th>
                <th className="text-center rounded-tr-2xl">Gestión</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isCoach = user.role === 'coach';
                const isAdmin = user.role === 'admin';
                const roleColor = isAdmin ? 'text-error bg-error/15' : isCoach ? 'text-primary bg-primary/15' : 'text-success bg-success/15';

                return (
                  <tr key={user.id} className="hover:bg-base-200/40 transition-colors group">
                    <td className="font-mono text-xs opacity-50">#{user.id}</td>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12 shadow-sm group-hover:shadow-md transition-shadow bg-neutral text-neutral-content flex items-center justify-center">
                            {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <span className="text-lg font-bold">{user.name?.charAt(0).toUpperCase()}</span>}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-base">{user.name}</div>
                          <div className="text-xs opacity-70 mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge badge-sm border-0 font-semibold uppercase tracking-wider text-[10px] ${roleColor}`}>
                        {user.role}
                      </div>
                    </td>
                    <td>
                      {isCoach ? (
                        <div className="flex flex-col text-xs gap-1 opacity-80">
                          <div className="flex items-center gap-1 text-warning"><Star className="w-3 h-3 fill-warning" /> {user.rating} / 5</div>
                          <div>Exp: {user.experience_years} años</div>
                        </div>
                      ) : (
                        <span className="text-xs opacity-40">-</span>
                      )}
                    </td>
                    <td>
                      {user.is_verified ? (
                        <div className="flex items-center gap-1 text-success text-sm font-medium">
                          <UserCheck className="w-4 h-4" /> Activo
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-base-content/40 text-sm font-medium">
                          <UserX className="w-4 h-4" /> Inactivo
                        </div>
                      )}
                    </td>
                    <th>
                      <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="btn btn-square btn-sm bg-info/10 hover:bg-info hover:text-white text-info border-0 transition-all duration-200" title="Ver detalles" onClick={() => handleOpenModal(user)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="btn btn-square btn-sm bg-success/10 hover:bg-success hover:text-white text-success border-0 transition-all duration-200"
                          title="Actualizar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn btn-square btn-sm bg-error/10 hover:bg-error hover:text-white text-error border-0 transition-all duration-200"
                          title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Creación / Edición */}
      <dialog id="user_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-xl text-primary mb-4">{editingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Nombre Completo</span></label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input input-bordered w-full focus:input-primary" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Correo Electrónico</span></label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input input-bordered w-full focus:input-primary" />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Contraseña {editingUser && <span className="opacity-50 text-xs">(Opcional si no cambia)</span>}</span>
                </label>
                <input type="password" required={!editingUser} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="***" className="input input-bordered w-full focus:input-primary" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-medium">Rol</span></label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="select select-bordered w-full focus:select-primary">
                  <option value="student">Estudiante</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            {formData.role === 'coach' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-xl mt-4">
                <h4 className="col-span-full font-semibold text-primary/80">Opciones de Coach</h4>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium">Experiencia (Años)</span></label>
                  <input type="number" step="1" min="0" value={formData.experience_years} onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })} className="input input-bordered w-full" />
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium">Rating (0 - 5)</span></label>
                  <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="input input-bordered w-full" />
                </div>
                <div className="form-control w-full col-span-full">
                  <label className="label"><span className="label-text font-medium">Especialidades (separadas por coma)</span></label>
                  <input type="text" value={formData.specialties} onChange={(e) => setFormData({ ...formData, specialties: e.target.value })} placeholder="Ej. Mid Lane, Sniper, Duelist" className="input input-bordered w-full" />
                </div>
                <div className="form-control w-full col-span-full">
                  <label className="label"><span className="label-text font-medium">Biografía</span></label>
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="textarea textarea-bordered h-24" placeholder="Breve descripción..."></textarea>
                </div>
              </div>
            )}

            <div className="divider my-2"></div>

            <div className="flex justify-between items-center">
              <div className="form-control">
                <label className="label cursor-pointer gap-3">
                  <span className="label-text font-medium">Usuario Verificado / Activo</span>
                  <input type="checkbox" checked={formData.is_verified} onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })} className="toggle toggle-success" />
                </label>
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
          <p className="py-4">¿Estás seguro de que deseas eliminar a este usuario? Esta acción no se puede deshacer.</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost mr-2" onClick={() => setUserToDelete(null)}>Cancelar</button>
              <button type="button" className="btn btn-outline btn-secondary" onClick={confirmDelete}>Eliminar</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
