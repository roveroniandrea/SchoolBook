import { AbstractControl } from '@angular/forms';

export function ValidatorInteger(control: AbstractControl) {
  const onlyNumber = /^\d+$/.test(<string>control.value);
  if(!onlyNumber){
      return {isInteger : true};
  }
  else{
      return null;
  }
}
