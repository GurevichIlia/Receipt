import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-purchases',
  templateUrl: './confirm-purchases.component.html',
  styleUrls: ['./confirm-purchases.component.css']
})
export class ConfirmPurchasesComponent {
  question: string

  constructor(
    public dialogRef: MatDialogRef<ConfirmPurchasesComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  string ) {
    this.getQustion();
  }
  getQustion() {
    this.question = this.data;
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
