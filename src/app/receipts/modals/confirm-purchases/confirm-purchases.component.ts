import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-purchases',
  templateUrl: './confirm-purchases.component.html',
  styleUrls: ['./confirm-purchases.component.css']
})
export class ConfirmPurchasesComponent {


  constructor(public dialogRef: MatDialogRef<ConfirmPurchasesComponent>) {
   }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
