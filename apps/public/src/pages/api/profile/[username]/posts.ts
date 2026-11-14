import type { APIRoute } from 'astro';
import { getProfilePosts } from '../../../../lib/mockData';

export const GET: APIRoute = async ({ params, url }) => {
  const username = params.username || '';
  const limitParam = Number(url.searchParams.get('limit') || '20');
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 20;

  return new Response(JSON.stringify(getProfilePosts(username, limit)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
