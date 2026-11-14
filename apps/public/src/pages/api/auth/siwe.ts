import type { APIRoute } from 'astro';
import { claimWithSiwe } from '../../../../lib/mockData';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const address = typeof body?.address === 'string' ? body.address.trim() : '';

    if (!address) {
      return new Response(JSON.stringify({ message: 'Wallet address is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const profile = claimWithSiwe(address);
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
