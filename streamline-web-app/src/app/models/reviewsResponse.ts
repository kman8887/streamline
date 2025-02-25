import { Review } from './movie';

export interface ReviewsResponse {
  data: Review[];
  totalRecords: number;
}
