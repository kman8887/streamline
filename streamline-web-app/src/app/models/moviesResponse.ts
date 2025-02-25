import { Movie } from './movie';

export interface MoviesResponse {
  data: Movie[];
  pageInfo: {
    distinctGenres: string[];
    distinctTags: string[];
    totalRecords: number;
  };
}
