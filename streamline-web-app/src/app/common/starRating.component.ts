import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './starRating.component.html',
  styleUrl: './starRating.component.scss',
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Rating on a 0-10 scale
  @Input() readOnly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [2, 4, 6, 8, 10];
  selectedRating = 0;

  constructor() {}

  selectStar(event: MouseEvent, star: number): void {
    if (this.readOnly) {
      return;
    }
    const starElement = event.target as HTMLElement;
    const boundingRect = starElement.getBoundingClientRect();
    const clickX = event.clientX - boundingRect.left;
    const starWidth = boundingRect.width;

    const isHalfStar = clickX < starWidth / 2;

    this.selectedRating = isHalfStar ? star - 1 : star;

    this.rating = this.selectedRating;
    this.ratingChange.emit(this.rating);
  }
}
