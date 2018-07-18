import { Injectable } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { AngularFireStorage } from '../../../node_modules/angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class LibroUrlService {
  public defaultUrl = "https://firebasestorage.googleapis.com/v0/b/school-book-an.appspot.com/o/LibroSfondo.png?alt=media&token=f748c782-2955-4c9f-97f9-ba61ba7d0a1b";

  constructor(private database: AngularFirestore, 
    private storage : AngularFireStorage) { }

  setLibroUrl(libro: Libro): Libro {
    if (!libro.imageUrl) {
      libro.imageUrl = this.defaultUrl;
    }
    return libro;
  }

  /**
   * Elimina il libro e la sua foto. è una promessa (inteso Promise). pathImmagine è opzionale
   * @param id 
   * @param pathImmagine 
   */
  eliminaLibro(id, pathImmagine?) {
    let _self = this;
    return new Promise(function (resolve, reject) {
      _self.database.collection("books").doc(id).delete()
      .catch(error =>
        reject(Error("Errore cancellazione: "+error))
      )
      .then(res=>{
        if(pathImmagine){
          _self.storage.ref(pathImmagine).delete().subscribe(res=>{
            resolve("Eliminato libro e foto");
          })
        }
        else{
          resolve("Eliminato libro (foto non presente)");
        }
      })
    });
  }

}
