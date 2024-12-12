import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

export const config = {
    runtime: 'edge'
};

export default async function handler(req: Request) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { query, n_results = 5, language = 'English' } = await req.json();

        const { data, error } = await supabase
            .from('MEDLINEPLUS')
            .select(`
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
            `)
            .ilike('title', `%${query}%`)
            .eq('language', language)
            .limit(n_results);

        if (error) throw error;

        return new Response(JSON.stringify({
            source: 'supabase',
            results: data
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Search error:', error);
        return new Response(JSON.stringify({ error: 'Search failed' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
} 