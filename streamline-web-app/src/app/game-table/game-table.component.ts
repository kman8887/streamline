import { Component, OnInit } from '@angular/core';
import { GamesService, GamesQueryParams } from '../services/games.service';
import { Game } from '../models/game';
import { PaginatorState } from 'primeng/paginator';
import {
  faWindows,
  faApple,
  faLinux,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.scss'],
})
export class GameTableComponent implements OnInit {
  games: Game[] = [];

  faWindows = faWindows;
  faApple = faApple;
  faLinux = faLinux;

  sortOptions = [
    { label: 'Review Count', value: 'review_count:-1' },
    { label: 'Price High to Low', value: 'priceSorting:-1' },
    { label: 'Price Low to High', value: 'priceSorting' },
    { label: 'Release Date', value: 'release_date:-1' },
    { label: 'Sentiment', value: 'sentiment' },
  ];

  genresFilterOptions: string[] = [];
  tagsFilterOptions: string[] = [];
  platformsFilterOptions = [
    { label: 'Mac', value: 'mac' },
    { label: 'Windows', value: 'windows' },
    { label: 'Linux', value: 'linux' },
  ];

  sortKey: string = '';

  totalRecords = 0;

  priceSliderValue = 70;

  queryParams: GamesQueryParams = {
    pagination: {
      pageNumber: 0,
      pageSize: 10,
    },
  };

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames(): void {
    this.gamesService.findGames(this.queryParams).subscribe((response) => {
      this.games = response.data;
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

    this.getGames();
  }

  onFilterChange() {
    console.log('filter change');
    this.getGames();
  }

  onPriceFilterChange(event: any) {
    console.log(event);
    if (this.priceSliderValue >= 70) {
      this.queryParams.price = undefined;
    } else {
      this.queryParams.price = this.priceSliderValue;
    }
    this.getGames();
  }

  onDateSelectChange(event: any) {
    this.getGames();
  }

  getSeverity(game: Game): string | undefined {
    switch (game.sentiment) {
      case 'Overwhelmingly Positive':
        return 'over-pos';

      case 'Very Positive':
        return 'very-pos';

      case 'Mostly Positive':
        return 'most-pos';

      case 'Mixed':
        return 'mixed';

      default:
        return undefined;
    }
  }

  onPageChange(event: PaginatorState) {
    console.log('page change');
    console.log(event);
    this.queryParams.pagination.pageNumber = event.page ? event.page : 0;
    this.queryParams.pagination.pageSize = event.rows ? event.rows : 10;
    console.log(this.games.length);
    this.getGames();
  }
}
