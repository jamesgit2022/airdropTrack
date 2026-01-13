export type AirdropStatus = 'active' | 'upcoming' | 'ended';
export type AirdropDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Airdrop {
  id: string;
  name: string;
  ticker?: string;
  logo_url?: string;
  status: AirdropStatus;
  description?: string;
  est_value?: string;
  chain?: string;
  difficulty?: AirdropDifficulty;
  participants_count?: number;
  date?: string; // ISO string
  instruction?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  funding?: string;
  created_at: string;
}
