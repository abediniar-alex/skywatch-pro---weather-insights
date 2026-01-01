
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Thermometer, MapPin, Plus } from 'lucide-react';
import { api } from '../api/client';
import { Weather } from '../types';
import WeatherCard from '../components/WeatherCard';
import WeatherChart from '../components/WeatherChart';

const Dashboard: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [weatherHistory, setWeatherHistory] = useState<Weather[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await api.getAllWeather();
      setWeatherHistory(data.slice(0, 5)); // Just last 5 for dashboard
    } catch (err: any) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName || !country) {
      setError('Please provide both city and country');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.createWeather({ cityName, country });
      setCityName('');
      setCountry('');
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Weather Insights</h1>
          <p className="text-slate-500 mt-2">Track real-time weather conditions across the globe.</p>
        </div>

        <form onSubmit={handleSearch} className="glass p-8 rounded-[40px] shadow-sm border-blue-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">City Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. London"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Country</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. UK"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Plus size={20} />
                    Track Weather
                  </>
                )}
              </button>
            </div>
          </div>
          {error && <p className="mt-4 text-red-500 text-sm font-medium ml-1">{error}</p>}
        </form>
      </section>

      {weatherHistory.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <WeatherChart data={weatherHistory} />
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Loader2 className={`text-blue-500 ${historyLoading ? 'animate-spin' : 'hidden'}`} size={18} />
              Recent Tracking
            </h3>
            <div className="space-y-4">
              {historyLoading && weatherHistory.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
                ))
              ) : (
                weatherHistory.map((w) => <WeatherCard key={w.id} weather={w} />)
              )}
            </div>
          </div>
        </section>
      )}

      {weatherHistory.length === 0 && !historyLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="bg-slate-100 p-6 rounded-full mb-4">
            <Thermometer size={48} />
          </div>
          <p className="text-lg font-medium">No weather data recorded yet.</p>
          <p className="text-sm">Enter a city above to start tracking.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
