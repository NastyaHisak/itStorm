import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
export class DatePipePipe implements PipeTransform {

  transform(value: string): string {
    let originalDate = value;
    let date = new Date(originalDate);
    let formattedDate = `${("0" + date.getUTCDate()).slice(-2)}.${("0" + (date.getUTCMonth() + 1)).slice(-2)}.${date.getUTCFullYear()} ${("0" + date.getUTCHours()).slice(-2)}:${("0" + date.getUTCMinutes()).slice(-2)}`;
    return formattedDate;
  }

}
