// CDL team branding - colors and logos
// Fallback brand colors (SiTech Esports)
export const brand = {
  coral: '#E8655A',
  teal: '#7DBDAB',
};

export interface TeamConfig {
  color: string;
  logo: string;
}

const TEAM_CONFIG: Record<string, TeamConfig> = {
  'Boston Breach': {
    color: 'rgb(3, 255, 91)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt69dd80f51295ea0a/61e09af0a408793a37adc7a4/cdl-boston-breach-icon-color-dark-padding.svg?auto=webp',
  },
  'Carolina Royal Ravens': {
    color: 'rgb(0, 131, 193)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/bltc1ddba2549587194/64f74317af49494ad8926c37/ravens-icon-color.svg?auto=webp',
  },
  'Cloud9 New York': {
    color: 'rgb(0, 174, 239)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt73e8f6f2194e9370/6719383cef12165a22bf678c/C9NY_Icon_White_NY_(1).svg?auto=webp',
  },
  'Faze Vegas': {
    color: 'rgb(255, 0, 255)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/bltdea71ea67a2999d7/68cc24e4e6f87a2d6e27a6c6/Asset_14.svg?auto=webp',
  },
  'G2 Min': {
    color: 'rgb(53, 31, 101)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt8f87f7107e1658cc/6732a3d2ac6f71ab1c541288/ROKKR_ICON_MAIN_Red_(1).svg?auto=webp',
  },
  'Los Angeles Thieves': {
    color: 'rgb(237, 34, 36)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt4ae7c1816b4ffc52/5fa5a10ea9e913483b74d191/cdl_la_thieves_primary_logo_padding.svg?auto=webp',
  },
  'Miami': {
    color: 'rgb(33, 109, 107)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt46e2a57928dfcb39/64e77a7ff3415dce8124716b/heretics-icon-color.svg?auto=webp',
  },
  'Optic Texas': {
    color: 'rgb(146, 201, 81)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt4bee833057845797/618af2431bb8c23cf8bbede5/cdl_optic_texas_icon_light.svg?auto=webp',
  },
  'Paris': {
    color: 'rgb(237, 137, 229)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt68118b0f6e452b79/6925d17d521fe6a55224502c/Paris_Gentle_Mates_block.svg?auto=webp',
  },
  'Falcons': {
    color: 'rgb(25, 206, 132)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt10cfdbbd775958c4/68c05db642e3074f5b293148/Riyadh_Falcons_Mark_Green_Icon_No_Crop.svg?auto=webp',
  },
  'Toronto': {
    color: 'rgb(120, 44, 242)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/blt7cfe2b2dd1a274d5/690b774337ded4045fe74dfa/koi_frame_(1).svg?auto=webp',
  },
  'Vancouver': {
    color: 'rgb(3, 255, 206)',
    logo: 'https://images.blz-contentstack.com/v3/assets/blta7b34f1f894a2422/bltbe8507a1cef478bb/5dba15def9bc554996993cd0/SEA_-_Surge.svg?auto=webp',
  },
};

export function getTeamConfig(name: string): TeamConfig {
  const config = TEAM_CONFIG[name] || Object.entries(TEAM_CONFIG).find(([key]) =>
    name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())
  )?.[1];
  return config || { color: brand.coral, logo: '' };
}

// Helper to build a team logo element (for use in JSX)
// Usage: <TeamLogo name="Optic Texas" size={32} />
// This is a data-only module; React component is in app/components/TeamLogo.tsx
