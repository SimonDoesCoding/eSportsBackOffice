'use client';

import { useState } from 'react';
import { getTeamConfig } from '../../utils/teamConfig';

interface SocialPostModalProps {
  fixtureId: string;
  insights: Record<string, unknown> | null;
  onClose: () => void;
}

export function SocialPostModal({ fixtureId, insights, onClose }: SocialPostModalProps) {
  const [platform, setPlatform] = useState<'linkedin' | 'instagram'>('linkedin');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardLoading, setCardLoading] = useState(true);

  const getCardUrl = () => {
    if (!insights) return '';
    const series = insights.series as Record<string, unknown>;
    const team1 = insights.team1 as Record<string, string>;
    const team2 = insights.team2 as Record<string, string>;
    const scoreDist = series.score_distribution as Record<string, number>;
    const topScore = Object.entries(scoreDist).sort((a, b) => b[1] - a[1])[0];

    const maps = insights.maps as Record<string, unknown>[];
    const mapProbs = maps.slice(0, 5).map(m => Math.round((m.team1_win_probability as number) * 100)).join(',');

    const params = new URLSearchParams({
      team1: team1.name,
      team2: team2.name,
      t1prob: (Math.round((series.team1_win_probability as number) * 1000) / 10).toString(),
      t2prob: (Math.round((series.team2_win_probability as number) * 1000) / 10).toString(),
      t1kd: (series.team1_avg_kd as number).toFixed(3),
      t2kd: (series.team2_avg_kd as number).toFixed(3),
      t1logo: getTeamConfig(team1.name).logo,
      t2logo: getTeamConfig(team2.name).logo,
      favourite: series.favourite as string,
      topscore: topScore[0],
      topscoreprob: (Math.round(topScore[1] * 1000) / 10).toString(),
      avgmaps: (series.avg_total_maps as number).toFixed(1),
      maps: mapProbs,
    });
    return `/api/match-card?${params.toString()}`;
  };

  const handleDownloadCard = async () => {
    const url = getCardUrl();
    if (!url) return;
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `match-preview-${fixtureId}.png`;
    a.click();
  };

  const handleGenerate = () => {
    if (!insights) return;
    const series = insights.series as Record<string, unknown>;
    const team1 = insights.team1 as Record<string, string>;
    const team2 = insights.team2 as Record<string, string>;
    const maps = insights.maps as Record<string, unknown>[];
    const headlines = insights.headline_insights as string[];
    const scoreDist = series.score_distribution as Record<string, number>;
    const topScore = Object.entries(scoreDist).sort((a, b) => b[1] - a[1])[0];

    const dataBlock = `Match: ${team1.name} vs ${team2.name}
Favourite: ${series.favourite} (${Math.round(Math.max(series.team1_win_probability as number, series.team2_win_probability as number) * 100)}%)
${team1.name} Win Prob: ${Math.round((series.team1_win_probability as number) * 100)}%
${team2.name} Win Prob: ${Math.round((series.team2_win_probability as number) * 100)}%
Most Likely Score: ${topScore[0]} (${Math.round(topScore[1] * 100)}%)
Avg Maps: ${series.avg_total_maps}
${team1.name} K/D: ${series.team1_avg_kd} | ${team2.name} K/D: ${series.team2_avg_kd}
Sweep Probability: ${Math.round((series.sweep_probability as number) * 100)}%
Goes the Distance: ${Math.round((series.distance_probability as number) * 100)}%
Map Breakdown: ${maps.map((m, i) => `Map ${i+1}: ${Math.round((m.team1_win_probability as number) * 100)}%-${Math.round((m.team2_win_probability as number) * 100)}%`).join(', ')}
Key Insights: ${headlines.join(' | ')}`;

    const platformInstructions = platform === 'linkedin'
      ? `Write a LinkedIn post (150-250 words). Professional but engaging and eye-catching. Lead with a strong hook that stops the scroll. Use emojis strategically (3-5 throughout). Include 2-3 key data points. End with a subtle mention of Sitech eSports. Add 3-5 hashtags (e.g. #CDL #Esports #CallOfDuty #EsportsBetting #SitechEsports).`
      : `Write an Instagram post (80-150 words). Punchy, fun and engaging. Use emojis generously (5-8 throughout). Include 1-2 key stats that create intrigue. Make it exciting and data-backed. Add 10-15 hashtags covering esports, CDL, betting, the teams, and gaming.`;

    const prompt = `You are writing social media content for Sitech eSports, a B2B technology company building simulation-powered pricing infrastructure for the eSports betting industry.

Brand voice: Technical but approachable. Data-driven, confident, solutions-oriented. Write for traders and betting operators, not fans. Never sound like a tipster. Reference "our simulation engine" or "our model" when discussing predictions.

${platformInstructions}

Here is the match data from our simulation engine:

${dataBlock}`;

    setContent(prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixtureId, platform, content }),
      });
      if (res.ok) setSaved(true);
      else alert('Failed to save');
    } catch {
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Generate Social Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Platform selector */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setPlatform('linkedin')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              platform === 'linkedin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            LinkedIn
          </button>
          <button
            onClick={() => setPlatform('instagram')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              platform === 'instagram'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Instagram
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!insights}
          className="w-full mb-4 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all"
        >
          {platform === 'linkedin' ? 'Build LinkedIn Prompt' : 'Build Instagram Prompt'}
        </button>

        {/* Match preview card */}
        {insights && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Match Preview Card</span>
              <button
                onClick={handleDownloadCard}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-all"
              >
                Download Image
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative">
              {cardLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                  <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getCardUrl()} alt="Match preview" className="w-full rounded-lg border border-gray-700" onLoad={() => setCardLoading(false)} />
            </div>
          </div>
        )}

        {/* Content area */}
        {content && (
          <>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full h-40 bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 resize-none border border-gray-700 focus:border-blue-500 focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                {copied ? 'âœ“ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </>
        )}

        {!insights && (
          <p className="text-gray-400 text-center py-4">
            Run a simulation first to generate insights for this fixture.
          </p>
        )}
      </div>
    </div>
  );
}
