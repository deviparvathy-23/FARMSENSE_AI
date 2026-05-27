import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL else None


# ── Scan History ─────────────────────────────────────────
async def save_scan(farmer_id: str, image_url: str, disease: str, confidence: float):
    """Save a disease scan result to Supabase."""
    if not supabase:
        return None
    data = {
        "farmer_id": farmer_id,
        "image_url": image_url,
        "disease_detected": disease,
        "confidence": confidence,
    }
    result = supabase.table("scan_history").insert(data).execute()
    return result.data


async def get_scan_history(farmer_id: str, limit: int = 10):
    """Fetch recent scan history for a farmer."""
    if not supabase:
        return []
    result = (
        supabase.table("scan_history")
        .select("*")
        .eq("farmer_id", farmer_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


# ── Chat Sessions ────────────────────────────────────────
async def save_chat_message(session_id: str, role: str, content: str, language: str):
    if not supabase:
        return None
    data = {
        "session_id": session_id,
        "role": role,
        "content": content,
        "language": language,
    }
    result = supabase.table("chat_sessions").insert(data).execute()
    return result.data


# ── Supabase Table SQL (run once in Supabase dashboard) ──
SETUP_SQL = """
-- Scan history table
CREATE TABLE IF NOT EXISTS scan_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id    TEXT,
  image_url    TEXT,
  disease_detected TEXT,
  confidence   FLOAT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  language   TEXT DEFAULT 'english',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
"""
