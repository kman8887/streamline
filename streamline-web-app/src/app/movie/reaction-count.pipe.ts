import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reactionCount',
})
export class ReactionCountPipe implements PipeTransform {
  transform(value: string[] | undefined, ...args: unknown[]): unknown {
    if (value) {
      return value.length;
    } else {
      return 0;
    }
  }
}
