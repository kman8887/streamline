import { Component, Input } from '@angular/core';
import {
  ShowAllMovies,
  ShowAllMoviesWithRecommendation,
} from '../../models/movie';

@Component({
  selector: 'app-match-badge',
  templateUrl: './match-badge.component.html',
  styleUrl: './match-badge.component.scss',
})
export class MatchBadgeComponent {
  @Input({ required: true }) movie!:
    | ShowAllMovies
    | ShowAllMoviesWithRecommendation;

  recommendationScore?: string;
  recommendationStyling?: string;

  constructor() {}

  ngOnInit() {
    if (this.isShowAllMoviesWithRecommendation(this.movie)) {
      this.recommendationScore = this.getRecommendationPercentage(
        this.movie.recommendation_score
      );

      this.recommendationStyling = this.getRecommendationStyling(
        this.movie.recommendation_score
      );
    }
  }

  ngOnChanges() {
    if (this.isShowAllMoviesWithRecommendation(this.movie)) {
      this.recommendationScore = this.getRecommendationPercentage(
        this.movie.recommendation_score
      );

      this.recommendationStyling = this.getRecommendationStyling(
        this.movie.recommendation_score
      );
    }
  }

  private isShowAllMoviesWithRecommendation(
    movie: ShowAllMovies | ShowAllMoviesWithRecommendation
  ): movie is ShowAllMoviesWithRecommendation {
    return (
      'recommendation_score' in movie &&
      movie.recommendation_score !== undefined &&
      movie.recommendation_score !== null
    );
  }

  getVoteAveragePercentage(voteAverage: number): string {
    return (voteAverage * 10).toFixed() + '%';
  }

  getRecommendationPercentage(recommendation: number): string {
    return (recommendation * 100).toFixed() + '%';
  }

  getRecommendationStyling(recommendation: number): string {
    return this.getVoteAverageStyling(recommendation * 10);
  }

  getVoteAverageStyling(voteAverage: number): string {
    if (voteAverage >= 8.5) {
      return 'very-highly-rated';
    } else if (voteAverage >= 7.0) {
      return 'highly-rated';
    } else if (voteAverage >= 5.0) {
      return 'mixed';
    } else if (voteAverage >= 3.5) {
      return 'badly-rated';
    } else {
      return 'very-badly-rated';
    }
  }
}
