import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-perdita-modifiche',
  templateUrl: './perdita-modifiche.component.html',
  styleUrls: ['./perdita-modifiche.component.css']
})
export class PerditaModificheComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PerditaModificheComponent>) { }

  ngOnInit() {
  }

  chiudiDialog(result){
    this.dialogRef.close(result);
  }
}
