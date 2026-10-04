# Multi-Modal AI Chatbot (MVP)

A beginner-friendly, full-stack AI chatbot project featuring multi-modal inputs, document retrieval (RAG), and web search.

## Tech Stack
* **Frontend:** React + Vite + Vanilla CSS
* **Backend:** Python + FastAPI
* **Database:** PostgreSQL + pgvector
* **AI Provider:** Google Gemini (Configurable)

## Prerequisites
* Node.js (v18+)
* Python (3.10+)
* PostgreSQL (with pgvector extension)

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Set up your `.env` file from the template:
```bash
cp .env.example .env
```

Start the FastAPI server:
```bash
cd app
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.
