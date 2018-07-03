import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(stringa: string, numLettere:number): string {
    let result = stringa;
    if(stringa.length>numLettere){
      result = stringa.slice(0,numLettere);
      result += "...";
    }
    return result;
  }

}
