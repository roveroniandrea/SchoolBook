import { Injectable } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';

@Injectable({
  providedIn: 'root'
})
export class LibroUrlService {
  private defaultUrl = "https://firebasestorage.googleapis.com/v0/b/school-book-an.appspot.com/o/default-image.png?alt=media&token=ea83a616-2ed6-4433-a4df-c1a37973332e";
  constructor() { }

  setLibroUrl(libro : Libro) : Libro{
    if(!libro.imageUrl){
      libro.imageUrl = this.defaultUrl;
    }
    return libro;
  }
}
