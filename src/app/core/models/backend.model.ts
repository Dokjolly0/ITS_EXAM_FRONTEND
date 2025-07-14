import { User } from '../../interfaces/user';

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface Match {
  date: string | Date;
  player1: User;
  player2: User;
  played: boolean;
  scorePlayer1: number;
  scorePlayer2: number;
  createdBy: User;
  modifiedBy: User;
  note: string;
  winner: User | null; // Virtual field to determine the winner of a match
}

export interface ClassificationEntry {
  userId: string;
  firstName: string;
  lastName: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
}
