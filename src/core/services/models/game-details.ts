export interface IGameDetails {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  fullDescription: string;
  specs: IGameSpecs;
  topRecords: ITopRecord[];
}

export interface IGameSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface ITopRecord {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string;
}