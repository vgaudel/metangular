import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    let date: Date = new Date(value);
    let sec = Math.floor((Date.now()-date.getTime())/1000);
    if (sec<60) return `Il y a ${sec}s`;
    if (sec<3600) return `Il y a ${Math.floor(sec/60)}min`;
    if (sec<86400) return `Il y a ${Math.floor(sec/3600)}h`;
    return `Il y a ${Math.floor(sec/86400)}j`;
  }
}
