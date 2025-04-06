import { Component, Input } from '@angular/core';
import { ShowAllMovies, WatchListMovie } from '../../models/movie';

@Component({
  selector: 'app-watchlistcard',
  templateUrl: './watchlistcard.component.html',
  styleUrl: './watchlistcard.component.scss',
})
export class WatchlistcardComponent {
  @Input({ required: true }) movie!: WatchListMovie;
  @Input() first: boolean = false;

  constructor() {}

  getMoviePosterUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/w500';
    return baseUrl + poster_url;
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
