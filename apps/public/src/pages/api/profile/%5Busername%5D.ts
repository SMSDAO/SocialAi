import type { APIRoute } from 'astro';
import { getProfile } from '../../../../lib/mockData';

export const GET: APIRoute = async ({ params }) => {
  const username = params.username || '';
  const profile = getProfile(username);

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Profile not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(profile), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
