import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  templateUrl: './starRating.component.html',
  styleUrl: './starRating.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true,
    },
  ],
})
export class StarRatingComponent implements ControlValueAccessor {
  @Input() rating: number = 0; // Rating on a 0-10 scale
  @Input() readOnly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [2, 4, 6, 8, 10];
  selectedRating = 0;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  private isControlledByForm = false;

  writeValue(value: number): void {
    this.rating = value || 0;
    this.isControlledByForm = true;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.readOnly = isDisabled;
  }

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

    if (this.isControlledByForm) {
      this.onChange(this.rating);
      this.onTouched();
    }
  }
}
