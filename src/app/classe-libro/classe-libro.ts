import { Data } from "@angular/router";

export class Libro {
    titolo : string;
    prezzo: number;
    descrizione: string;
    id: string;
    isbn: string;
    data : Data;
    constructor() {
        this.titolo = "";
        this.prezzo = 0;
        this.descrizione = "";
        this.id = "";
    }
}