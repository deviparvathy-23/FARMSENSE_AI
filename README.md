# 🌾 FarmSense AI

> AI-powered smart farming assistant for Indian farmers 

---

## 📌 About

**FarmSense AI** is a full-stack web application designed to empower Indian farmers with intelligent, AI-driven agricultural assistance.

The platform provides:

- 🔬 Crop disease detection using AI vision models
- 🤖 Multilingual farming chatbot with voice support
- 🌤️ Hyperlocal weather-based farming advice
- 📋 Government scheme eligibility finder

Built with modern web technologies and powered by advanced LLMs from Groq, FarmSense AI aims to make digital farming assistance accessible in regional Indian languages.

---

# ✨ Features

## 🔬 Crop Disease Scanner

Upload a photo of a crop leaf and let AI identify possible diseases instantly.

### Features
-  Upload crop leaf images
-  AI-powered disease detection
-  Confidence score & severity analysis
-  Organic treatment suggestions
-  Chemical treatment recommendations
-  Powered by **Llama 4 Scout Vision Model**

---

## 🤖 AI Farming Chatbot

An intelligent multilingual farming assistant for everyday agricultural guidance.

### Features
- 🌐 Supports **8 Indian Languages**
  - English
  - Hindi
  - Malayalam
  - Tamil
  - Telugu
  - Kannada
  - Bengali
  - Marathi

- Voice input support using **Web Speech API**
- Multi-turn conversation with context memory
- Quick reply suggestions
- Powered by **Llama 3.3 70B via Groq**

---

## 🌤️ Weather Advisory

Get real-time weather updates and crop-specific farming recommendations.

### Features
- Location-based weather data
- Hyperlocal weather forecasts
- Irrigation recommendations
- Pest & disease risk alerts
- Crop-specific farming suggestions

---

## 📋 Government Schemes Finder

Discover government schemes based on your farming profile.

### Features
- Personalized scheme recommendations
- Crop-specific eligibility matching
- State-based filtering
- Land-size eligibility checking
- AI-generated eligibility explanations

### Supported Schemes
- PM-KISAN
- PMFBY
- KCC
- PMKSY
- SMAM
- e-NAM
- and more...

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| AI (Text) | Groq API — Llama 3.3 70B Versatile |
| AI (Vision) | Groq API — Llama 4 Scout 17B |
| Database | Supabase (PostgreSQL) |
| HTTP Client | Axios |
| Icons | Lucide React |

---

# 🗂️ Project Structure

```bash
farmsense/
├── frontend/                     # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot.jsx          # AI voice/text chatbot
│   │   │   ├── DiseaseScanner.jsx   # Crop disease detection
│   │   │   ├── WeatherAdvisor.jsx   # Weather recommendations
│   │   │   ├── SchemesFinder.jsx    # Govt scheme matcher
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── backend/                      # FastAPI Backend
│   ├── main.py                   # FastAPI entry point
│   ├── routes/
│   │   ├── disease.py            # Disease detection API
│   │   ├── chat.py               # Chatbot API
│   │   ├── weather.py            # Weather advisory API
│   │   └── schemes.py            # Govt schemes API
│   │
│   ├── services/
│   │   ├── disease_ai.py         # Vision AI service
│   │   ├── chat_ai.py            # LangGraph chatbot logic
│   │   ├── weather_service.py
│   │   └── schemes_service.py
│   │
│   ├── models/
│   │   └── schemas.py            # Pydantic schemas
│   │
│   ├── database.py               # Supabase configuration
│   └── requirements.txt
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/deviparvathy-23/FARMSENSE_AI.git

cd farmsense-ai
```

---

# 🚀 Backend Setup

## Install Dependencies

```bash
cd backend

pip install -r requirements.txt
```

---

## Create `.env` File

Create a `.env` file inside the `backend/` folder:

```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

---

## Run Backend Server

```bash
uvicorn main:app --reload --port 8000
```

Backend runs on:

```bash
http://localhost:8000
```

---

# 💻 Frontend Setup

## Install Dependencies

```bash
cd frontend

npm install
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key from Groq |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |

---

# 📡 API Endpoints

| Endpoint | Description |
|---|---|
| `/disease` | Crop disease detection |
| `/chat` | AI chatbot |
| `/weather` | Weather recommendations |
| `/schemes` | Government schemes finder |

---

# 🌍 Supported Languages

- 🇮🇳 English
- 🇮🇳 Hindi
- 🇮🇳 Malayalam
- 🇮🇳 Tamil
- 🇮🇳 Telugu
- 🇮🇳 Kannada
- 🇮🇳 Bengali
- 🇮🇳 Marathi

---

# 🔮 Future Improvements

- Mobile app support
- Farm analytics dashboard
- Farmer profile management
- SMS/WhatsApp alerts
- Marketplace integration

---

# Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# Authors

Developed for Indian farmers.
