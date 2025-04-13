import { Component, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import {
  ShowAllMovies,
  ShowAllMoviesWithRecommendation,
} from '../models/movie';
import { MoviesQueryParams, MoviesService } from '../services/movies.service';
import { GenreMapping } from '../enums/genreMapping.enum';
import { LoadingService } from '../services/loading.service';
import { TrackLoading } from '../decorators/track-loading.decorator';

interface MoviesCarousel {
  movies: ShowAllMovies[];
  title: string;
}
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  movies: MoviesCarousel[] = [
    {
      movies: [],
      title: 'Top Picks',
    },
    {
      movies: [],
      title: 'Comedy',
    },
    {
      movies: [],
      title: 'Romance',
    },
    {
      movies: [],
      title: 'Action',
    },
    {
      movies: [],
      title: 'Sci-Fi',
    },
    {
      movies: [],
      title: 'Popular',
    },
  ];

  heroMovies: ShowAllMovies[] | ShowAllMoviesWithRecommendation[] | undefined;

  baseQueryParams: MoviesQueryParams = {
    pagination: {
      pageNumber: 0,
      pageSize: 12,
    },
  };

  responsiveOptionsHero: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

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

  private moviesSubscriptions: Subscription = new Subscription();

  constructor(
    private moviesService: MoviesService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getHeroMovies();
    this.getAllMovieCarousels();
  }

  ngOnDestroy() {
    this.moviesSubscriptions.unsubscribe();
  }

  getMovieBackdropUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/original';
    return baseUrl + poster_url;
  }

  getMoviePosterUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/w500';
    return baseUrl + poster_url;
  }

  getHeroMovies() {
    const monthsAgo = new Date(),
      now = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 6);

    this.moviesService
      .findMovies({
        ...this.baseQueryParams,
        releaseDates: [monthsAgo, now],
        pagination: {
          pageNumber: 0,
          pageSize: 5,
        },
      })
      .subscribe((response) => {
        this.heroMovies = response.movies;
      });
  }

  getAllMovieCarousels() {
    this.moviesSubscriptions.add(
      this.getAllMovieCarousels$().subscribe((responses) => {
        // Map responses to the corresponding movie carousels
        this.movies[0].movies = responses[0].movies; // Top Picks
        this.movies[1].movies = responses[1].movies; // Comedy
        this.movies[2].movies = responses[2].movies; // Romance
        this.movies[3].movies = responses[3].movies; // Action
        this.movies[4].movies = responses[4].movies; // Sci-Fi
        this.movies[5].movies = responses[5].movies; // Popular
      })
    );
  }

  @TrackLoading('homepage')
  private getAllMovieCarousels$() {
    return forkJoin([
      this.moviesService.findMovies({
        ...this.baseQueryParams,
      }),
      this.moviesService.findMovies({
        ...this.baseQueryParams,
        genre: [GenreMapping.Comedy],
      }),
      this.moviesService.findMovies({
        ...this.baseQueryParams,
        genre: [GenreMapping.Romance],
      }),
      this.moviesService.findMovies({
        ...this.baseQueryParams,
        genre: [GenreMapping.Action],
      }),
      this.moviesService.findMovies({
        ...this.baseQueryParams,
        genre: [GenreMapping.SciFi],
      }),
      this.moviesService.findMovies({
        ...this.baseQueryParams,
        sort: 'popularity:-1',
      }),
    ]);
  }
}
