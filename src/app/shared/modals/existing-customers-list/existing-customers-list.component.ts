import { Component, OnInit, Inject } from '@angular/core';

import { CustomerSearchData } from 'src/app/shared/services/GeneralSrv.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalEventsService } from 'src/app/core/services/global-events.service';

@Component({
  selector: 'app-existing-customers-list',
  templateUrl: './existing-customers-list.component.html',
  styleUrls: ['./existing-customers-list.component.css']
})
export class ExistingCustomersListComponent implements OnInit {
  foundedExistingCustomers: CustomerSearchData[]
  constructor(
    private dialogRef: MatDialogRef<ExistingCustomersListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerSearchData[],
    private globalEventsService: GlobalEventsService
  ) { }

  ngOnInit() {
    this.foundedExistingCustomers = this.data;
  }

  useCustomerIdForCustomerInfo(customerId: number) {
    this.globalEventsService.setCustomerIdForSearch(customerId);
    this.dialogRef.close();
    this.globalEventsService.setCustomerIdForSearch(null);
  }

}
