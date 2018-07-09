import { Injectable } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';

@Injectable({
  providedIn: 'root'
})
export class LibroUrlService {
  private defaultUrl = "https://firebasestorage.googleapis.com/v0/b/school-book-an.appspot.com/o/LibroSfondo.png?alt=media&token=ec0319a8-e7ee-452f-ae15-5f50a8cd6a8f";
  
  constructor() { }

  setLibroUrl(libro : Libro) : Libro{
    if(!libro.imageUrl){
      libro.imageUrl = this.defaultUrl;
    }
    return libro;
  }
}
