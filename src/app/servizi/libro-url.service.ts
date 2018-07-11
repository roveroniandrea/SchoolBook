import { Injectable } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';

@Injectable({
  providedIn: 'root'
})
export class LibroUrlService {
  public defaultUrl = "https://firebasestorage.googleapis.com/v0/b/school-book-an.appspot.com/o/LibroSfondo.png?alt=media&token=f748c782-2955-4c9f-97f9-ba61ba7d0a1b";
  
  constructor() { }

  setLibroUrl(libro : Libro) : Libro{
    if(!libro.imageUrl){
      libro.imageUrl = this.defaultUrl;
    }
    return libro;
  }
}
