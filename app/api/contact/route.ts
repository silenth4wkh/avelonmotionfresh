import { NextRequest, NextResponse } from 'next/server';
import { sanitizeContactForm } from '@/lib/sanitizer';

// ─── Server-side IP rate limiter (in-process, resets on restart) ──────────────
// For production with multiple instances, replace with Redis-backed solution.
const ipAttempts = new Map<string, number[]>();
const RATE_MAX    = 5;
const RATE_WINDOW = 15 * 60 * 1_000; // 15 minutes

function serverRateLimit(ip: string): boolean {
  const now    = Date.now();
  const recent = (ipAttempts.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_MAX) return false;
  recent.push(now);
  ipAttempts.set(ip, recent);
  return true;
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Prefer Cloudflare header, fall back to standard proxy headers
  const ip =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!serverRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in 15 minutes.' },
      { status: 429 }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // ── Server-side validation (never trust the client) ────────────────────────
  const { name, email, message } = body as Record<string, unknown>;

  const { sanitized, errors, isValid } = sanitizeContactForm({
    name:    typeof name    === 'string' ? name    : '',
    email:   typeof email   === 'string' ? email   : '',
    message: typeof message === 'string' ? message : '',
  });

  if (!isValid) {
    return NextResponse.json(
      { error: 'Validation failed.', fields: errors },
      { status: 422 }
    );
  }

  // ── TODO: Email integration ────────────────────────────────────────────────
  //
  // Install:  npm install resend
  // Env:      RESEND_API_KEY=re_...  CONTACT_EMAIL=you@example.com
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from:    'noreply@avelonmotion.com',
  //   to:      process.env.CONTACT_EMAIL!,
  //   subject: `New message from ${sanitized.name}`,
  //   text:    `Name: ${sanitized.name}\nEmail: ${sanitized.email}\n\n${sanitized.message}`,
  // });
  //
  // ──────────────────────────────────────────────────────────────────────────

  if (process.env.NODE_ENV !== 'production') {
    console.log('[/api/contact]', {
      name:  sanitized.name,
      email: sanitized.email,
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

// ── Block all other HTTP methods ──────────────────────────────────────────────
export async function GET()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function PUT()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
