# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router

app = FastAPI(
    title="Multi-Modal AI Chatbot API",
    description="Backend API for the Multi-Modal AI Chatbot MVP",
    version="1.0.0",
)

# Configure CORS for local development with React/Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router,prefix="/api")

@app.get("/api/health")
async def health_check():
    """Health check endpoint used by the frontend to verify connectivity."""
    return {"status": "ok", "message": "Backend is running successfully!"}

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
