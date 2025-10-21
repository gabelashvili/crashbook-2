export interface LeaderboardItem {
  id: number;
  username: string;
  multiplier: number;
  win: number;
}

export type Leaderboard = LeaderboardItem[];
