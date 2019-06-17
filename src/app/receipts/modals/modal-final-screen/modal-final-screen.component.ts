import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FinalResolve } from 'src/app/models/finalResolve.model';


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
    @Inject(MAT_DIALOG_DATA) public data: FinalResolve,
  ) {
    this.title = data.credit_msg;
 
  }

  ngOnInit() {
  }

}
// credit_dealnumber: "42393881"
// credit_msg: "עסקה בוצעה בהצלחה"
// credit_res: "ok"
// cusomerid: "3019"
// link: "http://createpays.amax.co.il/CreatesessionReceipt.aspx?oid=&orgid=153&orgname=jaffanet1&RecieptType=10&Currency=NIS&forprint=1"
// res: "error"