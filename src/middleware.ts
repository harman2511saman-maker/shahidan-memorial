import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ئەمانە گۆڕدراوەکانن بۆ ڕێگریکردن (Rate Limiting)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 20; // زۆرترین ژمارەی ڕیکوێست
const WINDOW_MS = 60 * 1000; // کات بە میللی چرکە (١ خولەک)

export function middleware(request: NextRequest) {
  // با ڕێگرییەکە بۆ فایلە سەرەکییەکان (وەک وێنە و ستایلەکان) نەبێت
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // وەرگرتنی ئایپی بەکارهێنەر
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown-ip';
  const now = Date.now();
  const windowData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  // ئەگەر کاتەکە تێپەڕیبوو (١ خولەک)، ژمێرەرەکە سفر بکەرەوە
  if (now - windowData.lastReset > WINDOW_MS) {
    windowData.count = 0;
    windowData.lastReset = now;
  }

  windowData.count++;
  rateLimitMap.set(ip, windowData);

  // ئەگەر لە سنوورەکە تێپەڕی کردبوو (زۆرتر لە ٢٠ ڕیکوێست لە خولەکێکدا)
  if (windowData.count > LIMIT) {
    return new NextResponse('Too Many Requests - سێرڤەرەکە بلۆکی کردیت لەبەر پاراستنی ئاسایش', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((WINDOW_MS - (now - windowData.lastReset)) / 1000).toString(),
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const response = NextResponse.next();
  
  // لێرەش دەتوانیت هێدەرە سکوێرتییەکان جێگیر بکەیت بۆ دڵنیایی زیاتر
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
