# 🌾 FarmSense AI — Full Stack System

📌 About
FarmSense AI is a full-stack web application that empowers Indian farmers with AI-driven tools for crop disease detection, multilingual farming advice, weather-based recommendations, and government scheme discovery.
Built as part of the 6-week IBM SkillsBuild AI Strategy & Business Intelligence Internship conducted by CSRBOX in association with AICTE (2 March 2026 – 12 April 2026).

✨ Features
🔬 Crop Disease Scanner

Upload a photo of any crop leaf
AI identifies the disease, confidence level, and severity
Provides organic and chemical treatment options
Powered by Llama 4 Scout vision model via Groq

🤖 AI Chatbot

Farming advice in 8 Indian languages

English, Hindi, Malayalam, Tamil, Telugu, Kannada, Bengali, Marathi


Voice input support using Web Speech API
Multi-turn conversation with context memory
Quick reply suggestions after every response
Powered by Llama 3.3 70B via Groq

🌤️ Weather Advisory

Real-time weather data based on location
Crop-specific farming recommendations
Irrigation and pest risk alerts

📋 Government Schemes Finder

Input your state, land size, and crop type
Instantly matched to eligible government schemes
Covers PM-KISAN, PMFBY, KCC, PMKSY, SMAM, e-NAM and more
AI-generated personalized eligibility message

---
🛠️ Tech Stack
LayerTechnologyFrontendReact 18, Vite, Tailwind CSSBackendFastAPI, Python 3.11+AI - TextGroq API — Llama 3.3 70B VersatileAI - VisionGroq API — Llama 4 Scout 17BDatabaseSupabase (PostgreSQL)HTTP ClientAxiosIconsLucide React

## 🗂️ Project Structure

```
farmsense/
├── frontend/          # React (Vite) + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot.jsx         # AI voice/text chatbot
│   │   │   ├── DiseaseScanner.jsx  # Crop photo upload & diagnosis
│   │   │   ├── WeatherAdvisor.jsx  # Hyperlocal weather + advice
│   │   │   ├── SchemesFinder.jsx   # Govt scheme matcher
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── backend/           # Python + FastAPI
│   ├── main.py        # FastAPI app entry point
│   ├── routes/
│   │   ├── disease.py      # Crop disease detection API
│   │   ├── chat.py         # AI chatbot API
│   │   ├── weather.py      # Weather advisory API
│   │   └── schemes.py      # Govt schemes API
│   ├── services/
│   │   ├── disease_ai.py   # TFLite / Gemini vision service
│   │   ├── chat_ai.py      # LangGraph chatbot service
│   │   ├── weather_service.py
│   │   └── schemes_service.py
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── database.py         # Supabase client
│   └── requirements.txt
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt

# Create .env file:
GEMINI_API_KEY=your_gemini_key
OPENWEATHER_API_KEY=your_openweather_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
# Create .env file:
VITE_API_URL=http://localhost:8000
VITE_OPENWEATHER_KEY=your_openweather_key
npm run dev
```

---
