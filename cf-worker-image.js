/**
 * Cloudflare Worker: LinkedIn Image Generator
 *
 * Accepts: POST { prompt, size, options }
 * Returns: { b64 } or { imageUrl }
 *
 * Deploys to: https://linkedin-image-gen.YOUR_SUBDOMAIN.workers.dev
 */

export default {
  async fetch(request, env, ctx) {
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prompt, size = '512x512', options = {} } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Option 1: Use Cloudflare Workers AI (if available)
      if (env.AI) {
        const imageModel = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
        const params = { prompt, size };
        let response;

        if (typeof env.AI.run === 'function') {
          response = await env.AI.run(imageModel, params);
        } else if (typeof env.AI.generate === 'function') {
          response = await env.AI.generate({
            model: imageModel,
            prompt,
            size,
          });
        } else {
          return new Response(
            JSON.stringify({
              error: 'Cloudflare AI binding method unavailable',
            }),
            {
              status: 501,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }

        if (prompt === '__debug__') {
          let responseTextSample;
          if (response && typeof response.getReader === 'function') {
            try {
              const text = await new Response(response).text();
              responseTextSample = text.slice(0, 1024);
            } catch (err) {
              responseTextSample = `stream read failed: ${err.message}`;
            }
          }

          const meta = {
            envAI: {
              type: typeof env.AI,
              run: typeof env.AI?.run,
              generate: typeof env.AI?.generate,
            },
            responseType: response?.constructor?.name,
            responseKeys:
              response && typeof response === 'object'
                ? Object.keys(response)
                : undefined,
            outputType:
              response && response.output
                ? response.output.constructor?.name
                : undefined,
            outputKeys:
              response && Array.isArray(response.output) && response.output[0]
                ? Object.keys(response.output[0])
                : undefined,
            responseTextSample,
          };
          return new Response(
            JSON.stringify({
              debug: meta,
              response: response?.toString?.() ?? null,
            }),
            {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }

        const logPayload = {
          type: typeof response,
          constructor: response?.constructor?.name,
          keys:
            response && typeof response === 'object'
              ? Object.keys(response)
              : undefined,
        };
        console.log('[Worker] AI response meta', JSON.stringify(logPayload));

        let buffer;
        if (response instanceof Response) {
          if (!response.ok) {
            const errorText = await response.text();
            return new Response(
              JSON.stringify({
                error: 'AI generation failed',
                details: errorText,
              }),
              {
                status: 502,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
              }
            );
          }
          buffer = await response.arrayBuffer();
        } else if (response instanceof ArrayBuffer) {
          buffer = response;
        } else if (response && typeof response.getReader === 'function') {
          buffer = await new Response(response).arrayBuffer();
        } else if (
          response &&
          typeof response === 'object' &&
          typeof response.arrayBuffer === 'function'
        ) {
          buffer = await response.arrayBuffer();
        } else if (
          response &&
          typeof response === 'object' &&
          Array.isArray(response.output)
        ) {
          const output = response.output[0];
          if (output?.type === 'image' && typeof output?.content === 'string') {
            return new Response(JSON.stringify({ b64: output.content }), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
          if (output?.content && typeof output.content === 'string') {
            return new Response(JSON.stringify({ b64: output.content }), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        } else if (
          response &&
          typeof response === 'object' &&
          typeof response.b64 === 'string'
        ) {
          return new Response(JSON.stringify({ b64: response.b64 }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        } else if (
          response &&
          typeof response === 'object' &&
          typeof response.imageUrl === 'string'
        ) {
          return new Response(JSON.stringify({ imageUrl: response.imageUrl }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        if (!buffer) {
          return new Response(
            JSON.stringify({
              error: 'Unexpected AI response format',
              details: logPayload,
            }),
            {
              status: 502,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }

        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        const base64Encoded = btoa(binary);

        return new Response(
          JSON.stringify({ b64: `data:image/png;base64,${base64Encoded}` }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Cloudflare AI binding unavailable' }),
        {
          status: 501,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      // Option 2: Call external API (e.g., Stability AI, OpenAI, HuggingFace)
      // Example using a hypothetical free image API
      // You can swap this for your preferred service with env variables
      const imageApiUrl =
        env.IMAGE_API_URL || 'https://api.example.com/generate';
      const imageApiKey = env.IMAGE_API_KEY || '';

      const externalRes = await fetch(imageApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(imageApiKey ? { Authorization: `Bearer ${imageApiKey}` } : {}),
        },
        body: JSON.stringify({ prompt, size, ...options }),
      });

      if (externalRes.ok) {
        const data = await externalRes.json();
        return new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Option 3: Fallback — return a minimal placeholder (for testing)
      console.warn('[Worker] External API failed, returning placeholder');
      const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0A66C2;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0084B1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#grad)"/>
        <text x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${prompt.slice(0, 40)}...
        </text>
      </svg>`;
      const b64 = btoa(placeholderSvg);
      return new Response(
        JSON.stringify({ b64: `data:image/svg+xml;base64,${b64}` }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (error) {
      console.error('[Worker] Error:', error);
      return new Response(
        JSON.stringify({
          error: 'Image generation failed',
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
