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

    try {
        if (req.method === 'POST') {
            const { user_id, age_range, gender, language } = await req.json();

            // Check if personal info already exists
            const { data: existing } = await supabase
                .from('personal_info')
                .select('id')
                .eq('user_id', user_id);

            if (existing && existing.length > 0) {
                return new Response(JSON.stringify({
                    error: 'Personal information already exists for this user'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            const { data, error } = await supabase
                .from('personal_info')
                .insert([{
                    user_id,
                    age_range,
                    gender,
                    language
                }])
                .select();

            if (error) throw error;

            return new Response(JSON.stringify(data[0]), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        if (req.method === 'GET') {
            const url = new URL(req.url);
            const userId = url.pathname.split('/').pop();

            const { data, error } = await supabase
                .from('personal_info')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            return new Response(JSON.stringify({
                hasCompletedForm: data.length > 0,
                data: data.length > 0 ? data[0] : null
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        return new Response('Method not allowed', { status: 405 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Operation failed' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
} 