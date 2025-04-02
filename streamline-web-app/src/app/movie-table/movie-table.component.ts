import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { MoviesService, MoviesQueryParams } from '../services/movies.service';
import { Movie, ShowAllMovies } from '../models/movie';
import { PaginatorState } from 'primeng/paginator';
import {
  faWindows,
  faApple,
  faLinux,
} from '@fortawesome/free-brands-svg-icons';
import { LocaleHelperService } from '../services/localeHelper.service';
import { loadTranslations } from '@angular/localize';
import { finalize, Subscription } from 'rxjs';

export interface filterOption {
  id: number;
  name: String;
}

@Component({
  selector: 'app-movie-table',
  templateUrl: './movie-table.component.html',
  styleUrls: ['./movie-table.component.scss'],
})
export class MovieTableComponent implements OnInit {
  faWindows = faWindows;
  faApple = faApple;
  faLinux = faLinux;

  sortOptions = [
    { label: 'Popularity', value: 'popularity:-1' },
    { label: 'Vote Average', value: 'vote_average:-1' },
    { label: 'Vote Count', value: 'vote_count:-1' },
    { label: 'Release Date', value: 'release_date:-1' },
  ];

  rowsPerPageOptions: number[] = [12, 24, 36, 48, 60];
  first: number = 0;
  rows: number = 12;

  sortKey: string = 'popularity:-1';

  ratingSliderValues: number[] = [0, 10];

  queryParams: MoviesQueryParams = {
    language: 'en',
    pagination: {
      pageNumber: 0,
      pageSize: 12,
    },
  };

  loading = signal(false);
  movies = signal<ShowAllMovies[]>([]);
  genresFilterOptions = signal<filterOption[]>([]);
  tagsFilterOptions = signal<filterOption[]>([]);
  watchProvidersFilterOptions = signal<filterOption[]>([]);
  totalRecords = signal(0);

  private moviesSubscription: Subscription | null = null;

  constructor(
    private moviesService: MoviesService,
    private localHelper: LocaleHelperService
  ) {}

  ngOnInit(): void {
    console.log(this.localHelper.getUsersLocale());
    this.getMoviesAndFilters();
  }

  ngOnDestroy() {
    this.moviesSubscription ? this.moviesSubscription.unsubscribe() : null;
  }

  getMoviesAndFilters(): void {
    this.getMovies();
    this.getFilters();
  }

  getFilters(): void {
    this.moviesService.getMovieFilters().subscribe((response) => {
      this.genresFilterOptions.set(response.genres);
      this.tagsFilterOptions.set(response.tags);
      this.watchProvidersFilterOptions.set(response.watch_providers);
    });
  }

  getMovies(): void {
    this.loading.set(true);

    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    this.moviesSubscription = this.moviesService
      .findMovies(this.queryParams)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.movies.set(response.movies);
        this.totalRecords.set(response.total_count);
      });
  }
  onSortChange(event: any) {
    let value = event.value;
    console.log('sort change');
    console.log(event.value);

    if (value.indexOf(':') > 0) {
      this.queryParams.sort = value;
    } else {
      this.queryParams.sort = value;
    }

    this.getMovies();
  }

  onFilterChange() {
    console.log('filter change');
    this.getMovies();
  }

  onRatingFilterChange(event: any) {
    console.log(event);
    this.queryParams.ratings = this.ratingSliderValues;
    this.getMovies();
  }

  onDateSelectChange(event: any) {
    this.getMovies();
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
