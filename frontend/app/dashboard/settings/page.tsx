'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Save, Mail, Building, Key } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    tenant_name: ''
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiRequest('/users/me');
        setProfile({
          name: data.name || '',
          email: data.email,
          tenant_name: data.tenant?.name || 'Mi Empresa'
        });
      } catch (err) {
        console.error("Error al cargar perfil", err);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Endpoint simulado o real dependiendo de la API
      alert('Configuración guardada correctamente (Simulado)');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configuración del Sistema</h1>
        <p className="mt-1 text-sm text-gray-500">Administra tu cuenta, notificaciones y seguridad.</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <form onSubmit={handleSave} className="divide-y divide-gray-200">
          {/* Perfil */}
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <User className="mr-2 h-5 w-5 text-indigo-500" /> Información del Perfil
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    className="flex-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Email (No editable)</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="email"
                    disabled
                    className="bg-gray-50 flex-1 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm text-gray-500"
                    value={profile.email}
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Empresa / Tenant</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    className="flex-1 block w-full border border-gray-300 rounded-r-md py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={profile.tenant_name}
                    onChange={(e) => setProfile({...profile, tenant_name: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-indigo-500" /> Preferencias de Notificación
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="checkbox" defaultChecked className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Email Diario</label>
                  <p className="text-gray-500">Recibe un resumen todas las mañanas con los cambios más importantes.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input type="checkbox" defaultChecked className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Alertas Críticas</label>
                  <p className="text-gray-500">Notificar inmediatamente si un producto se queda sin stock.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Key className="mr-2 h-5 w-5 text-indigo-500" /> Seguridad
            </h3>
            <div className="mt-4">
              <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cambiar Contraseña
              </button>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <Save className="-ml-1 mr-2 h-5 w-5" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
