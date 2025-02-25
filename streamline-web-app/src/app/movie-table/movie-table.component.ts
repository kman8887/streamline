import { Component, OnInit } from '@angular/core';
import { MoviesService, MoviesQueryParams } from '../services/movies.service';
import { Movie } from '../models/movie';
import { PaginatorState } from 'primeng/paginator';
import {
  faWindows,
  faApple,
  faLinux,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-movie-table',
  templateUrl: './movie-table.component.html',
  styleUrls: ['./movie-table.component.scss'],
})
export class MovieTableComponent implements OnInit {
  movies: Movie[] = [];

  faWindows = faWindows;
  faApple = faApple;
  faLinux = faLinux;

  sortOptions = [
    { label: 'Review Count', value: 'review_count:-1' },
    // { label: 'Price High to Low', value: 'priceSorting:-1' },
    // { label: 'Price Low to High', value: 'priceSorting' },
    { label: 'Release Date', value: 'release_date:-1' },
    // { label: 'Sentiment', value: 'sentiment' },
  ];

  genresFilterOptions: string[] = [];
  tagsFilterOptions: string[] = [];
  // platformsFilterOptions = [
  //   { label: 'Mac', value: 'mac' },
  //   { label: 'Windows', value: 'windows' },
  //   { label: 'Linux', value: 'linux' },
  // ];

  sortKey: string = '';

  totalRecords = 0;

  priceSliderValue = 70;

  queryParams: MoviesQueryParams = {
    pagination: {
      pageNumber: 0,
      pageSize: 10,
    },
  };

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.moviesService.findMovies(this.queryParams).subscribe((response) => {
      this.movies = response.data;
      this.totalRecords = response.pageInfo.totalRecords;
      this.genresFilterOptions = response.pageInfo.distinctGenres;
      this.tagsFilterOptions = response.pageInfo.distinctTags;
    });
  }

  onSortChange(event: any) {
    let value = event.value;
    console.log('sort change');

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

  onPriceFilterChange(event: any) {
    console.log(event);
    if (this.priceSliderValue >= 70) {
      this.queryParams.price = undefined;
    } else {
      this.queryParams.price = this.priceSliderValue;
    }
    this.getMovies();
  }

  onDateSelectChange(event: any) {
    this.getMovies();
  }

  getMoviePosterUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/w185';
    return baseUrl + poster_url;
  }

  // getSeverity(movie: Movie): string | undefined {
  //   switch (movie.sentiment) {
  //     case 'Overwhelmingly Positive':
  //       return 'over-pos';

  //     case 'Very Positive':
  //       return 'very-pos';

  //     case 'Mostly Positive':
  //       return 'most-pos';

  //     case 'Mixed':
  //       return 'mixed';

  //     default:
  //       return undefined;
  //   }
  // }

  onPageChange(event: PaginatorState) {
    console.log('page change');
    console.log(event);
    this.queryParams.pagination.pageNumber = event.page ? event.page : 0;
    this.queryParams.pagination.pageSize = event.rows ? event.rows : 10;
    console.log(this.movies.length);
    this.getMovies();
  }
}
