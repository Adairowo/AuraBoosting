import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function GamesPage() {
  const queryClient = useQueryClient();
  const [editingGame, setEditingGame] = useState(null);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    is_active: true,
  });

  //
  const { data: gamesResponse, isLoading, isError } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await api.get('/games');
      return response.data;
    }
  });

  const games = gamesResponse?.data || gamesResponse || [];

  // Mutations para la gestión de administradores
  const createMutation = useMutation({
    mutationFn: (newGame) => api.post('/admin/games', newGame),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      closeModal();
    },
    onError: (err) => alert('Error al crear juego: ' + (err.response?.data?.message || err.message))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/games/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      closeModal();
    },
    onError: (err) => alert('Error al actualizar juego: ' + (err.response?.data?.message || err.message))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/games/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
    onError: (err) => alert('Error al eliminar juego: ' + (err.response?.data?.message || err.message))
  });

  // Handlers
  const handleOpenModal = (game = null) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        name: game.name || '',
        description: game.description || '',
        image: game.image || '',
        is_active: Boolean(game.is_active),
      });
    } else {
      setEditingGame(null);
      setFormData({
        name: '', description: '', image: '', is_active: true
      });
    }
    document.getElementById('game_modal').showModal();
  };

  const closeModal = () => {
    document.getElementById('game_modal').close();
    setEditingGame(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);

    // Prepare payload
    const payload = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      is_active: formData.is_active,
    };

    if (editingGame) {
      updateMutation.mutate({ id: editingGame.id, data: payload }, {
        onSettled: () => setIsLoadingAction(false)
      });
    } else {
      createMutation.mutate(payload, {
        onSettled: () => setIsLoadingAction(false)
      });
    }
  };

  const handleDelete = (id) => {
    setGameToDelete(id);
    document.getElementById('delete_modal').showModal();
  };

  const confirmDelete = () => {
    if (gameToDelete) {
      deleteMutation.mutate(gameToDelete);
      document.getElementById('delete_modal').close();
      setGameToDelete(null);
    }
  };

  return (
    <div className="p-2 sm:p-6 w-full max-w-7xl mx-auto animation-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-primary bg-clip-text text-transparent">
            Gestión de Juegos
          </h1>
          <p className="text-base-content/60 mt-1">
            Administra los juegos disponibles para coaching en la plataforma.
          </p>
        </div>
        <button
          className="btn btn-primary shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-5 h-5 mr-1" />
          Añadir Juego
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          <span>Ocurrió un error al cargar los juegos desde el servidor.</span>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl shadow-xl border border-base-200">
          <h2 className="text-xl font-bold">No hay juegos</h2>
          <p className="opacity-70 mt-2">Agrega un juego para empezar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200/60 pb-4">
          <table className="table w-full">
            <thead className="bg-base-200/50 text-base-content/80 text-sm">
              <tr>
                <th className="rounded-tl-2xl w-16">ID</th>
                <th>Información del Juego</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="text-center rounded-tr-2xl">Gestión</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-base-200/40 transition-colors group">
                  <td className="font-mono text-xs opacity-50">#{game.id}</td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-xl h-14 w-14 shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center">
                          {game.image && game.image.startsWith('http') ? (
                            <img src={game.image} alt={game.name} />
                          ) : (
                            <span className="text-lg font-bold">{game.name?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-base">{game.name}</div>
                        <div className="text-xs font-mono opacity-50 mt-0.5">Juego Base</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm opacity-80">{game.description || 'Sin descripción'}</span>
                  </td>
                  <td>
                    <div className={`badge badge-sm border-0 font-semibold gap-1 ${game.is_active
                      ? 'bg-success/15 text-success'
                      : 'bg-base-300 text-base-content/70'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${game.is_active ? 'bg-success' : 'bg-base-content/40'}`}></span>
                      {game.is_active ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>
                  <th>
                    <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button className="btn btn-square btn-sm bg-info/10 hover:bg-info hover:text-white text-info border-0 transition-all duration-200" title="Ver detalles" onClick={() => handleOpenModal(game)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-square btn-sm bg-success/10 hover:bg-success hover:text-white text-success border-0 transition-all duration-200"
                        title="Actualizar"
                        onClick={() => handleOpenModal(game)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="btn btn-square btn-sm bg-error/10 hover:bg-error hover:text-white text-error border-0 transition-all duration-200"
                        title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot className="bg-base-200/30 text-base-content/60">
              <tr>
                <th>ID</th>
                <th>Información del Juego</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="text-center">Gestión</th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Modal de Creación / Edición */}
      <dialog id="game_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-primary mb-2">
            {editingGame ? 'Editar Juego' : 'Añadir Juego'}
          </h3>
          <p className="py-2 text-sm opacity-70 mb-4">Complete la información del juego a continuación.</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Nombre del Juego</span>
              </label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ej. Valorant" className="input input-bordered w-full focus:input-primary" />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Descripción</span>
              </label>
              <input required type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Ej. FPS táctico 5v5" className="input input-bordered w-full focus:input-primary" />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">URL de Imagen (Avatar)</span>
              </label>
              <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className="input input-bordered w-full focus:input-primary" />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text font-medium">Juego Activo</span>
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="toggle toggle-success" />
              </label>
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
          <p className="py-4">¿Estás seguro de que deseas eliminar este juego? Esta acción no se puede deshacer.</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-ghost mr-2" onClick={() => setGameToDelete(null)}>Cancelar</button>
              <button type="button" className="btn btn-outline btn-secondary" onClick={confirmDelete}>Eliminar</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
