import { Component, signal } from '@angular/core';
import {
  MoviesService,
  WatchListQueryParams,
} from '../services/movies.service';
import { LocaleHelperService } from '../services/localeHelper.service';
import { AuthService } from '@auth0/auth0-angular';
import { finalize, Subscription } from 'rxjs';
import {
  ShowAllMovies,
  ShowAllMoviesWithRecommendation,
  WatchListMovie,
} from '../models/movie';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss',
})
export class WatchlistComponent {
  loading = signal(false);
  movies = signal<WatchListMovie[]>([]);
  totalRecords = 0;

  queryParams: WatchListQueryParams = {
    pagination: {
      pageNumber: 0,
      pageSize: 12,
    },
  };

  rowsPerPageOptions: number[] = [12, 24, 36, 48, 60];
  first: number = 0;
  rows: number = 12;

  private moviesSubscription: Subscription | null = null;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  ngOnDestroy() {
    this.moviesSubscription ? this.moviesSubscription.unsubscribe() : null;
  }

  getMovies(): void {
    this.loading.set(true);

    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    this.moviesSubscription = this.moviesService
      .getMoviesFromWatchList(this.queryParams)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.movies.set(response.movies);
        this.totalRecords = response.total_count;
      });
  }

  onPageChange(event: PaginatorState) {
    console.log('page change');
    console.log(event);
    this.queryParams.pagination.pageNumber = event.page ? event.page : 0;
    this.queryParams.pagination.pageSize = event.rows ? event.rows : 12;
    console.log(this.movies.length);
    this.first = event.first ? event.first : 0;
    this.rows = event.rows ? event.rows : 12;
    this.getMovies();
  }
}
