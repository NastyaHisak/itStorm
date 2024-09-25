import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText'
})
export class ShortTextPipe implements PipeTransform {

  transform(value: string): string {
    return  value.length <=82 ? value : `${value.slice(0, 82)}...`
  }

}
