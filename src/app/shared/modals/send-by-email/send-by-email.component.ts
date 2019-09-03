import { CustomerEmails } from 'src/app/models/fullCustomerDetailsById.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-send-by-email',
  templateUrl: './send-by-email.component.html',
  styleUrls: ['./send-by-email.component.css']
})
export class SendByEmailComponent implements OnInit {
  counter = 0;
  
  constructor(
    public dialogRef: MatDialogRef<SendByEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public emailsList: CustomerEmails[]

  ) {}

  plusCount() {
    if (this.counter < this.emailsList.length - 1) {
      this.counter++
    } else {
      this.counter = 0
    }

  }
  minusCount() {
    if (this.counter > 0) {
      this.counter--
    } else {
      this.counter = this.emailsList.length - 1
    }

  }
  ngOnInit() {
    this.emailsList
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
