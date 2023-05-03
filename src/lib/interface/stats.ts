export interface Stats {
  goals: number;
  passesRecieved: number;
  passesCompleted: number;
  passesFailed: number;
  interceptions: number;
  shots: number;
}

export interface TeamStats {
  teamName: string;
  score: number;
  players: Stats[];
}
