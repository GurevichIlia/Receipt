import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-customer-groups',
  templateUrl: './customer-groups.component.html',
  styleUrls: ['./customer-groups.component.css']
})
export class CustomerGroupsComponent implements OnInit {

  constructor(
    private MatDialogRef: MatDialogRef<CustomerGroupsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}) { }

  ngOnInit() {
  }

  close() {
    console.log('Test close')
  }
  accept() {
    console.log('Test confirm')
  }
}
