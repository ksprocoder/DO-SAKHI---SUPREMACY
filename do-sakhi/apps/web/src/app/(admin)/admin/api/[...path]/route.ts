import { NextRequest, NextResponse } from 'next/server';
import { getIsAdminAuthenticated } from '@/lib/admin-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000/api/v1';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(req, path);
}

async function proxyRequest(req: NextRequest, pathArray: string[]) {
  try {
    const isAuthenticated = await getIsAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const adminKey = process.env.ADMIN_API_KEY;
    if (!adminKey) {
      return NextResponse.json({ error: 'Server misconfiguration: missing ADMIN_API_KEY' }, { status: 500 });
    }

    const targetUrl = `${API_BASE}/admin/${pathArray.join('/')}${req.nextUrl.search}`;
    
    // Copy all safe headers
    const headers = new Headers();
    headers.set('x-admin-key', adminKey);
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers.set('content-type', contentType);
    }
    
    // Pass along body for methods that support it
    let body: any = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Check if it's multipart (file upload)
      if (contentType && contentType.includes('multipart/form-data')) {
        body = await req.formData();
      } else {
        const text = await req.text();
        if (text) body = text;
      }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      // Prevents caching for admin endpoints
      cache: 'no-store'
    });

    // Proxy the exact status back
    if (response.headers.get('content-type')?.includes('application/json')) {
      const json = await response.json();
      return NextResponse.json(json, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, { status: response.status, headers: { 'content-type': response.headers.get('content-type') || 'text/plain' } });
    }

  } catch (error: any) {
    console.error('Admin API Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}
