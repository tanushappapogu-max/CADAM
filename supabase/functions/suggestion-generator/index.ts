import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { userPrompt, generatedCode, parameters } = await req.json();

    if (!userPrompt) {
      return new Response(JSON.stringify({ suggestions: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build parameter summary for context
    const paramSummary = parameters
      ?.map(
        (p: { name: string; value: string | number | boolean }) =>
          `${p.name}=${p.value}`,
      )
      .join(', ');

    const suggestionPrompt = `You are helping a user iterate on a 3D CAD model. 

USER REQUEST: "${userPrompt}"

CURRENT PARAMETERS: ${paramSummary || 'none'}

GENERATED CODE:
\`\`\`openscad
${generatedCode?.slice(0, 1500) || 'No code available'}
\`\`\`

Based on the ACTUAL model above, suggest exactly 2 specific improvements the user could make next.

Your suggestions should:
- Reference actual parameters or features in the code (e.g., if there's cup_height, suggest "Taller cup" not generic "Make bigger")
- Be actionable modifications (2-4 words)
- Be different from each other (one could adjust a dimension, another could add a feature)

DO NOT suggest:
- Generic things like "Add more detail" or "Improve design"
- Exporting, rendering, or color changes
- Things already in the model

Return exactly 2 suggestions:
<suggestion>First suggestion</suggestion>
<suggestion>Second suggestion</suggestion>`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://adam-cad.com',
        'X-Title': 'Adam CAD',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-haiku',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: suggestionPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    let suggestions: string[] = [];

    if (data.choices && data.choices[0]?.message?.content) {
      const responseText = data.choices[0].message.content;
      const suggestionRegex = /<suggestion>(.*?)<\/suggestion>/gi;
      const matches = responseText.matchAll(suggestionRegex);

      suggestions = Array.from(
        new Set(
          Array.from(matches)
            .map(([, text]) => {
              if (!text) return null;
              const cleaned = text
                .trim()
                .replace(/[""'']/g, '')
                .replace(/^["']|["']$/g, '')
                .trim();
              const words = cleaned.split(/\s+/);
              if (words.length > 5) return null;
              return words
                .map(
                  (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                )
                .join(' ');
            })
            .filter((s): s is string => s !== null && s.length > 0),
        ),
      ).slice(0, 2);
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return new Response(JSON.stringify({ suggestions: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
