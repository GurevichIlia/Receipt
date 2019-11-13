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
  constructor(public matDialogRef: MatDialogRef<SuggestExistingCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: CustomerMainInfo[] | MainDetails[] }
  ) { }

  ngOnInit() {
   this.data.customer[0];
  }

  close(){
    this.matDialogRef.close(false);
  }

  accept(){
    this.matDialogRef.close(true);
  }
}
