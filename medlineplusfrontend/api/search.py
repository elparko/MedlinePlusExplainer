from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://plainmed.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

class SearchQuery(BaseModel):
    query: str
    n_results: int = 5
    language: str = "English"

@app.post("/search")
async def search(search_query: SearchQuery):
    logger.info(f"Search endpoint called with query: {search_query}")
    try:
        logger.info(f"Searching for query: {search_query.query} in language: {search_query.language}")
        
        try:
            results = supabase.table("MEDLINEPLUS") \
                .select("""
                    topic_id,
                    title,
                    language,
                    url,
                    meta_desc,
                    full_summary,
                    aliases,
                    mesh_headings,
                    groups,
                    primary_institute,
                    date_created
                """) \
                .ilike("title", f"%{search_query.query}%") \
                .eq("language", search_query.language) \
                .limit(search_query.n_results) \
                .execute()
            
            logger.info(f"Search results count: {len(results.data)}")
            
            return {
                "status": "success",
                "source": "supabase",
                "query": search_query.query,
                "language": search_query.language,
                "results": results.data
            }
            
        except Exception as supabase_error:
            logger.error(f"Supabase search error: {str(supabase_error)}")
            raise HTTPException(status_code=500, detail=str(supabase_error))

    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/hello")
async def hello():
    logger.info("Hello endpoint called")
    return {"message": "Hello World", "timestamp": str(datetime.now())}

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {
        "status": "online",
        "time": str(datetime.now()),
        "endpoints": ["/hello", "/search"]
    }

# Add OPTIONS handler for CORS preflight requests
@app.options("/{path:path}")
async def options_handler(path: str):
    return {"status": "ok"}