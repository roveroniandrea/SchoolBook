import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {

  constructor() { }

  /**
 * Controlla se la stringa passata contiene solo numeri, utile per sapere se è isbn o titolo
 * @param stringa La stringa da controllare, che altro? @return booleano
 */
  hasOnlyNumber(stringa) {
    return /^\d+$/.test(stringa);
  }
  
}
