import { Injectable } from '@angular/core';
import { Libro } from '../classe-libro/classe-libro';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { AngularFireStorage } from '../../../node_modules/angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class LibroUrlService {
  public defaultUrl = "https://firebasestorage.googleapis.com/v0/b/school-book-an.appspot.com/o/LibroSfondo.png?alt=media&token=f748c782-2955-4c9f-97f9-ba61ba7d0a1b";

  constructor(private db: AngularFirestore, private storage : AngularFireStorage) { }

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
    let database = this.db;
    let storageFirebase = this.storage
    return new Promise(function (resolve, reject) {
      database.collection("books").doc(id).delete()
      .catch(err=>reject(Error("Errore cancellazione: "+err)))
      .then(res=>{
        if(pathImmagine){
          storageFirebase.ref(pathImmagine).delete().subscribe(res=>{
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
