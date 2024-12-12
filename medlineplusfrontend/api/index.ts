import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://localhost:5173',
        'https://plainmed.vercel.app',
        'https://plainmed-*.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    exposedHeaders: ['*'],
    maxAge: 3600
}));

app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

export default {
    async fetch(request: Request) {
        // Convert incoming request to Express request
        const url = new URL(request.url);
        const expressReq = {
            method: request.method,
            url: url.pathname + url.search,
            headers: Object.fromEntries(request.headers),
            body: request.body ? await request.json() : undefined
        };

        return new Promise((resolve) => {
            app.handle(expressReq, {
                status: (code) => ({ statusCode: code }),
                json: (data) => resolve(new Response(JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' }
                }))
            });
        });
    }
}; 