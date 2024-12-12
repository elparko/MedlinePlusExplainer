from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/search")
async def search(query: str, n_results: int = 5, language: str = "English"):
    return {
        "status": "success",
        "query": query,
        "n_results": n_results,
        "language": language,
        "results": ["test result"]
    }

@app.get("/api/test")
async def test():
    return {"status": "API is working"}