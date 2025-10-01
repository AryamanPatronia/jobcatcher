from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os, requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).with_name(".env"))
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

app = FastAPI(title="JobCatcher API")

# allow local Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/env-check")
def env_check():
    import os
    return {
        "has_app_id": bool(os.getenv("ADZUNA_APP_ID")),
        "has_app_key": bool(os.getenv("ADZUNA_APP_KEY")),
    }

def iso_to_dt(s: str) -> datetime:
    # Adzuna "created" is ISO8601; normalize to aware UTC dt
    return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc)

@app.get("/search")
def search(
    q: str = Query(..., description="keywords"),
    location: str = Query("", description="city or region"),
    limit: int = 50
):
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        return {"results": [], "has_hidden_fresh": False, "error": "Missing Adzuna keys"}

    url = "https://api.adzuna.com/v1/api/jobs/gb/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": min(limit, 50),
        "what": q,
        "where": location,
        "content-type": "application/json",
        "sort_by": "date"
    }
    r = requests.get(url, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()

    now = datetime.now(timezone.utc)
    results = []
    has_hidden_fresh = False

    for item in data.get("results", []):
        created = item.get("created")
        if not created: 
            continue
        posted_at = iso_to_dt(created)
        age_hours = int((now - posted_at).total_seconds() // 3600)
        results.append({
            "source": "adzuna",
            "source_job_id": item.get("id"),
            "title": item.get("title"),
            "company": (item.get("company") or {}).get("display_name"),
            "location": (item.get("location") or {}).get("display_name"),
            "posted_at": posted_at.isoformat(),
            "age_hours": age_hours,
            "url": item.get("redirect_url"),
        })
        if age_hours < 24:
            has_hidden_fresh = True

    # Enforce your product window (last 7 days)
    results = [j for j in results if j["age_hours"] <= 24 * 7]

    return {"results": results, "has_hidden_fresh": has_hidden_fresh}
