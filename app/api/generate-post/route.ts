import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const BRAND_CONTEXT = `You are writing social media content for Sitech eSports, a B2B technology company building simulation-powered pricing infrastructure for the eSports betting industry. 

Brand voice: Technical but approachable. Data-driven, confident, solutions-oriented. We don't take ourselves too seriously.

Rules:
- Write for traders and betting operators, not fans
- Never sound like a tipster or fan account
- Use data and probabilities, not opinions
- Use emojis to add visual interest and break up text
- Use hashtags strategically for discoverability
- Reference "our simulation engine" or "our model" when discussing predictions
- Always position Sitech as the source of the analysis`;

function buildPrompt(platform: string, insights: Record<string, unknown>): string {
  const series = insights.series as Record<string, unknown>;
  const team1 = insights.team1 as Record<string, string>;
  const team2 = insights.team2 as Record<string, string>;
  const maps = insights.maps as Record<string, unknown>[];
  const headlines = insights.headline_insights as string[];

  const dataContext = `
Match: ${team1.name} vs ${team2.name}
Favourite: ${series.favourite} (${Math.round(Math.max(series.team1_win_probability as number, series.team2_win_probability as number) * 100)}%)
Score Distribution: ${JSON.stringify(series.score_distribution)}
Avg Total Maps: ${series.avg_total_maps}
Team 1 K/D: ${series.team1_avg_kd} | Team 2 K/D: ${series.team2_avg_kd}
Sweep Probability: ${Math.round((series.sweep_probability as number) * 100)}%
Distance Probability: ${Math.round((series.distance_probability as number) * 100)}%
Map Insights: ${maps.map((m, i) => `Map ${i+1}: ${Math.round((m.team1_win_probability as number) * 100)}%-${Math.round((m.team2_win_probability as number) * 100)}%`).join(', ')}
Headlines: ${headlines.join(' | ')}`;

  if (platform === 'linkedin') {
    return `${BRAND_CONTEXT}

Write a LinkedIn post about this upcoming match. The post should be 150-250 words, professional but engaging and eye-catching. Lead with a strong hook that stops the scroll. Use emojis strategically to break up text and add visual interest (3-5 throughout the post). Include 2-3 key data points from the simulation. End with a subtle mention of what Sitech eSports does. Add 3-5 relevant hashtags at the end (e.g. #CDL #Esports #CallOfDuty #EsportsBetting #SitechEsports).

${dataContext}`;
  }

  return `${BRAND_CONTEXT}

Write an Instagram post about this upcoming match. Keep it punchy, fun and engaging — 80-150 words. Use emojis generously to make it visually appealing (5-8 throughout). Include 1-2 key stats that create intrigue. Make it feel exciting and data-backed. Add 10-15 relevant hashtags at the end covering esports, CDL, betting, the teams involved, and gaming.

${dataContext}`;
}

export async function POST(request: NextRequest) {
  try {
    const { platform, insights } = await request.json();

    if (!platform || !insights) {
      return NextResponse.json({ error: 'Missing platform or insights' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const prompt = buildPrompt(platform, insights);

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Gemini API error: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ content, platform });
  } catch (error) {
    return NextResponse.json({ error: `Failed to generate post: ${error}` }, { status: 500 });
  }
}
