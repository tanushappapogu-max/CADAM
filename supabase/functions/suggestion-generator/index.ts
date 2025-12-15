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
    const { userPrompt, generatedCode } = await req.json();

    if (!userPrompt) {
      return new Response(JSON.stringify({ suggestions: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const suggestionPrompt = `You are helping a user iterate on a 3D CAD model. 

USER REQUEST: "${userPrompt}"

GENERATED CODE:
\`\`\`openscad
${generatedCode?.slice(0, 1500) || 'No code available'}
\`\`\`

Suggest exactly 2 NEW FEATURES to add to this model. Focus on structural additions, not parameter tweaks.

Good suggestions ADD something new:
- "Add handle" - adds a new part
- "Add mounting holes" - adds functional feature
- "Add lid" - adds new component
- "Hollow it out" - structural change
- "Add feet" - adds new elements
- "Round the edges" - adds fillets/chamfers

DO NOT suggest:
- Parameter adjustments (taller, wider, thicker, bigger, smaller)
- Generic improvements ("Add detail", "Improve design")
- Exporting, rendering, or colors
- Things already visible in the code

Return exactly 2 suggestions (2-4 words each):
<suggestion>First new feature</suggestion>
<suggestion>Second new feature</suggestion>`;

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
