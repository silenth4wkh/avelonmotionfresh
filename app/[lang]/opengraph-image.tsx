import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Avelon Motion – AI Video Production Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isHu = lang === 'hu';

  const subtitle = isHu ? 'AI VIDEÓGYÁRTÓ STÚDIÓ' : 'AI VIDEO PRODUCTION STUDIO';
  const location = 'BUDAPEST · GLOBAL · EST. 2024';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '64px 80px',
          position: 'relative',
        }}
      >
        {/* Orange top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#ff7300',
          }}
        />

        {/* Top row: AM logo + subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span
            style={{
              color: '#ff7300',
              fontSize: '36px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            AM
          </span>
          <div
            style={{
              width: '1px',
              height: '28px',
              background: 'rgba(255,255,255,0.2)',
            }}
          />
          <span
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '13px',
              letterSpacing: '0.3em',
            }}
          >
            {subtitle}
          </span>
        </div>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <span
            style={{
              color: '#ffffff',
              fontSize: '128px',
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
            }}
          >
            AVELON
          </span>
          <span
            style={{
              color: '#ff7300',
              fontSize: '128px',
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
            }}
          >
            MOTION
          </span>
        </div>

        {/* Bottom: location */}
        <span
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '14px',
            letterSpacing: '0.25em',
          }}
        >
          {location}
        </span>

        {/* Orange bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: '#ff7300',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
