import { Game } from './game';

export interface GamesResponse {
  data: Game[];
  pageInfo: {
    distinctGenres: string[];
    distinctTags: string[];
    totalRecords: number;
  };
}
