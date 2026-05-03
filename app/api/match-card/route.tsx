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
  const team1Logo = searchParams.get('t1logo') || '';
  const team2Logo = searchParams.get('t2logo') || '';
  const topScore = searchParams.get('topscore') || '3-1';
  const topScoreProb = searchParams.get('topscoreprob') || '25';
  const favourite = searchParams.get('favourite') || team1Name;
  const distance = searchParams.get('distance') || '35';
  const t1color = searchParams.get('t1color') || '#6ee7b7';
  const t2color = searchParams.get('t2color') || '#f87171';

  const t1Pct = parseFloat(team1Prob);
  const t2Pct = parseFloat(team2Prob);
  const favProb = Math.max(t1Pct, t2Pct);

  return new ImageResponse(
    (
      <div style={{ width: '1080px', height: '1080px', display: 'flex', flexDirection: 'column', backgroundColor: '#3c3c3c', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #6ee7b7, #E8655A, #6ee7b7)', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 40px 0' }}>
          <span style={{ color: 'white', fontSize: '52px', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', letterSpacing: '4px' }}>{team1Name}</span>
          <span style={{ color: '#E8655A', fontSize: '28px', fontWeight: 900, margin: '6px 0', letterSpacing: '6px' }}>VS</span>
          <span style={{ color: 'white', fontSize: '52px', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', letterSpacing: '4px' }}>{team2Name}</span>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '20px 60px' }}>
          <div style={{ width: '320px', height: '320px', backgroundColor: t1color, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {team1Logo ? <img src={team1Logo} width="220" height="220" alt="" /> : <span style={{ fontSize: '120px', fontWeight: 'bold', color: 'white' }}>{team1Name.charAt(0)}</span>}
          </div>

          <div style={{ width: '70px', height: '70px', backgroundColor: '#3c3c3c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #555' }}>
            <span style={{ color: 'white', fontSize: '22px', fontWeight: 900, letterSpacing: '2px' }}>VS</span>
          </div>

          <div style={{ width: '320px', height: '320px', backgroundColor: t2color, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {team2Logo ? <img src={team2Logo} width="220" height="220" alt="" /> : <span style={{ fontSize: '120px', fontWeight: 'bold', color: 'white' }}>{team2Name.charAt(0)}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 50px 24px' }}>
          <div style={{ flex: 1, backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', color: '#9ca3af', letterSpacing: '1px' }}>🔥 MOST LIKELY</span>
            <span style={{ fontSize: '40px', fontWeight: 900, color: 'white', margin: '4px 0' }}>{topScore}</span>
            <span style={{ fontSize: '18px', color: '#9ca3af' }}>({topScoreProb}%)</span>
          </div>
          <div style={{ flex: 1, backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', color: '#9ca3af', letterSpacing: '1px' }}>{favourite}</span>
            <span style={{ fontSize: '40px', fontWeight: 900, color: '#6ee7b7', margin: '4px 0' }}>{favProb}%</span>
            <span style={{ fontSize: '18px', color: '#9ca3af' }}>FAVOURITE</span>
          </div>
          <div style={{ flex: 1, backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', color: '#9ca3af', letterSpacing: '1px' }}>🎯 GAME 5</span>
            <span style={{ fontSize: '40px', fontWeight: 900, color: 'white', margin: '4px 0' }}>{distance}%</span>
            <span style={{ fontSize: '18px', color: '#9ca3af' }}>CHANCE</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0 0 24px' }}>
          <img src={`${origin}/sitech-logo.png`} height="60" alt="" style={{ objectFit: 'contain' }} />
          <span style={{ color: '#7a7a7a', fontSize: '20px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>Sitech eSports</span>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #6ee7b7, #E8655A, #6ee7b7)', display: 'flex' }} />
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
