
export interface Participant {
  id: string;
  name: string;
  theme: string;
  photoUrl: string;
  timestamp: number;
  votes: number;
  entryNumber: number;
}

export enum ViewType {
  HOME = 'home',
  REGISTER = 'register',
  WALL = 'wall',
  VOTE = 'vote',
  ADMIN = 'admin',
  RESULTS = 'results'
}

export interface ActivityConfig {
  isRegistrationOpen: boolean;
  isResultsRevealed: boolean;
}
