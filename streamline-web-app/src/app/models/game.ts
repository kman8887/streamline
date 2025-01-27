export interface Game {
  title: string;
  genres: string[];
  release_date: Date;
  platforms: platforms;
  header_image: string;
  price: number;
  _id: string;
  sentiment: string;
  review_count: number;
  developer: string;
  publisher: string;
  tags: string[];
  short_description: string;
  reviews: Review[];
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

interface platforms {
  windows: boolean;
  mac: boolean;
  linux: boolean;
}
