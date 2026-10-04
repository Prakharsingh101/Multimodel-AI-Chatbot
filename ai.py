import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import HTTPException
from app.schemas.chat import ChatMessage
from typing import List

from google import genai
from google.genai import types


def get_gemini_response(
    message: str,
    history: List[ChatMessage],
    model_name: str = "gemini",
    web_search: bool = False
) -> str:

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or api_key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=500,
            detail="Gemini API Key is missing or invalid. Please configure it in the .env file."
        )

    try:
        # Select model
        if model_name == "gemini":
            selected_model = "gemini-3.8-flash"
        elif model_name == "gemini_pro":
            selected_model = "gemini-3.7-flash"
        else:
            selected_model = "gemini-3.8-flash"

        # Create Gemini client
        client = genai.Client(api_key=api_key)

        # Prepare conversation history
        conversation = []

        for msg in history:
            role = "user" if msg.role == "user" else "model"

            conversation.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=msg.content)]
                )
            )

        # Add current user message
        conversation.append(
            types.Content(
                role="user",
                parts=[types.Part(text=message)]
            )
        )

        # Enable Google Search when requested
        tools = None

        if web_search:
            tools = [
                types.Tool(
                    google_search=types.GoogleSearch()
                )
            ]

        # Generate response
        response = client.models.generate_content(
            model=selected_model,
            contents=conversation,
            config=types.GenerateContentConfig(
                tools=tools
            ) if tools else None
        )

        return response.text

    except Exception as e:
        print(f"Error communicating with Gemini API: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response. Please try again."
        )