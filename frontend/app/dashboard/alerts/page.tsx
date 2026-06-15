'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, AlertTriangle, XCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [lastAlertId, setLastAlertId] = useState<number | null>(null);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const showBrowserNotification = (alert: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`PricePulse: ${alert.product_name || 'Nueva Alerta'}`, {
        body: alert.message,
        icon: '/favicon.ico'
      });
    }
  };

  const fetchAlerts = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await apiRequest('/alerts');
      
      // Check for new alerts to show notification
      if (!isInitial && data.length > 0 && lastAlertId !== null) {
        const newAlerts = data.filter((a: any) => a.id > lastAlertId && !a.is_read);
        if (newAlerts.length > 0) {
          newAlerts.forEach(showBrowserNotification);
        }
      }

      if (data.length > 0) {
        const maxId = Math.max(...data.map((a: any) => a.id));
        setLastAlertId(maxId);
      }

      setAlerts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(true);
    requestNotificationPermission();

    // Poll for new alerts every 30 seconds
    const interval = setInterval(() => fetchAlerts(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const testNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      new Notification('PricePulse', {
        body: 'Las notificaciones están activadas correctamente.',
      });
    } else {
      alert('Por favor, activa las notificaciones en tu navegador.');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await apiRequest(`/alerts/${id}/read`, { method: 'PUT' });
      fetchAlerts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteAlert = async (id: number) => {
    if (!confirm('¿Eliminar esta alerta?')) return;
    try {
      await apiRequest(`/alerts/${id}`, { method: 'DELETE' });
      fetchAlerts();
      if (selectedAlert?.id === id) setSelectedAlert(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_change': return <Bell className="h-6 w-6 text-green-600" />;
      case 'stock_change': return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      default: return <Bell className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Alertas y Cambios Detallados</h1>
        <button 
          onClick={testNotification}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Bell className="mr-2 h-4 w-4" />
          Probar Notificaciones
        </button>
      </div>

      {/* Explicación para el usuario */}
      {showInfo && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md relative">
          <button 
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-yellow-400 hover:text-yellow-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
          <div className="flex">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3 pr-8">
              <h3 className="text-sm font-medium text-yellow-800">¿Cómo funcionan las Alertas?</h3>
              <div className="mt-2 text-sm text-yellow-700 space-y-2">
                <p>
                  Nuestro sistema monitorea tus fuentes y genera notificaciones cuando detecta cambios relevantes. Los tipos de alertas que recibirás son:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Cambio de Precio:</strong> Se activa cuando el valor del producto sube o baja.</li>
                  <li><strong>Cambio de Stock:</strong> Te avisa si un producto vuelve a estar disponible o se agota.</li>
                  <li><strong>Promociones:</strong> Detecta si se ha aplicado un descuento o etiqueta de oferta.</li>
                </ul>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Section */}
        <div className="lg:col-span-2 bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Cargando alertas...</div>
          ) : alerts.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No tienes alertas aún.
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {alerts.map((alert: any) => (
                <li 
                  key={alert.id} 
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${alert.is_read ? 'opacity-60' : 'bg-primary-50/20'} ${selectedAlert?.id === alert.id ? 'ring-2 ring-primary-500 ring-inset' : ''}`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gray-100`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-primary-700">{alert.product_name || 'Producto Desconocido'}</p>
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                        {!alert.is_read && (
                          <button 
                            onClick={() => markAsRead(alert.id)}
                            className="text-gray-400 hover:text-primary-600"
                            title="Marcar como leída"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteAlert(alert.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Eliminar"
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

        {/* Detail Section */}
        <div className="bg-white shadow sm:rounded-md p-6 h-fit sticky top-6">
          {selectedAlert ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalle de Alerta</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedAlert.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                  selectedAlert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</label>
                  <p className="mt-1 text-sm font-bold text-gray-900">{selectedAlert.product_name || 'Desconocido'}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mensaje</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAlert.message}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Valor Anterior</label>
                    <p className="mt-1 text-lg font-bold text-gray-600 line-through">
                      {selectedAlert.type === 'price_change' ? `$${selectedAlert.old_value}` : selectedAlert.old_value}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Valor Nuevo</label>
                    <p className={`mt-1 text-lg font-bold ${
                      selectedAlert.type === 'price_change' ? (Number(selectedAlert.new_value) < Number(selectedAlert.old_value) ? 'text-green-600' : 'text-red-600') : 'text-primary-600'
                    }`}>
                      {selectedAlert.type === 'price_change' ? `$${selectedAlert.new_value}` : selectedAlert.new_value}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Detectado el</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedAlert.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Bell className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>Selecciona una alerta para ver los detalles del cambio.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
