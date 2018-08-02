export class Libro {
    titolo : string;
    prezzo: number;
    descrizione: string;
    id: string;
    isbn: string;
    data : any;
    id_utente : string;
    imageUrl : string;
    imagePath : string;

    constructor() {
        this.titolo = "";
        this.prezzo = 0;
        this.descrizione = "";
        this.id = "";
        this.id_utente = "";
        this.isbn = "";
        this.imageUrl = "";
        this.imagePath = "";
    }
}