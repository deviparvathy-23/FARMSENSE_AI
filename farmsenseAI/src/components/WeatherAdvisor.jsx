import { useState } from 'react'
import { getWeatherAdvice } from '../api'
import {
  CloudSun, MapPin, Droplets, Wind, Thermometer,
  Loader2, CheckCircle, AlertTriangle, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const CROPS = [
  'general', 'rice', 'wheat', 'tomato', 'potato', 'onion',
  'banana', 'sugarcane', 'cotton', 'maize', 'coconut',
  'mango', 'rubber', 'pepper', 'cardamom',
]

const WEATHER_ICONS = {
  'clear sky':         '☀️',
  'few clouds':        '🌤️',
  'scattered clouds':  '⛅',
  'broken clouds':     '🌥️',
  'overcast clouds':   '☁️',
  'light rain':        '🌦️',
  'moderate rain':     '🌧️',
  'heavy intensity rain': '⛈️',
  'thunderstorm':      '⛈️',
  'mist':              '🌫️',
  'haze':              '🌫️',
}

function getIcon(desc = '') {
  const key = Object.keys(WEATHER_ICONS).find(k => desc.toLowerCase().includes(k))
  return WEATHER_ICONS[key] || '🌡️'
}

export default function WeatherAdvisor() {
  const [crop, setCrop]       = useState('general')
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [locating, setLoc]    = useState(false)
  const [manualLat, setLat]   = useState('')
  const [manualLon, setLon]   = useState('')

  const fetchWeather = async (lat, lon) => {
    setLoading(true)
    setData(null)
    try {
      const result = await getWeatherAdvice(lat, lon, crop)
      setData(result)
    } catch {
      toast.error('Could not fetch weather. Check your OpenWeather API key.')
    } finally {
      setLoading(false)
    }
  }

  const useGPS = () => {
    if (!navigator.geolocation) {
      toast.error('GPS not available in this browser.')
      return
    }
    setLoc(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc(false)
        fetchWeather(pos.coords.latitude, pos.coords.longitude)
      },
      () => {
        setLoc(false)
        toast.error('Location access denied. Enter coordinates manually.')
      }
    )
  }

  const useManual = () => {
    if (!manualLat || !manualLon) return toast.error('Enter both latitude and longitude.')
    fetchWeather(parseFloat(manualLat), parseFloat(manualLon))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-3 rounded-xl">
            <CloudSun className="text-blue-500" size={26} />
          </div>
          <div>
            <h1 className="section-title">Smart Weather Advisor</h1>
            <p className="text-gray-500 text-sm">
              Hyperlocal weather + AI farming advice for your location
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card space-y-4">
        {/* Crop selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Crop</label>
          <div className="flex flex-wrap gap-2">
            {CROPS.map(c => (
              <button
                key={c}
                onClick={() => setCrop(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition
                  ${crop === c
                    ? 'bg-farm-mid text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-farm-pale'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={useGPS}
            disabled={locating || loading}
            className="btn-primary flex-1"
          >
            {locating
              ? <><Loader2 size={16} className="spinner" /> Locating…</>
              : <><MapPin size={16} /> Use My GPS Location</>
            }
          </button>

          <div className="flex gap-2 flex-1">
            <input
              type="number"
              value={manualLat}
              onChange={e => setLat(e.target.value)}
              placeholder="Latitude"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-farm-leaf"
            />
            <input
              type="number"
              value={manualLon}
              onChange={e => setLon(e.target.value)}
              placeholder="Longitude"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-farm-leaf"
            />
            <button onClick={useManual} disabled={loading} className="btn-secondary !px-3">
              {loading ? <Loader2 size={16} className="spinner" /> : <RefreshCw size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {data && (
        <div className="space-y-4">

          {/* Current weather card */}
          <div className="card bg-gradient-to-br from-blue-600 to-blue-400 text-white !border-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="opacity-80" />
                  <span className="text-sm opacity-90">{data.weather.location}</span>
                </div>
                <div className="text-5xl font-bold">{Math.round(data.weather.temperature)}°C</div>
                <div className="text-blue-100 mt-1">{data.weather.description}</div>
                <div className="text-blue-200 text-sm">
                  Feels like {Math.round(data.weather.feels_like)}°C
                </div>
              </div>
              <div className="text-6xl">
                {getIcon(data.weather.description)}
              </div>
            </div>

            <div className="flex gap-6 mt-4 pt-4 border-t border-blue-300/40">
              <div className="flex items-center gap-1.5">
                <Droplets size={16} className="opacity-80" />
                <span className="text-sm">{data.weather.humidity}% Humidity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind size={16} className="opacity-80" />
                <span className="text-sm">{data.weather.wind_speed} m/s Wind</span>
              </div>
            </div>
          </div>

          {/* AI Farming Advice */}
          <div className="card border-l-4 border-farm-leaf">
            <p className="text-xs font-semibold text-farm-leaf uppercase tracking-wider mb-2">
              🤖 AI Farming Advice
            </p>
            <p className="text-gray-700 leading-relaxed">{data.farming_advice}</p>

            <div className="flex gap-3 mt-4 flex-wrap">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                ${data.sowing_suitable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {data.sowing_suitable ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                {data.sowing_suitable ? 'Good for Sowing' : 'Avoid Sowing Today'}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                ${data.irrigation_needed ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
              >
                <Droplets size={14} />
                {data.irrigation_needed ? 'Irrigation Needed' : 'Irrigation Not Required'}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {data.alerts?.length > 0 && (
            <div className="card border-l-4 border-orange-400 bg-orange-50">
              <p className="text-sm font-semibold text-orange-700 mb-2">⚠️ Weather Alerts</p>
              <ul className="space-y-1">
                {data.alerts.map((a, i) => (
                  <li key={i} className="text-sm text-orange-700 flex gap-2">
                    <span>•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5-day forecast */}
          {data.weather.forecast?.length > 0 && (
            <div className="card">
              <p className="text-sm font-semibold text-gray-700 mb-3">📅 Upcoming Forecast</p>
              <div className="space-y-2">
                {data.weather.forecast.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                    <span className="text-sm text-gray-500 w-36">{f.time?.replace('T', ' ').slice(0, 16)}</span>
                    <span className="text-lg">{getIcon(f.description)}</span>
                    <span className="text-sm text-gray-600 capitalize flex-1 text-center">{f.description}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <Thermometer size={13} className="text-red-400" />
                      <span className="font-medium">{Math.round(f.temp)}°C</span>
                      <Droplets size={13} className="text-blue-400" />
                      <span className="text-gray-500">{f.humidity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
