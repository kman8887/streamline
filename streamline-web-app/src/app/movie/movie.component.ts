import { Component } from '@angular/core';
import { Movie, Review, UserInteraction, WatchProvider } from '../models/movie';
import { MoviesService, ReviewsQueryParams } from '../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import {
  faFaceLaughBeam,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  faWindows,
  faApple,
  faLinux,
} from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '@auth0/auth0-angular';
import { ReviewReaction } from '../models/reviewReaction.enum';
import { ReviewService } from '../services/review.service';
import { createEditReview } from '../models/createEditReview';
import { editReview } from '../reviews/review-add-edit/review-add-edit.component';
import * as _ from 'lodash';
import { InteractionType } from '../models/interactionType.enum';
import { WatchProviderType } from '../models/watchProviderType.enum';
import { UserService } from '../services/user.service';
import { MovieRating } from '../ratings/ratings-onboarding/ratings-onboarding.component';
import { ReviewTableData } from '../reviews/review-table/review-table.component';
import { ReviewsResponse } from '../models/reviewsResponse';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent {
  movie: Movie | undefined;
  reviewTableData?: ReviewTableData;

  isMovieLiked = false;
  isMovieWatched = false;

  recommendationScore: number = 0;
  rating: number = 0;
  watchProviders: WatchProvidersByType | undefined;

  private loggedInUserId: string = '';
  private roles: string[] = [];

  constructor(
    private moviesService: MoviesService,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUser();
  }

  getMovies(): void {
    this.moviesService.findMovie(this.movieId).subscribe((response) => {
      this.movie = response;
      console.log(this.movie);
      this.getMovieRating();
      this.setIsMovieLiked();
      this.setIsMovieWatched();
      this.watchProviders = this.getWatchProvidersByType();
      console.log(this.watchProviders);
    });
  }

  getUser(): void {
    const movie_id = this.movieId;
    this.authService.user$.subscribe((response: any) => {
      if (response) {
        this.loggedInUserId = response._id;
        this.roles = response.myroles;

        this.moviesService
          .getRecommendation(this.loggedInUserId, movie_id)
          .subscribe((response) => {
            this.recommendationScore = response.predicted_score;
          });
      }

      this.setReviewTableData();
    });
  }

  onRatingChange(event: any) {
    if (this.loggedInUserId !== null && this.movie != undefined) {
      const movieRating: MovieRating = {
        id: this.movie.id,
        title: this.movie.title,
        release_date: this.movie.release_date,
        poster_path: this.movie.backdrop_path,
        rating: this.rating,
      };
      this.userService
        .bulkRateMovies([movieRating], Number.parseInt(this.loggedInUserId))
        .subscribe({
          next: (response) => {
            console.log('Bulk rate movies successful:', response);
            // Handle success, e.g., show a success message or update the UI
          },
          error: (error) => {
            console.error('Error bulk rating movies:', error);
            // Handle error, e.g., show an error message
          },
          complete: () => {
            console.log('Bulk rate movies request completed.');
            // Optional: Handle any cleanup or final steps
          },
        });
    }
  }

  onMovieLikeToggle(newState: boolean): void {
    this.isMovieLiked = newState;
    if (this.movie) {
      this.moviesService.toggleMovieLike(this.movie.id, newState).subscribe({
        next: () => {
          console.log(`Movie ${this.isMovieLiked ? 'liked' : 'unliked'}`);
        },
        error: (err) => {
          console.error('Error toggling like:', err);
          this.isMovieLiked = !this.isMovieLiked; // Revert UI state on failure
        },
      });
    }
  }

  onMovieWatchToggle(newState: boolean): void {
    this.isMovieWatched = newState;
    if (this.movie) {
      this.moviesService.toggleMovieWatched(this.movie.id, newState).subscribe({
        next: () => {
          console.log(`Movie ${this.isMovieWatched ? 'watched' : 'unwatched'}`);
        },
        error: (err) => {
          console.error('Error toggling watch:', err);
          this.isMovieWatched = !this.isMovieWatched; // Revert UI state on failure
        },
      });
    }
  }

  getMovieBackdropUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/original';
    return baseUrl + poster_url;
  }

  getLogoUrl(logo_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/w154';
    return baseUrl + logo_url;
  }

  getFreeWatchProviders(): WatchProvider[] {
    return this.getProvidersByType(WatchProviderType.FREE);
  }

  getWatchProvidersByType(): WatchProvidersByType {
    return {
      free: this.getProvidersByType(WatchProviderType.FREE),
      ads: this.getProvidersByType(WatchProviderType.ADS),
      rent: this.getProvidersByType(WatchProviderType.RENT),
      buy: this.getProvidersByType(WatchProviderType.BUY),
      stream: this.getProvidersByType(WatchProviderType.FLATRATE),
    };
  }

  getProvidersByType(type: WatchProviderType): WatchProvider[] {
    if (this.movie) {
      return this.movie.watch_providers
        .filter((wp) => wp.type === type)
        .sort((wp) => wp.priority);
    }
    return [];
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

  isUserLoggedIn(): boolean {
    return this.loggedInUserId != '';
  }

  private get movieId(): string {
    return this.route.snapshot.params['id'];
  }

  private setReviewTableData(): void {
    this.reviewTableData = {
      movieId: this.movieId,
      userId: this.loggedInUserId,
      roles: this.roles,
      getReviews: this.getReviews.bind(this),
    };
  }

  private getReviews(
    queryParams: ReviewsQueryParams
  ): Observable<ReviewsResponse> {
    return this.moviesService.getReviews(this.movieId, queryParams);
  }

  private getMovieRating(): void {
    if (this.movie != undefined && this.movie?.user_interactions) {
      let temp_rating = this.movie?.user_interactions.find(
        (interaction) => interaction.type === InteractionType.RATING
      )?.rating;

      if (temp_rating != undefined && temp_rating != null) {
        this.rating = temp_rating;
      }
    }
  }

  private setIsMovieLiked(): void {
    console.log(this.movie?.user_interactions);
    console.log(
      this.movie?.user_interactions.some(
        (interaction) => interaction.type === InteractionType.LIKE
      )
    );
    this.isMovieLiked =
      this.movie != undefined &&
      this.movie?.user_interactions &&
      this.movie?.user_interactions.some(
        (interaction) => interaction.type === InteractionType.LIKE
      );
  }

  private setIsMovieWatched(): void {
    this.isMovieWatched =
      this.movie != undefined &&
      this.movie?.user_interactions &&
      this.movie?.user_interactions.some(
        (interaction) => interaction.type === InteractionType.WATCHED
      );
  }
}

interface WatchProvidersByType {
  free: WatchProvider[];
  ads: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
  stream: WatchProvider[];
}
