from fastapi import FastAPI
from api.search import router as search_router
from api.pdf import router as pdf_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(search_router)
app.include_router(pdf_router)