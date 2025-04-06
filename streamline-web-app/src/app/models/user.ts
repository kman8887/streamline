export interface User {
  id: number;
  username: string;
  real_name: string;
  avatar: string;
  region: string;
  auth_id: string;
  creation_date: string;
  avg_rating: number;
  total_ratings: number;
  total_likes: number;
  total_reviews: number;
}
export interface UpdateUser {
  region?: string;
  language: string[];
  watch_providers: number[];
}

export interface UserWatchProviders {
  watchProviders: number[];
}
