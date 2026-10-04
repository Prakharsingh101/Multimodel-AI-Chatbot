# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    model: str = "gemini"
    web_search: bool = False
