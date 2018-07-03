import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {

  constructor() { }

  hasOnlyNumber(stringa){
    return /^\d+$/.test(stringa);
  }
}
