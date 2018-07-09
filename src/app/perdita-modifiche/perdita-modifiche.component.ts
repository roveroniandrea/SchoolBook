import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  titolo: string;
  descrizione: string;
}

@Component({
  selector: 'app-perdita-modifiche',
  templateUrl: './perdita-modifiche.component.html',
  styleUrls: ['./perdita-modifiche.component.css']
})
export class PerditaModificheComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PerditaModificheComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  chiudiDialog(result){
    this.dialogRef.close(result);
  }
}
