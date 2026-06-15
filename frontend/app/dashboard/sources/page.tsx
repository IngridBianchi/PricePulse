'use client';

import { useState, useEffect } from 'react';
import { Plus, Globe, ExternalLink, RefreshCw, Trash2, Edit2, Check, XCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setIsEditingId] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [formData, setFormData] = useState({
    competitor_name: '',
    url: '',
    frequency: 'daily',
    category: '',
  });

  const fetchSources = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/sources/');
      setSources(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const openCreateModal = () => {
    setIsEditingId(null);
    setFormData({ competitor_name: '', url: '', frequency: 'daily', category: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (source: any) => {
    setIsEditingId(source.id);
    setFormData({
      competitor_name: source.competitor_name,
      url: source.url,
      frequency: source.frequency,
      category: source.category || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiRequest(`/sources/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
      } else {
        await apiRequest('/sources/', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      setFormData({ competitor_name: '', url: '', frequency: 'daily', category: '' });
      fetchSources();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTrigger = async (id: number) => {
    try {
      await apiRequest(`/sources/${id}/trigger`, { method: 'POST' });
      alert('Sincronización forzada con éxito');
      fetchSources();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta fuente?')) return;
    try {
      await apiRequest(`/sources/${id}`, { method: 'DELETE' });
      fetchSources();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Fuentes de Monitoreo</h1>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Nueva Fuente
        </button>
      </div>

      {/* Explicación para el usuario */}
      {showInfo && (
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md relative">
          <button 
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
          <div className="flex">
            <div className="flex-shrink-0">
              <Globe className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="ml-3 pr-8">
              <h3 className="text-sm font-medium text-indigo-800">¿Qué son las Fuentes?</h3>
              <div className="mt-2 text-sm text-indigo-700">
                <p>
                  Las **Fuentes** son los sitios web o productos de tus competidores que quieres vigilar. 
                  Solo tienes que añadir la dirección (URL) y nosotros nos encargaremos de visitarla periódicamente para detectar cambios en el precio o si el producto se agota.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingId ? 'Editar Fuente' : 'Agregar Nueva Fuente'}
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre del Competidor</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.competitor_name}
                        onChange={(e) => setFormData({ ...formData, competitor_name: e.target.value })}
                        placeholder="Ej: Amazon, Mi Competidor Directo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL del Producto o Sitio</label>
                      <input
                        type="url"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.frequency}
                          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        >
                          <option value="hourly">Cada hora</option>
                          <option value="daily">Diario</option>
                          <option value="weekly">Semanal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría (Opcional)</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Ej: Electrónica"
                        />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                      >
                        {editingId ? 'Actualizar' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Cargando fuentes...</div>
        ) : sources.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No tienes fuentes configuradas aún. Comienza agregando una URL para monitorear.
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {sources.map((source: any) => (
              <li key={source.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-primary-600 truncate">{source.competitor_name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="truncate max-w-xs">{source.url}</span>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-400 hover:text-gray-600">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        source.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {source.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                      <button 
                        onClick={() => handleTrigger(source.id)}
                        className="text-gray-400 hover:text-primary-600"
                        title="Sincronizar ahora"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => openEditModal(source)}
                        className="text-gray-400 hover:text-primary-600"
                        title="Editar fuente"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(source.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Eliminar"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <RefreshCw className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Frecuencia: {source.frequency}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Último check: {source.updated_at ? new Date(source.updated_at).toLocaleString() : 'Nunca'}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
