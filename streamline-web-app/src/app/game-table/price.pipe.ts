import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  transform(value?: number): string {
    if (value) {
      const stringValue = value.toString();
      if (stringValue.match(/free to play|free/i)) {
        return value.toString();
      } else {
        return '£' + value.toString();
      }
    }
    return '';
  }
}
