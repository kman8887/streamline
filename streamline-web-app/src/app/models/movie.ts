export interface Movie {
  title: string;
  genres: Genre[];
  release_date: Date;
  poster_path: string;
  _id: string;
  interaction_count: number;
  // developer: string;
  // publisher: string;
  keywords: Keyword[];
  tagline: string;
  // reviews: Review[];
}

export interface Review {
  _id: string;
  username: string;
  text: string;
  hours: number;
  date: string;
  products: number;
  isRecommended: boolean;
  avatar: string;
  user_id: string;
  found_funny: string[];
  found_helpful: string[];
  found_not_helpful: string[];
}

interface Genre {
  id: number;
  name: string;
}

interface Keyword {
  id: number;
  name: string;
}
