import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../api'
import { Send, Mic, MicOff, Globe, MessageCircle, Loader2, Bot, User } from 'lucide-react'
import toast from 'react-hot-toast'

const LANGUAGES = [
  { code: 'english',   label: 'English',  native: 'English' },
  { code: 'malayalam', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'hindi',     label: 'Hindi',    native: 'हिंदी' },
  { code: 'tamil',     label: 'Tamil',    native: 'தமிழ்' },
  { code: 'telugu',    label: 'Telugu',   native: 'తెలుగు' },
  { code: 'kannada',   label: 'Kannada',  native: 'ಕನ್ನಡ' },
  { code: 'bengali',   label: 'Bengali',  native: 'বাংলা' },
  { code: 'marathi',   label: 'Marathi',  native: 'मराठी' },
]

const STARTERS = [
  'How do I treat yellow leaves on my tomato plant?',
  'What crops should I plant this season?',
  'Tell me about PM-KISAN scheme',
  'How often should I water rice crops?',
  'What is the best fertilizer for wheat?',
]

export default function ChatBot() {
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [language, setLanguage]   = useState('english')
  const [loading, setLoading]     = useState(false)
  const [recording, setRecording] = useState(false)
  const [showLang, setShowLang]   = useState(false)
  const bottomRef                  = useRef(null)
  const recognitionRef             = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Build history for API
  const getHistory = () =>
    messages.map(m => ({ role: m.role, content: m.content }))

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg = { role: 'user', content: msg, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const data = await sendChatMessage(msg, language, getHistory())
      const botMsg = {
        role: 'assistant',
        content: data.reply,
        suggestions: data.suggestions || [],
        id: Date.now() + 1,
      }
      setMessages(prev => [...prev, botMsg])
    } catch {
      toast.error('Could not reach FarmSense AI. Check your connection.')
      setMessages(prev => prev.filter(m => m.id !== userMsg.id))
    } finally {
      setLoading(false)
    }
  }

  // Voice input via Web Speech API
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser. Try Chrome.')
      return
    }
    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    const langMap = {
      english: 'en-IN', malayalam: 'ml-IN', hindi: 'hi-IN',
      tamil: 'ta-IN', telugu: 'te-IN', kannada: 'kn-IN',
      bengali: 'bn-IN', marathi: 'mr-IN',
    }
    rec.lang = langMap[language] || 'en-IN'
    rec.interimResults = false
    rec.onresult = (e) => {
      setInput(e.results[0][0].transcript)
      setRecording(false)
    }
    rec.onerror = () => {
      toast.error('Voice recognition failed. Please try again.')
      setRecording(false)
    }
    rec.onend = () => setRecording(false)
    recognitionRef.current = rec
    rec.start()
    setRecording(true)
  }

  const currentLang = LANGUAGES.find(l => l.code === language)

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>

      {/* Header */}
      <div className="card mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-farm-pale p-3 rounded-xl">
            <MessageCircle className="text-farm-mid" size={24} />
          </div>
          <div>
            <h1 className="section-title mb-0">AI Farming Assistant</h1>
            <p className="text-gray-500 text-sm">Ask anything about farming in your language</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLang(s => !s)}
            className="flex items-center gap-2 bg-farm-pale text-farm-dark px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition"
          >
            <Globe size={14} />
            <span>{currentLang?.native}</span>
          </button>
          {showLang && (
            <div className="absolute right-0 top-10 bg-white shadow-xl border border-gray-100 rounded-xl z-10 w-44 overflow-hidden">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLang(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-farm-pale transition
                    ${l.code === language ? 'bg-farm-pale font-semibold text-farm-dark' : 'text-gray-700'}`}
                >
                  {l.native} <span className="text-gray-400 text-xs">({l.label})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-3">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-5">
            <div className="text-6xl">🌾</div>
            <p className="text-gray-500 text-sm">Ask me anything about farming!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTERS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-sm bg-white border border-farm-leaf text-farm-mid px-3 py-1.5 rounded-full
                             hover:bg-farm-pale transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${msg.role === 'user' ? 'bg-farm-mid' : 'bg-farm-amber'}`}
            >
              {msg.role === 'user'
                ? <User size={14} className="text-white" />
                : <Bot size={14} className="text-farm-dark" />
              }
            </div>

            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === 'user'
                  ? 'bg-farm-mid text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>

              {/* Quick reply suggestions */}
              {msg.suggestions?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="text-xs bg-farm-pale text-farm-dark border border-green-200 px-2.5 py-1
                                 rounded-full hover:bg-green-100 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="chat-bubble flex gap-3">
            <div className="w-8 h-8 rounded-full bg-farm-amber flex items-center justify-center shrink-0">
              <Bot size={14} className="text-farm-dark" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-farm-leaf rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="card mt-2 !p-3">
        <div className="flex gap-2">
          <button
            onClick={toggleVoice}
            title={recording ? 'Stop recording' : 'Voice input'}
            className={`p-2.5 rounded-xl transition shrink-0
              ${recording
                ? 'bg-red-500 text-white recording'
                : 'bg-gray-100 text-gray-500 hover:bg-farm-pale hover:text-farm-mid'
              }`}
          >
            {recording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={`Ask in ${currentLang?.native}…`}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-farm-leaf focus:border-transparent"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary !px-4 !py-2.5 shrink-0"
          >
            {loading
              ? <Loader2 size={16} className="spinner" />
              : <Send size={16} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
