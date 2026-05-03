'use client';

import { useState } from 'react';
import { getTeamConfig } from '../../utils/teamConfig';

interface SocialPostModalProps {
  fixtureId: string;
  insights: unknown;
  onClose: () => void;
}

export function SocialPostModal({ fixtureId, insights, onClose }: SocialPostModalProps) {
  const [platform, setPlatform] = useState<'linkedin' | 'instagram'>('linkedin');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadedCards, setLoadedCards] = useState<Set<string>>(new Set());
  const [cardIndex, setCardIndex] = useState(0);

  const getCardData = () => {
    if (!insights) return null;
    const data = insights as Record<string, unknown>;
    const series = data.series as Record<string, unknown>;
    const team1 = data.team1 as Record<string, string>;
    const team2 = data.team2 as Record<string, string>;
    const scoreDist = series.score_distribution as Record<string, number>;
    const topScore = Object.entries(scoreDist).sort((a, b) => b[1] - a[1])[0];
    const maps = data.maps as Record<string, unknown>[];
    const headlines = data.headline_insights as string[];
    const mapProbs = maps.slice(0, 5).map(m => Math.round((m.team1_win_probability as number) * 100)).join(",");
    const scoreStr = Object.entries(scoreDist).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([s, p]) => s + ":" + Math.round(p * 100)).join("|");
    const base: Record<string, string> = {
      team1: team1.name, team2: team2.name,
      t1prob: (Math.round((series.team1_win_probability as number) * 1000) / 10).toString(),
      t2prob: (Math.round((series.team2_win_probability as number) * 1000) / 10).toString(),
      t1kd: (series.team1_avg_kd as number).toFixed(3),
      t2kd: (series.team2_avg_kd as number).toFixed(3),
      t1color: getTeamConfig(team1.name).color,
      t2color: getTeamConfig(team2.name).color,
      favourite: series.favourite as string,
      distance: (Math.round((series.distance_probability as number) * 100)).toString(),
      sweep: (Math.round((series.sweep_probability as number) * 100)).toString(),
    };
    const t1logo = getTeamConfig(team1.name).logo;
    const t2logo = getTeamConfig(team2.name).logo;
    return {
      hero: "/api/match-card?" + new URLSearchParams({ ...base, t1logo, t2logo, topscore: topScore[0], topscoreprob: (Math.round(topScore[1] * 1000) / 10).toString(), avgmaps: (series.avg_total_maps as number).toFixed(1) }).toString(),
      maps: "/api/map-card?" + new URLSearchParams({ ...base, maps: mapProbs, t1logo, t2logo }).toString(),
      insights: "/api/insights-card?" + new URLSearchParams({ ...base, scores: scoreStr, insights: headlines.slice(0, 4).join("|"), t1logo, t2logo }).toString(),
    };
  };

  const handleDownloadCard = async (url: string, name: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "-" + fixtureId + ".png";
    a.click();
  };

  const handleDownloadAll = async () => {
    const data = getCardData();
    if (!data) return;
    for (const [key, url] of Object.entries(data)) {
      await handleDownloadCard(url, key);
      await new Promise(r => setTimeout(r, 500));
    }
  };

  const handleGenerate = () => {
    if (!insights) return;
    const data2 = insights as Record<string, unknown>;
    const series = data2.series as Record<string, unknown>;
    const team1 = data2.team1 as Record<string, string>;
    const team2 = data2.team2 as Record<string, string>;
    const maps = data2.maps as Record<string, unknown>[];
    const headlines = data2.headline_insights as string[];
    const scoreDist = series.score_distribution as Record<string, number>;
    const topScore = Object.entries(scoreDist).sort((a, b) => b[1] - a[1])[0];

    const mapBreakdown = maps.map((m, i) => "Map " + (i+1) + ": " + Math.round((m.team1_win_probability as number) * 100) + "%-" + Math.round((m.team2_win_probability as number) * 100) + "%").join(", ");

    const dataBlock = [
      "Match: " + team1.name + " vs " + team2.name,
      "Favourite: " + series.favourite + " (" + Math.round(Math.max(series.team1_win_probability as number, series.team2_win_probability as number) * 100) + "%)",
      team1.name + " Win Prob: " + Math.round((series.team1_win_probability as number) * 100) + "%",
      team2.name + " Win Prob: " + Math.round((series.team2_win_probability as number) * 100) + "%",
      "Most Likely Score: " + topScore[0] + " (" + Math.round(topScore[1] * 100) + "%)",
      "Avg Maps: " + series.avg_total_maps,
      team1.name + " K/D: " + series.team1_avg_kd + " | " + team2.name + " K/D: " + series.team2_avg_kd,
      "Sweep Probability: " + Math.round((series.sweep_probability as number) * 100) + "%",
      "Goes the Distance: " + Math.round((series.distance_probability as number) * 100) + "%",
      "Map Breakdown: " + mapBreakdown,
      "Key Insights: " + headlines.join(" | "),
    ].join("\n");

    const platformInstructions = platform === 'linkedin'
      ? "Write a LinkedIn post (150-250 words). Professional but engaging and eye-catching. Lead with a strong hook that stops the scroll. Use emojis strategically (3-5 throughout). Include 2-3 key data points. End with a subtle mention of Sitech eSports. Add 3-5 hashtags (e.g. #CDL #Esports #CallOfDuty #EsportsBetting #SitechEsports)."
      : "Write an Instagram post (80-150 words). Punchy, fun and engaging. Use emojis generously (5-8 throughout). Include 1-2 key stats that create intrigue. Make it exciting and data-backed. Add 10-15 hashtags covering esports, CDL, betting, the teams, and gaming.";

    const prompt = "You are writing social media content for Sitech eSports, a B2B technology company building simulation-powered pricing infrastructure for the eSports betting industry.\n\nBrand voice: Technical but approachable. Data-driven, confident, solutions-oriented. Write for traders and betting operators, not fans. Never sound like a tipster. Reference \"our simulation engine\" or \"our model\" when discussing predictions.\n\n" + platformInstructions + "\n\nHere is the match data from our simulation engine:\n\n" + dataBlock;

    setContent(prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardLabels = ["Match Preview", "Map Breakdown", "Key Insights"];
  const cardKeys = ["hero", "maps", "insights"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Generate Social Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="flex gap-3 mb-4">
          <button onClick={() => setPlatform('linkedin')} className={"px-4 py-2 rounded-lg font-medium transition-all " + (platform === 'linkedin' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}>LinkedIn</button>
          <button onClick={() => setPlatform('instagram')} className={"px-4 py-2 rounded-lg font-medium transition-all " + (platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}>Instagram</button>
        </div>

        <button onClick={handleGenerate} disabled={!insights} className="w-full mb-4 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all">
          {platform === 'linkedin' ? 'Build LinkedIn Prompt' : 'Build Instagram Prompt'}
        </button>

        {insights && getCardData() && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">{cardLabels[cardIndex]} ({cardIndex + 1}/3)</span>
              <div className="flex gap-2">
                <button onClick={() => handleDownloadCard(Object.values(getCardData()!)[cardIndex] as string, cardKeys[cardIndex])} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-all">Download</button>
                <button onClick={handleDownloadAll} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-all">Download All</button>
              </div>
            </div>
            <div className="relative">
              {!loadedCards.has(cardKeys[cardIndex]) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg min-h-[200px]">
                  <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={Object.values(getCardData()!)[cardIndex] as string} alt="" className="w-full rounded-lg border border-gray-700" onLoad={() => setLoadedCards(prev => new Set(prev).add(cardKeys[cardIndex]))} />
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              <button onClick={() => setCardIndex(i => Math.max(0, i - 1))} disabled={cardIndex === 0} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded transition-all">&larr;</button>
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (<div key={i} onClick={() => setCardIndex(i)} className={"w-3 h-3 rounded-full cursor-pointer transition-all " + (i === cardIndex ? "bg-green-500" : "bg-gray-600")} />))}
              </div>
              <button onClick={() => setCardIndex(i => Math.min(2, i + 1))} disabled={cardIndex === 2} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white rounded transition-all">&rarr;</button>
            </div>
          </div>
        )}

        {content && (
          <>
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full h-40 bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 resize-none border border-gray-700 focus:border-blue-500 focus:outline-none" />
            <div className="flex gap-3">
              <button onClick={handleCopy} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </>
        )}

        {!insights && (
          <p className="text-gray-400 text-center py-4">Run a simulation first to generate insights for this fixture.</p>
        )}
      </div>
    </div>
  );
}
