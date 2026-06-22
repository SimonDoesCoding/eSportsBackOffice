import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
/* eslint-disable @next/next/no-img-element */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const team1Name = searchParams.get('team1') || 'Team 1';
  const team2Name = searchParams.get('team2') || 'Team 2';
  const scores = searchParams.get('scores') || '';
  const insights = searchParams.get('insights') || '';
  const sweep = searchParams.get('sweep') || '0';
  const distance = searchParams.get('distance') || '0';
  const team1Logo = searchParams.get('t1logo') || '';
  const team2Logo = searchParams.get('t2logo') || '';

  const scoreEntries = scores.split('|').filter(Boolean).slice(0, 6);
  const insightList = insights.split('|').filter(Boolean).slice(0, 4);

  return new ImageResponse(
    (
      <div style={{ width: '1080px', height: '1080px', display: 'flex', flexDirection: 'column', backgroundColor: '#3c3c3c', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #6ee7b7, #E8655A, #6ee7b7)', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 40px 20px' }}>
          <span style={{ color: 'white', fontSize: '36px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px' }}>Key Insights</span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginTop: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {team1Logo && <img src={team1Logo} width="100" height="100" alt="" style={{ objectFit: 'contain' }} />}
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 900, marginTop: '8px' }}>{team1Name}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {team2Logo && <img src={team2Logo} width="100" height="100" alt="" style={{ objectFit: 'contain' }} />}
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 900, marginTop: '8px' }}>{team2Name}</span>
            </div>



          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 80px', flex: 1 }}>
          {insightList.map((insight, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '20px 24px' }}>
              <span style={{ color: '#6ee7b7', fontSize: '24px', flexShrink: 0 }}>💡</span>
              <span style={{ color: 'white', fontSize: '20px', lineHeight: '1.4' }}>{insight}</span>
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '18px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Score Distribution</span>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {scoreEntries.map((entry, i) => {
                const [score, prob] = entry.split(':');
                return (
                  <div key={i} style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                    <span style={{ color: 'white', fontSize: '28px', fontWeight: 900 }}>{score}</span>
                    <span style={{ color: '#9ca3af', fontSize: '16px', marginTop: '4px' }}>{prob}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', letterSpacing: '1px' }}>SWEEP CHANCE</span>
              <span style={{ color: 'white', fontSize: '32px', fontWeight: 900 }}>{sweep}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', letterSpacing: '1px' }}>GOES THE DISTANCE</span>
              <span style={{ color: 'white', fontSize: '32px', fontWeight: 900 }}>{distance}%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px 0 24px' }}>
          <img src={`${origin}/sitech-logo.png`} height="100" alt="" style={{ objectFit: 'contain' }} />
          <span style={{ color: '#7a7a7a', fontSize: '18px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>Sitech eSports</span>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #6ee7b7, #E8655A, #6ee7b7)', display: 'flex' }} />
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
