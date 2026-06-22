import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
/* eslint-disable @next/next/no-img-element */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const team1Name = searchParams.get('team1') || 'Team 1';
  const team2Name = searchParams.get('team2') || 'Team 2';
  const team1Prob = searchParams.get('t1prob') || '50';
  const team2Prob = searchParams.get('t2prob') || '50';
  const t1kd = searchParams.get('t1kd') || '1.000';
  const t2kd = searchParams.get('t2kd') || '1.000';
  const team1Logo = searchParams.get('t1logo') || '';
  const team2Logo = searchParams.get('t2logo') || '';
  const mapProbs = (searchParams.get('maps') || '').split(',').map(Number);
  const mapModes = ['HP', 'S&D', 'OVL', 'HP', 'S&D'];

  const t1Pct = parseFloat(team1Prob);
  const t2Pct = parseFloat(team2Prob);

  return new ImageResponse(
    (
      <div style={{ width: '1080px', height: '1080px', display: 'flex', flexDirection: 'column', backgroundColor: '#3c3c3c', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #6ee7b7, #E8655A, #6ee7b7)', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 40px 20px' }}>
          <span style={{ color: 'white', fontSize: '36px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px' }}>Map Breakdown</span>
          <span style={{ color: '#9ca3af', fontSize: '20px', marginTop: '8px' }}>{team1Name} vs {team2Name}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', padding: '10px 60px 30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {team1Logo && <img src={team1Logo} width="200" height="200" alt="" style={{ objectFit: 'contain' }} />}
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 900 }}>{team1Name}</span>
            <span style={{ color: t1Pct >= t2Pct ? '#6ee7b7' : '#f87171', fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>K/D: {t1kd}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {team2Logo && <img src={team2Logo} width="200" height="200" alt="" style={{ objectFit: 'contain' }} />}
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 900 }}>{team2Name}</span>
            <span style={{ color: t2Pct >= t1Pct ? '#6ee7b7' : '#f87171', fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>K/D: {t2kd}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 80px', flex: 1, justifyContent: 'center' }}>
          {mapProbs.map((t1p, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af', fontSize: '16px', fontWeight: 700 }}>MAP {i + 1} - {mapModes[i] || 'HP'}</span>
                <span style={{ color: '#9ca3af', fontSize: '16px' }}>{t1p}% - {100 - t1p}%</span>
              </div>
              <div style={{ display: 'flex', height: '36px', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${t1p}%`, backgroundColor: t1Pct >= t2Pct ? '#6ee7b7' : '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 900 }}>{t1p}%</span>
                </div>
                <div style={{ width: `${100 - t1p}%`, backgroundColor: t2Pct >= t1Pct ? '#6ee7b7' : '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 900 }}>{100 - t1p}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '30px 0 24px' }}>
          <img src={`${origin}/sitech-logo.png`} height="100" alt="" style={{ objectFit: 'contain' }} />
          <span style={{ color: '#7a7a7a', fontSize: '18px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>Sitech eSports</span>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #6ee7b7, #E8655A, #6ee7b7)', display: 'flex' }} />
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
