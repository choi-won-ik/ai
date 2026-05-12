from openai import OpenAI
import traceback
from fastapi import APIRouter

router = APIRouter()

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

@router.get("/q")
def chat(q: str):
    try:
        response = client.chat.completions.create(
            model="gemma4:e2b",
            messages=[
                {"role": "user", "content": q}
            ]
        )

        return {
            "response": response.choices[0].message.content
        }

    except Exception as e:
        traceback.print_exc()
        return {
            "error": str(e)
        }