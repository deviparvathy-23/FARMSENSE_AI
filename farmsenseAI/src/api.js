import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

// ── Disease Detection ────────────────────────────────────
export const analyzeDisease = async (imageFile, farmerId = 'anonymous') => {
  const form = new FormData()
  form.append('file', imageFile)
  form.append('farmer_id', farmerId)
  const { data } = await api.post('/disease/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// ── Chat ─────────────────────────────────────────────────
export const sendChatMessage = async (message, language = 'english', history = []) => {
  const { data } = await api.post('/chat/message', { message, language, history })
  return data
}

export const getLanguages = async () => {
  const { data } = await api.get('/chat/languages')
  return data.languages
}

// ── Weather ──────────────────────────────────────────────
export const getWeatherAdvice = async (lat, lon, crop = 'general') => {
  const { data } = await api.get('/weather/advice', { params: { lat, lon, crop } })
  return data
}

// ── Schemes ──────────────────────────────────────────────
export const findSchemes = async (state, land_acres, crop_type, annual_income = null) => {
  const { data } = await api.post('/schemes/find', { state, land_acres, crop_type, annual_income })
  return data
}

export default api
