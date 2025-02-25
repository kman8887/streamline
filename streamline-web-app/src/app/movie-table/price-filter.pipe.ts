import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFilter',
})
export class PriceFilterPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (value == 70) {
      return 'Any Price';
    } else if (value) {
      return 'Under £' + value.toString();
    } else {
      return 'Free';
    }
  }
}
