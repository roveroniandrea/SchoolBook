import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit {
  @Input() libro: Object;   //@Input specifica che input è un valore passato da un altro component (il padre)
  constructor() {}

  ngOnInit() {
  }

}
