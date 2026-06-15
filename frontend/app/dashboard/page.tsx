'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Bell
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const mockData = [
  { name: 'Lun', precio: 100 },
  { name: 'Mar', precio: 98 },
  { name: 'Mie', precio: 98 },
  { name: 'Jue', precio: 105 },
  { name: 'Vie', precio: 102 },
  { name: 'Sab', precio: 95 },
  { name: 'Dom', precio: 95 },
];

export default function DashboardOverview() {
  const [data, setData] = useState({
    price_trend: [],
    alerts_by_category: [],
    stats: {
      sources: 0,
      alerts: 0,
      activeJobs: 0,
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const result = await apiRequest('/stats/summary');
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando resumen...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Resumen General</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Fuentes Monitoreadas</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.stats.sources}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Alertas sin leer</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.stats.alerts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sincronización Activa</dt>
                  <dd className="text-lg font-medium text-gray-900">{data.stats.active_jobs}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Tendencia de Precios (Promedio)</h3>
          <div className="h-64">
            {data.price_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.price_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="precio" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No hay datos de precios todavía
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Alertas por Categoría</h3>
          <div className="h-64">
            {data.alerts_by_category.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.alerts_by_category}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No hay alertas generadas todavía
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

