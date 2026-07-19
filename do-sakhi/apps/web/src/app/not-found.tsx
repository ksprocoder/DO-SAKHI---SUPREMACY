import Link from 'next/link';
import { Cormorant_Garamond, Inter } from 'next/font/google';

/**
 * Global 404 Not Found page — Do Sakhi premium editorial style.
 * Shown for any invalid route across the entire application.
 * Never shows a raw stack trace or Next.js default error screen.
 */

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function NotFound() {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body
        style={{
          margin: 0,
          background: '#FAF6F0',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
        }}
      >
        <main
          style={{
            textAlign: 'center',
            padding: '40px 24px',
            maxWidth: '560px',
          }}
          role="main"
          aria-label="Page not found"
        >
          {/* Copper ornamental vertical line */}
          <div
            style={{
              width: '1px',
              height: '64px',
              background:
                'linear-gradient(180deg, transparent, rgba(167,111,77,0.5), transparent)',
              margin: '0 auto 36px',
            }}
            aria-hidden="true"
          />

          {/* Eyebrow label */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#A76F4D',
              marginBottom: '20px',
            }}
          >
            404
          </p>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 300,
              color: '#073F34',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            This page is not part of the current edit.
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: '#6E675F',
              lineHeight: 1.75,
              maxWidth: '380px',
              margin: '0 auto 36px',
            }}
          >
            The page you are looking for may have moved, or was never here.
            Return to the boutique and continue exploring.
          </p>

          {/* Copper rule */}
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(167,111,77,0.4)',
              margin: '0 auto 36px',
            }}
            aria-hidden="true"
          />

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              id="not-found-home-link"
              style={{
                display: 'inline-block',
                backgroundColor: '#073F34',
                color: '#F8F3EA',
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                textDecoration: 'none',
              }}
            >
              Return Home
            </Link>
            <Link
              href="/shop"
              id="not-found-shop-link"
              style={{
                display: 'inline-block',
                border: '1.5px solid #073F34',
                color: '#073F34',
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '13px 32px',
                textDecoration: 'none',
              }}
            >
              Explore the Edit
            </Link>
          </div>

          {/* Bottom ornament */}
          <div
            style={{
              width: '1px',
              height: '48px',
              background:
                'linear-gradient(180deg, rgba(167,111,77,0.3), transparent)',
              margin: '48px auto 0',
            }}
            aria-hidden="true"
          />
        </main>
      </body>
    </html>
  );
}
