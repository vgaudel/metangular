import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclamation',
})
export class ExclamationPipe implements PipeTransform {
  transform(value: string, nb: number = 1): string {
    if(!value){
      return '';
    } else {
      return value + '!'.repeat(nb);
    }
  }
}
