import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { MoviesService, MoviesQueryParams } from '../services/movies.service';
import {
  ShowAllMovies,
  ShowAllMoviesWithRecommendation,
} from '../models/movie';
import { PaginatorState } from 'primeng/paginator';
import {
  faWindows,
  faApple,
  faLinux,
} from '@fortawesome/free-brands-svg-icons';
import { forkJoin, Observable, Subscription, take } from 'rxjs';
import { AuthService, User } from '@auth0/auth0-angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovieFiltersResponse, MoviesResponse } from '../models/moviesResponse';
import { TrackLoading } from '../decorators/track-loading.decorator';
import { LoadingService } from '../services/loading.service';
import { UserService } from '../services/user.service';
import { UserWatchProviders } from '../models/user';

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

  recommendedOptions = { label: 'Recommended', value: 'predicted_score:-1' };

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
    sort: this.sortKey,
    pagination: {
      pageNumber: 0,
      pageSize: 12,
    },
  };

  movies = signal<ShowAllMovies[] | ShowAllMoviesWithRecommendation[]>([]);
  genresFilterOptions = signal<filterOption[]>([]);
  tagsFilterOptions = signal<filterOption[]>([]);
  watchProvidersFilterOptions = signal<filterOption[]>([]);
  totalRecords = 0;
  showFilterByUsersWatchProviders = false;

  private moviesCache = new Map<
    string,
    {
      timestamp: number;
      movies: ShowAllMovies[] | ShowAllMoviesWithRecommendation[];
      totalRecords: number;
    }
  >();
  private filterCacheKey = 'filters';

  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  private loggedInUserId: string = '';
  private moviesSubscription: Subscription | null = null;

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getUser();

    const storedFilters = localStorage.getItem(this.filterCacheKey);

    if (storedFilters) {
      const parsedFilters = JSON.parse(storedFilters);
      if (this.isCacheValid(parsedFilters.timestamp)) {
        this.setFilters({
          genres: parsedFilters.genresFilterOptions,
          tags: parsedFilters.tagsFilterOptions,
          watch_providers: parsedFilters.watchProvidersFilterOptions,
        });
        this.route.queryParams.subscribe((response) => {
          this.getQueryParams(response);

          this.getMovies();
        });
        return;
      } else {
        // Remove expired filters from localStorage
        localStorage.removeItem(this.filterCacheKey);
      }
    }

    forkJoin({
      params: this.route.queryParams.pipe(take(1)), // Observable for the current user
      filters: this.moviesService.getMovieFilters(), // Observable for watch providers
    }).subscribe(({ params, filters }) => {
      this.setFilters(filters);
      this.getQueryParams(params);
      this.getMovies();
    });
  }

  ngOnDestroy() {
    this.moviesSubscription ? this.moviesSubscription.unsubscribe() : null;
  }

  setShowFilterByUsersWatchProviders(): void {
    this.userService
      .getUserWatchProviders(Number(this.loggedInUserId))
      .subscribe((response) => {
        if (response) {
          this.showFilterByUsersWatchProviders =
            response.watchProviders.length > 0;
        } else {
          this.showFilterByUsersWatchProviders = false;
        }
      });
  }

  getUser(): void {
    this.loadUser$()
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response) {
          this.loggedInUserId = response._id;
          this.setShowFilterByUsersWatchProviders();
          this.sortOptions = [...this.sortOptions, this.recommendedOptions];
        } else {
          this.loggedInUserId = '';
          this.showFilterByUsersWatchProviders = false;
        }
      });
  }

  setFilters(response: MovieFiltersResponse): void {
    this.genresFilterOptions.set(response.genres);
    this.tagsFilterOptions.set(response.tags);
    this.watchProvidersFilterOptions.set(response.watch_providers);

    const newCache = {
      timestamp: Date.now(),
      genresFilterOptions: response.genres,
      tagsFilterOptions: response.tags,
      watchProvidersFilterOptions: response.watch_providers,
    };

    localStorage.setItem(this.filterCacheKey, JSON.stringify(newCache));
  }

  getMovies(): void {
    const key = this.getCacheKey(this.queryParams);

    if (this.moviesCache.has(key)) {
      const entry = this.moviesCache.get(key);
      if (entry && this.isCacheValid(entry.timestamp)) {
        this.movies.set(entry.movies);
        this.totalRecords = entry.totalRecords;
        return;
      }
    }

    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    this.moviesSubscription = this.getMovies$()
      .pipe(take(1))
      .subscribe((response) => {
        this.movies.set(response.movies);
        this.totalRecords = response.total_count;
        this.moviesCache.set(key, {
          timestamp: Date.now(),
          movies: response.movies,
          totalRecords: response.total_count,
        });
      });
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf(':') > 0) {
      this.queryParams.sort = value;
    } else {
      this.queryParams.sort = value;
    }

    this.getMovies();
  }

  onFilterChange() {
    this.resetPagingParams();
    this.updateQueryParams();
    this.getMovies();
  }

  onRatingFilterChange(event: any) {
    this.queryParams.ratings = this.ratingSliderValues;
    this.resetPagingParams();
    this.updateQueryParams();
    this.getMovies();
  }

  onDateSelectChange(event: any) {
    this.resetPagingParams();
    this.updateQueryParams();
    this.getMovies();
  }

  onPageChange(event: PaginatorState) {
    this.queryParams.pagination.pageNumber = event.page ? event.page : 0;
    this.queryParams.pagination.pageSize = event.rows ? event.rows : 12;

    this.first = event.first ? event.first : 0;
    this.rows = event.rows ? event.rows : 12;
    this.updateQueryParams();
    this.getMovies();
  }

  @TrackLoading()
  private loadUser$(): Observable<User | null | undefined> {
    return this.authService.user$;
  }

  @TrackLoading('movies-table')
  private getMovies$(): Observable<MoviesResponse> {
    return this.moviesService.findMovies(this.queryParams);
  }

  private resetPagingParams(): void {
    this.queryParams.pagination.pageNumber = 0;
    this.first = 0;
  }

  private getQueryParams(params: Params): void {
    this.queryParams.sort = params['sort'] || 'popularity:-1';
    this.queryParams.pagination.pageNumber = +params['page'] || 0;
    this.queryParams.pagination.pageSize = +params['size'] || 12;

    if (params['genre']) {
      this.queryParams.genre = Array.isArray(params['genre'])
        ? params['genre'].map((genre: string) => Number(genre))
        : [Number(params['genre'])];
    }

    if (params['tags']) {
      this.queryParams.tags = Array.isArray(params['tags'])
        ? params['tags'].map((tag: string) => Number(tag))
        : [Number(params['tags'])];
    }

    if (params['watchProviders']) {
      this.queryParams.watchProviders = Array.isArray(params['watchProviders'])
        ? params['watchProviders'].map((watchProvider: string) =>
            Number(watchProvider)
          )
        : [Number(params['watchProviders'])];
    }

    if (params['dateFrom'] && params['dateTo']) {
      this.queryParams.releaseDates = [
        new Date(params['dateFrom']),
        new Date(params['dateTo']),
      ];
    } else if (params['dateFrom']) {
      this.queryParams.releaseDates = [new Date(params['dateFrom'])];
    }

    this.queryParams.search = params['search'];

    if (params['onlyShowUsersWatchProviders']) {
      this.queryParams.onlyShowUsersWatchProviders =
        params['onlyShowUsersWatchProviders'] === 'true';
    }

    this.ratingSliderValues = [
      +params['ratingMin'] || 0,
      +params['ratingMax'] || 10,
    ];
  }

  private updateQueryParams(): void {
    console.log(this.queryParams.genre);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.queryParams.sort,
        page: this.queryParams.pagination.pageNumber,
        size: this.queryParams.pagination.pageSize,
        ratingMin: this.ratingSliderValues[0],
        ratingMax: this.ratingSliderValues[1],
        dateFrom: this.queryParams.releaseDates
          ? this.queryParams.releaseDates[0]
          : undefined,
        dateTo: this.queryParams.releaseDates
          ? this.queryParams.releaseDates[1]
          : undefined,
        tags: this.queryParams.tags,
        genre: this.queryParams.genre,
        watchProviders: this.queryParams.watchProviders,
        search: this.queryParams.search,
        onlyShowUsersWatchProviders:
          this.queryParams.onlyShowUsersWatchProviders,
      },
      queryParamsHandling: 'merge', // retain others
    });
  }

  private getCacheKey(params: MoviesQueryParams): string {
    return JSON.stringify(params); // optionally normalize or sort keys
  }

  private isCacheValid(entryTime: number): boolean {
    return Date.now() - entryTime < this.cacheTTL;
  }
}
