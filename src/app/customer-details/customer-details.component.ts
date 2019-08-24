import { CustomerDetailsService } from './customer-details.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  constructor(
    private customerSetailsService: CustomerDetailsService
  ) { }

  ngOnInit() {
    this.getCustomerDetailsById(1);
  }
  getCustomerDetailsById(customerId: number) {
    this.customerSetailsService.getCustomerDetailsById(customerId).subscribe(data => {
      console.log('RESPONSE CUST BY ID', data)
    })
  }
}
