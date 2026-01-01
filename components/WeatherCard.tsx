
import React from 'react';
import { Wind, Droplets, MapPin, Calendar, Trash2, Edit2 } from 'lucide-react';
import { Weather } from '../types';

interface WeatherCardProps {
  weather: Weather;
  onDelete?: (id: string) => void;
  onEdit?: (weather: Weather) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onDelete, onEdit }) => {
  const dateStr = new Date(weather.fetchedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={() => onEdit(weather)}
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(weather.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-start mb-4 pr-16">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <MapPin size={14} />
            {weather.cityName}, {weather.country}
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{weather.description}</h3>
        </div>
        <div className="text-4xl font-black text-blue-600">{Math.round(weather.temperature)}°</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Droplets size={16} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Humidity</div>
            <div className="text-sm font-semibold text-slate-700">{weather.humidity}%</div>
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Wind size={16} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Wind</div>
            <div className="text-sm font-semibold text-slate-700">{weather.windSpeed} m/s</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <Calendar size={12} />
        Captured {dateStr}
      </div>
    </div>
  );
};

export default WeatherCard;
