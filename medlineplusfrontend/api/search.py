from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from fastapi.responses import JSONResponse

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# More permissive CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.options("/{path:path}")
async def options_route(path: str):
    return JSONResponse(
        content="OK",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "3600",
        },
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

@app.post("/api/search")
async def search(search_query: SearchQuery):
    try:
        logger.info(f"Searching for query: {search_query.query} in language: {search_query.language}")
        
        try:
            # Execute the search query
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

@app.get("/api/test")
async def test():
    try:
        # Test the connection with a simple query
        result = supabase.table("MEDLINEPLUS") \
            .select("topic_id,title") \
            .limit(1) \
            .execute()
        
        return {
            "status": "success",
            "connection": "valid",
            "sample_data": result.data
        }
    except Exception as e:
        logger.error(f"Supabase connection test error: {str(e)}")
        return {
            "status": "error",
            "connection": "invalid",
            "error": str(e)
        }

@app.get("/api/hello")
async def hello():
    return {"message": "Hello World"}