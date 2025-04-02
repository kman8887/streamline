import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'people',
})
export class PeoplePipe implements PipeTransform {
  transform(value: string[], ...args: unknown[]): unknown {
    if (value) {
      return value.join(', ');
    } else {
      return '';
    }
  }
}
