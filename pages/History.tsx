
import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, Search } from 'lucide-react';
import { api } from '../api/client';
import { Weather } from '../types';
import WeatherCard from '../components/WeatherCard';
import EditWeatherModal from '../components/EditWeatherModal';

const History: React.FC = () => {
  const [history, setHistory] = useState<Weather[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWeather, setEditingWeather] = useState<Weather | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getAllWeather();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.deleteWeather(id);
      setHistory(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      alert('Failed to delete record. Are you logged in?');
    }
  };

  const handleUpdate = async (id: string, cityName: string, country: string) => {
    await api.updateWeather(id, { cityName, country });
    await fetchHistory(); // Refresh list to get updated data and re-fetched weather details
  };

  const filteredHistory = history.filter(w => 
    w.cityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Weather History</h1>
          <p className="text-slate-500 mt-2">Browse and manage all stored weather captures.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filter by city or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((w) => (
            <WeatherCard 
              key={w.id} 
              weather={w} 
              onDelete={handleDelete} 
              onEdit={(weather) => setEditingWeather(weather)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 flex flex-col items-center text-slate-400 border border-slate-100 shadow-sm">
          <Trash2 size={48} className="mb-4 text-slate-200" />
          <p className="text-lg font-bold text-slate-600">No records found</p>
          <p className="text-sm">Try another search term or start tracking some weather!</p>
        </div>
      )}

      {editingWeather && (
        <EditWeatherModal 
          weather={editingWeather} 
          onClose={() => setEditingWeather(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default History;
