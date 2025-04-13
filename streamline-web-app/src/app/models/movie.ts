import { InteractionType } from './interactionType.enum';
import { WatchProviderType } from './watchProviderType.enum';

export interface Movie {
  backdrop_path: string;
  genres: Genre[];
  id: string;
  original_language: string;
  overview: string;
  release_date: Date;
  runtime: number;
  status: string;
  tagline: string;
  tags: Tag[];
  title: string;
  user_interactions: UserInteraction[];
  is_movie_in_watchlist: boolean;
  vote_average: number;
  vote_count: number;
  watch_providers: WatchProvider[];
  director: string[];
  writer: string[];
  top_cast: string[];
}

export interface ShowAllMovies {
  id: string;
  title: string;
  vote_average: number;
  release_date: Date;
  genres: Genre[];
  poster_path: string;
  backdrop_path: string;
}

export interface ShowAllMoviesWithRecommendation extends ShowAllMovies {
  recommendation_score: number;
}

export interface WatchListMovie {
  id: string;
  title: string;
  vote_average: number;
  release_date: Date;
  poster_path: string;
  backdrop_path: string;
  recommendation_score: number | null;
}

export interface OnboardingMovie {
  id: string;
  title: string;
  release_date: Date;
  poster_path: string;
}

export interface Review {
  review_id: string;
  user_id: string;
  username: string;
  avatar: string;
  review_text: string;
  created_at: Date;
  like_count: number;
  rating: number;
  isReviewLiked: boolean;
}

export interface ReviewWithMovie extends Review {
  movie_id: string;
  title: string;
  poster_path: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export interface UserInteraction {
  id: number;
  rating: number | null;
  type: InteractionType;
  created_at: Date;
}

export interface WatchProvider {
  id: number;
  name: string;
  logo_path: string;
  priority: number;
  type: WatchProviderType;
}
