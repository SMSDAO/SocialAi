import type { APIRoute } from 'astro';
import { claimWithFarcaster } from '../../../../lib/mockData';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const username = typeof body?.username === 'string' ? body.username.trim() : '';

    if (!username) {
      return new Response(JSON.stringify({ message: 'Farcaster username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const profile = claimWithFarcaster(username);
    return new Response(
      JSON.stringify({
        success: true,
        profile,
        profileUrl: `/profile/${profile.username}`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid request payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
