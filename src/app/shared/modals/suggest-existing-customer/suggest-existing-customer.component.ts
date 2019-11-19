import { Component, OnInit, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerMainInfo } from 'src/app/models/customermaininfo.model';

@Component({
  selector: 'app-suggest-existing-customer',
  templateUrl: './suggest-existing-customer.component.html',
  styleUrls: ['./suggest-existing-customer.component.css']
})
export class SuggestExistingCustomerComponent implements OnInit {
  customerInfo: MainDetails
  constructor(public matDialogRef: MatDialogRef<SuggestExistingCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: MainDetails[] }
  ) { }

  ngOnInit() {
    this.customerInfo = this.data.customer[0];
    console.log(this.customerInfo)
  }

  close() {
    this.matDialogRef.close(false);
  }

  accept() {
    this.matDialogRef.close(true);
  }
}
