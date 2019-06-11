import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-modal-final-screen',
  templateUrl: './modal-final-screen.component.html',
  styleUrls: ['./modal-final-screen.component.css']
})
export class ModalFinalScreenComponent implements OnInit {
  title: string;
  text: string;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { resolve: string, res_description: string }
  ) {
    debugger
    this.title = data.resolve;
    this.text = data.res_description;
   }

  ngOnInit() {
  }

}
