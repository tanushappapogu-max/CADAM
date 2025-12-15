// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Anthropic } from 'npm:@anthropic-ai/sdk';
import { corsHeaders } from '../_shared/cors.ts';
import 'jsr:@std/dotenv/load';
import { getAnonSupabaseClient } from '../_shared/supabaseClient.ts';

const PARAMETRIC_SYSTEM_PROMPT = `You are a helpful assistant that generates prompts for 3D printable parametric objects. Your prompts should:
1. Focus on practical household items, tools, and organizers
2. Include specific dimensions (in mm) for key features
3. Mention customizable/parametric aspects (e.g. "adjustable width", "configurable holes")
4. Describe geometry that is 3D printable (flat bases, reasonable overhangs)
5. Return ONLY the prompt text without any introductory phrases or quotes
6. Vary your sentence structure. Do NOT start every prompt with "a parametric..."

Here are some examples:

User: "Generate a parametric modeling prompt."
Assistant: "a hex-grid drawer organizer 150x50mm with adjustable wall thickness"
User: "Generate a parametric modeling prompt."
Assistant: "a customizable phone stand with adjustable viewing angle and charging cable slot"
User: "Generate a parametric modeling prompt."
Assistant: "rug spike with 4 mounting holes for 3mm screws"
User: "Generate a parametric modeling prompt."
Assistant: "a wall-mounted tool holder with 5 variable-diameter slots"
User: "Generate a parametric modeling prompt."
Assistant: "stackable storage box 100mm cube with slide-on lid"
User: "Generate a parametric modeling prompt."
Assistant: "cable clip for 5-10mm cables with screw mounting"
`;

// Main server function handling incoming requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Ensure only POST requests are accepted
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabaseClient = getAnonSupabaseClient({
    global: {
      headers: { Authorization: req.headers.get('Authorization') ?? '' },
    },
  });

  const { data: userData, error: userError } =
    await supabaseClient.auth.getUser();

  if (!userData.user) {
    return new Response(
      JSON.stringify({ error: { message: 'Unauthorized' } }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  if (userError) {
    return new Response(
      JSON.stringify({ error: { message: userError.message } }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  // Parse request body to get existing text if provided
  const { existingText }: { existingText?: string } = await req
    .json()
    .catch(() => ({}));

  // Initialize Anthropic client for AI interactions
  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
  });

  try {
    let systemPrompt: string;
    let userPrompt: string;

    if (existingText && existingText.length > 0) {
      // Augment existing text for parametric mode
      systemPrompt = `You are a technical writing assistant specialized in enhancing prompts for 3D printable parametric models. When given an existing prompt, you should:

1. Add specific dimensions (in mm) where practical and missing
2. Identify parametric variables (e.g., "customizable height", "variable screw size")
3. Ensure the design is 3D printable (flat bottom, stable geometry)
4. Focus on practical utility and clean geometry
5. Maintain the original intent while making it more specific
6. Keep it concise
7. Return ONLY the enhanced prompt text without any introductory phrases, explanations, or quotes

The enhanced prompt should be ready for a parametric CAD generator.`;

      userPrompt = `Please enhance this prompt to be a specific, dimensioned, and parametric 3D printable object:

${JSON.stringify(existingText)}

Return only the enhanced prompt text.`;
    } else {
      // Generate new prompt for parametric mode
      systemPrompt = PARAMETRIC_SYSTEM_PROMPT;
      userPrompt = 'Generate a parametric modeling prompt.';
    }

    // Configure Claude API call
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract prompt from response
    let prompt = '';
    if (Array.isArray(response.content) && response.content.length > 0) {
      const lastContent = response.content[response.content.length - 1];
      if (lastContent.type === 'text') {
        prompt = lastContent.text.trim();
      }
    }

    return new Response(JSON.stringify({ prompt }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Claude:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
