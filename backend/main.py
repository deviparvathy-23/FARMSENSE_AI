from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import disease, chat, weather, schemes

app = FastAPI(
    title="FarmSense AI",
    description="AI-Powered Crop Disease Detection & Smart Farming Assistant — SDG Goal 2",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://farmsense-ai-three.vercel.app","*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────
app.include_router(disease.router)
app.include_router(chat.router)
app.include_router(weather.router)
app.include_router(schemes.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "app": "FarmSense AI 🌾",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "disease_scan":   "POST /disease/analyze",
            "chat":           "POST /chat/message",
            "weather":        "GET  /weather/advice?lat=&lon=&crop=",
            "schemes":        "POST /schemes/find",
            "docs":           "/docs",
        },
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
