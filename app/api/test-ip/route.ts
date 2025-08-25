import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const headers = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'x-client-ip': request.headers.get('x-client-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'), // If using Cloudflare
  };

  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   request.headers.get('x-real-ip') || 
                   request.headers.get('x-client-ip') ||
                   'unknown';

  return Response.json({
    clientIP,
    allHeaders: headers,
    requestIP: request.ip,
    // Show all request headers for debugging
    allRequestHeaders: Object.fromEntries(request.headers.entries())
  });
}