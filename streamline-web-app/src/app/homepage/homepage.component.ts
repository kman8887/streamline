import { Component, signal } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { ShowAllMovies } from '../models/movie';
import { LocaleHelperService } from '../services/localeHelper.service';
import { MoviesQueryParams, MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  loading = false;
  movies: ShowAllMovies[] | undefined;

  queryParams: MoviesQueryParams = {
    language: 'en',
    genre: ['35'],
    pagination: {
      pageNumber: 0,
      pageSize: 12,
    },
  };

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  private moviesSubscription: Subscription | null = null;

  constructor(
    private moviesService: MoviesService,
    private localHelper: LocaleHelperService
  ) {}

  ngOnInit(): void {
    console.log(this.localHelper.getUsersLocale());
    this.getMovies();
  }

  ngOnDestroy() {
    this.moviesSubscription ? this.moviesSubscription.unsubscribe() : null;
  }

  getMovies(): void {
    this.loading = true;

    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    this.moviesSubscription = this.moviesService
      .findMovies(this.queryParams)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => {
        this.movies = response.movies;
      });
  }
}
