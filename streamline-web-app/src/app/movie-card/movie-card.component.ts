import { Component, Input } from '@angular/core';
import { Movie, ShowAllMovies } from '../models/movie';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: ShowAllMovies;
  @Input() first: boolean = false;

  constructor() {}

  getMoviePosterUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/w500';
    return baseUrl + poster_url;
  }

  getVoteAveragePercentage(voteAverage: number): string {
    return (voteAverage * 10).toFixed() + '%';
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
