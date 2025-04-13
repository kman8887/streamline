import { Component, Input, OnDestroy, signal } from '@angular/core';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import { MoviesService } from '../../services/movies.service';
import { OnboardingMovie, ShowAllMovies } from '../../models/movie';
import { finalize, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { LoadingService } from '../../services/loading.service';
import { User } from '../../models/user';

export interface MovieRating
  extends Omit<ShowAllMovies, 'vote_average' | 'genres' | 'backdrop_path'> {
  rating?: number;
}

@Component({
  selector: 'app-ratings-onboarding',
  templateUrl: './ratings-onboarding.component.html',
  styleUrl: './ratings-onboarding.component.scss',
  providers: [DialogService, MoviesService],
})
export class RatingsOnboardingComponent implements OnDestroy {
  private moviesSubscription: Subscription | null = null;
  private currentUserId: number | null = null;

  loading = signal(false);
  movies: MovieRating[] = [];
  movie: MovieRating = {
    id: 'loading',
    title: 'Test',
    release_date: new Date(),
    poster_path: 'some_temp_url',
  };
  rating: number = 0;
  pageNumber = 0;
  progress = 0;

  constructor(
    private moviesService: MoviesService,
    private userService: UserService,
    private authService: AuthService,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getMovies();
    this.getCurrentUser();
  }

  getMovies(): void {
    this.loading.set(true);

    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    this.moviesSubscription = this.moviesService
      .findOnboardingMovies(this.pageNumber)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        const newMovies = response.map((movie) => {
          return {
            ...movie,
          } as MovieRating;
        });

        this.movie = newMovies[0];
        this.movies = [...this.movies, ...newMovies];
      });
  }

  getMoviePosterUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/w500';
    return baseUrl + poster_url;
  }

  closeAndSubmitRatings(): void {
    if (this.currentUserId !== null && this.currentUserId !== undefined) {
      const filteredMovies = this.getFilteredMovieRatings();
      if (filteredMovies.length > 0) {
        this.userService
          .bulkRateMovies(filteredMovies, this.currentUserId)
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
              this.ref.close(this.progress);
            },
          });
      }
    } else {
      this.ref.close(this.progress);
    }
  }

  ngOnDestroy() {
    this.moviesSubscription ? this.moviesSubscription.unsubscribe() : null;
  }

  isRateMovieDisabled(): boolean {
    return this.rating === undefined || this.rating === null;
  }

  rateMovie() {
    const currentIndex = this.movies.findIndex(
      (movie) => movie.id === this.movie.id
    );

    if (this.rating !== undefined && this.rating !== null) {
      this.movies[currentIndex].rating = this.rating;
    }
    this.progress += 10;
    if (this.progress >= 100) {
      this.closeAndSubmitRatings();
      return;
    }

    this.nextMovie();
  }

  skipMovie() {
    this.nextMovie();
  }

  goBack() {
    return;
  }

  private nextMovie() {
    const currentIndex = this.movies.findIndex(
      (movie) => movie.id === this.movie.id
    );

    if (currentIndex !== -1 && currentIndex < this.movies.length - 1) {
      this.movie = this.movies[currentIndex + 1];
      if (this.movie.rating !== undefined && this.movie.rating !== null) {
        this.rating = this.movie.rating;
        return;
      }
    } else {
      this.pageNumber++;
      this.getMovies();
    }
    this.rating = 0;
  }

  private getFilteredMovieRatings(): MovieRating[] {
    return this.movies.filter(
      (movie) => movie.rating !== undefined && movie.rating !== null
    );
  }

  private getCurrentUser(): void {
    this.authService.user$.subscribe((response: any) => {
      if (response && response._id) {
        this.currentUserId = response._id;
      } else if (this.config.data && this.config.data.user) {
        this.currentUserId = this.config.data.user.id;
      }
    });
  }
}
