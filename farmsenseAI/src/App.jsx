import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import DiseaseScanner from './components/DiseaseScanner'
import ChatBot from './components/ChatBot'
import WeatherAdvisor from './components/WeatherAdvisor'
import SchemesFinder from './components/SchemesFinder'


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#52B788', secondary: '#fff' } },
        }}
      />

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/"        element={<DiseaseScanner />} />
          <Route path="/chat"    element={<ChatBot />} />
          <Route path="/weather" element={<WeatherAdvisor />} />
          <Route path="/schemes" element={<SchemesFinder />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 py-6 text-center">
        <p className="text-xs text-gray-400">
          🌾 FarmSense AI · SDG Goal 2: Zero Hunger ·
        </p>
      </footer>
    </div>
  )
}
