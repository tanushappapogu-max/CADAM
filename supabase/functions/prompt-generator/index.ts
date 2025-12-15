// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Anthropic } from 'npm:@anthropic-ai/sdk';
import { corsHeaders } from '../_shared/cors.ts';
import 'jsr:@std/dotenv/load';
import { getAnonSupabaseClient } from '../_shared/supabaseClient.ts';

const PARAMETRIC_SYSTEM_PROMPT = `You are a helpful assistant that generates prompts for dimensional household objects and functional parts. Your prompts should be:
1. Focus on practical household items and functional parts
2. Include specific dimensions when relevant
3. Be concise and practical
4. Think containers, holders, brackets, everyday objects
5. Return ONLY the prompt text without any introductory phrases or quotes

Here are some examples:

User: "Generate a parametric modeling prompt."
Assistant: "a plant pot with 4 drainage holes and a 30mm diameter"
User: "Generate a parametric modeling prompt."
Assistant: "a phone stand with 15 degree angle and cable slot"
User: "Generate a parametric modeling prompt."
Assistant: "a pen holder cup 80mm diameter with pencil slots"
User: "Generate a parametric modeling prompt."
Assistant: "a wall bracket 120mm wide with two 6mm screw holes"
User: "Generate a parametric modeling prompt."
Assistant: "a drawer organizer tray 200x100mm with compartments"
User: "Generate a parametric modeling prompt."
Assistant: "a cable management clip for 8mm cables"
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
      systemPrompt = `You are a technical writing assistant specialized in enhancing prompts for dimensional household objects and functional parts. When given an existing prompt, you should:

1. Add specific dimensions (in mm) where practical and missing
2. Include functional details like holes, slots, angles, or compartments
3. Focus on practical household use cases and functionality
4. Make it more precise for creating useful everyday objects
5. Maintain the original intent and core concept
6. Keep it concise and practical
7. Return ONLY the enhanced prompt text without any introductory phrases, explanations, or quotes

The enhanced prompt should be more functional and dimensional while staying true to the user's vision.`;

      userPrompt = `Please enhance and expand this household object prompt to make it more functional, dimensional, and practical for everyday use:

${JSON.stringify(existingText)}

Return only the enhanced prompt text, no introductory phrases.`;
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
