'use client';

import { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2, CheckCircle, XCircle, Info, HelpCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    description: '',
    events: 'price_change,stock_change',
  });

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/webhooks/');
      setWebhooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/webhooks/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setIsModalOpen(false);
      setFormData({ url: '', description: '', events: 'price_change,stock_change' });
      fetchWebhooks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este webhook?')) return;
    try {
      await apiRequest(`/webhooks/${id}`, { method: 'DELETE' });
      fetchWebhooks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Webhooks e Integraciones</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Nuevo Webhook
        </button>
      </div>

      {/* Explicación para el usuario común */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">¿Qué es un Webhook?</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Imagina que PricePulse es un mensajero. Un **Webhook** es la dirección de otra aplicación (como Slack, Zapier o tu propia tienda) a la que nuestro sistema correrá a avisar en cuanto detecte un cambio de precio o stock. 
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Automatiza:</strong> No necesitas entrar aquí para enterarte; la información viaja sola a donde tú quieras.</li>
                <li><strong>Conecta:</strong> Envía alertas a grupos de WhatsApp, canales de Discord o actualiza tus propios precios automáticamente.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Configurar Nuevo Webhook</h3>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL del Punto final (Endpoint)</label>
                    <input
                      type="url"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://tu-sistema.com/webhook"
                    />
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <HelpCircle className="h-3 w-3 mr-1" /> Dirección a la que enviaremos los datos.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ej: Conexión con mi Slack de ventas"
                    />
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 sm:col-start-2 sm:text-sm"
                    >
                      Activar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Webhooks */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Cargando...</div>
        ) : webhooks.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No has configurado webhooks aún. Añade uno para conectar PricePulse con otras aplicaciones.
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {webhooks.map((hook: any) => (
              <li key={hook.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Webhook className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-primary-600 truncate">{hook.description || 'Webhook sin descripción'}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{hook.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {hook.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <XCircle className="mr-1 h-3 w-3" /> Inactivo
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDelete(hook.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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
