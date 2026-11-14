import type { APIRoute } from 'astro';
import { getStats } from '../../lib/mockData';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(getStats()), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
