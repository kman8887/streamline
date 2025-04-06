import { filterOption } from '../movie-table/movie-table.component';
import {
  Movie,
  ShowAllMovies,
  ShowAllMoviesWithRecommendation,
  WatchListMovie,
} from './movie';

export interface MoviesResponse {
  movies: ShowAllMovies[] | ShowAllMoviesWithRecommendation[];
  total_count: number;
}

export interface WatchListResponse {
  movies: WatchListMovie[];
  total_count: number;
}

export interface MovieFiltersResponse {
  genres: filterOption[];
  tags: filterOption[];
  watch_providers: filterOption[];
}

export interface MovieRecommendationResponse {
  predicted_score: number;
}
