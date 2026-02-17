import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { jobTitle, industry, experienceLevel } = await req.json()
        const openAiKey = Deno.env.get('OPENAI_API_KEY')
        if (!openAiKey) {
            throw new Error('Missing OpenAI API Key')
        }

        const prompt = `Generate a professional resume data structure (JSON) for a ${jobTitle} with ${experienceLevel} level experience in the ${industry} industry. 
    Include:
    - professionalSummary (string)
    - skills (array of strings)
    - experience (array of objects with title, company, period, description bullet points)
    - projects (array of objects with name, description)
    Output generic but realistic content.`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openAiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a professional resume writer. Output purely valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: "json_object" }
            }),
        })

        const data = await response.json()
        const generatedContent = JSON.parse(data.choices[0].message.content)

        return new Response(JSON.stringify(generatedContent), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
