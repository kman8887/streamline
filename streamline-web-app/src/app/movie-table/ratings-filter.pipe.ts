import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingsFilter',
})
export class RatingsFilterPipe implements PipeTransform {
  transform(values: number[] | undefined): string {
    if (values == undefined || (values[0] == 0 && values[1] == 10)) {
      return 'Any Rating';
    } else if (values[0] == values[1]) {
      return 'Rating: ' + values[0].toString();
    } else {
      return 'Rating: ' + values[0].toString() + ' to ' + values[1].toString();
    }
  }
}
