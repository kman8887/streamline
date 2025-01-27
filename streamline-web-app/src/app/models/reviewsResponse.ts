import { Review } from './game';

export interface ReviewsResponse {
  data: Review[];
  totalRecords: number;
}
