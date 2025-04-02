import { Review, ReviewWithMovie } from './movie';

export interface ReviewsResponse {
  reviews: Review[] | ReviewWithMovie[];
  total_count: number;
}
