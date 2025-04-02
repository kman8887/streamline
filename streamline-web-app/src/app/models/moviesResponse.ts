import { filterOption } from '../movie-table/movie-table.component';
import { Movie, ShowAllMovies } from './movie';

export interface MoviesResponse {
  movies: ShowAllMovies[];
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
