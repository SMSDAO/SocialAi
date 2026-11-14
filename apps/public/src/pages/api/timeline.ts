import type { APIRoute } from 'astro';
import { listTimeline } from '../../../lib/mockData';

export const GET: APIRoute = async ({ url }) => {
  const limitParam = Number(url.searchParams.get('limit') || '50');
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 50;

  return new Response(JSON.stringify(listTimeline(limit)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
