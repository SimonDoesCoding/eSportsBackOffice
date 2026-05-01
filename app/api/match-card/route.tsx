import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = new URL(request.url).origin;
  const team1Name = searchParams.get('team1') || 'Team 1';
  const team2Name = searchParams.get('team2') || 'Team 2';
  const team1Prob = searchParams.get('t1prob') || '50';
  const team2Prob = searchParams.get('t2prob') || '50';
  const team1Kd = searchParams.get('t1kd') || '1.00';
  const team2Kd = searchParams.get('t2kd') || '1.00';
  const team1Logo = searchParams.get('t1logo') || '';
  const team2Logo = searchParams.get('t2logo') || '';
  const topScore = searchParams.get('topscore') || '3-1';
  const topScoreProb = searchParams.get('topscoreprob') || '25';
  const avgMaps = searchParams.get('avgmaps') || '4.0';
  const favourite = searchParams.get('favourite') || team1Name;
  const mapProbs = (searchParams.get('maps') || '').split(',').map(Number);
  const mapModes = ['HP', 'S&D', 'OVL', 'HP', 'S&D'];

  const t1Pct = parseFloat(team1Prob);
  const t2Pct = parseFloat(team2Prob);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '700px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#3c3c3c',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6ee7b7, #f87171, #6ee7b7)', display: 'flex' }} />

        {/* Header - Sitech branding centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 40px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${origin}/sitech-logo.png`} height="120" alt="" style={{ objectFit: 'contain' }} />
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '8px' }}>Sitech eSports</span>
          </div>
          <span style={{ color: '#6ee7b7', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>Simulation-Powered Match Preview</span>
        </div>

        {/* Main matchup */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '40px', padding: '0 40px' }}>
          {/* Team 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '350px' }}>
            {team1Logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team1Logo} width="100" height="100" alt="" style={{ marginBottom: '16px' }} />
            )}
            <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>{team1Name}</span>
            <span style={{ color: t1Pct >= t2Pct ? '#6ee7b7' : '#f87171', fontSize: '48px', fontWeight: 'bold' }}>{team1Prob}%</span>
            <span style={{ color: '#9ca3af', fontSize: '18px', marginTop: '4px' }}>K/D: {team1Kd}</span>
          </div>

          {/* VS */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#4b5563', fontSize: '48px', fontWeight: 'bold' }}>VS</span>
          </div>

          {/* Team 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '350px' }}>
            {team2Logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team2Logo} width="100" height="100" alt="" style={{ marginBottom: '16px' }} />
            )}
            <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>{team2Name}</span>
            <span style={{ color: t2Pct >= t1Pct ? '#6ee7b7' : '#f87171', fontSize: '48px', fontWeight: 'bold' }}>{team2Prob}%</span>
            <span style={{ color: '#9ca3af', fontSize: '18px', marginTop: '4px' }}>K/D: {team2Kd}</span>
          </div>
        </div>

        {/* Map Win Probability Bars */}
        {mapProbs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 60px 12px' }}>
            <span style={{ color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', marginBottom: '2px' }}>Map Win Probability</span>
            {mapProbs.map((t1p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#9ca3af', fontSize: '12px', width: '36px', textAlign: 'right' }}>{mapModes[i] || `M${i+1}`}</span>
                <div style={{ display: 'flex', flex: 1, height: '16px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#374151' }}>
                  <div style={{ width: `${t1p}%`, backgroundColor: t1p >= 50 ? '#6ee7b7' : '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t1p >= 50 && <span style={{ fontSize: '10px', color: '#1a1a2e', fontWeight: 'bold' }}>{t1p}%</span>}
                  </div>
                  <div style={{ width: `${100 - t1p}%`, backgroundColor: t1p < 50 ? '#f87171' : '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t1p < 50 && <span style={{ fontSize: '10px', color: '#1a1a2e', fontWeight: 'bold' }}>{100 - t1p}%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', padding: '0 40px 32px', borderTop: '1px solid #374151' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Favourite</span>
            <span style={{ color: '#6ee7b7', fontSize: '18px', fontWeight: 'bold' }}>{favourite}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Most Likely Score</span>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{topScore} ({topScoreProb}%)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Maps</span>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{avgMaps}</span>
          </div>
        </div>

        {/* Footer accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6ee7b7, #f87171, #6ee7b7)', display: 'flex' }} />
      </div>
    ),
    { width: 1200, height: 700 }
  );
}
