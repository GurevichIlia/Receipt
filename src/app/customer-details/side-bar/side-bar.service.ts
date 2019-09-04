import { CustomerDetailsService } from './../customer-details.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  constructor(private customerDetailsService: CustomerDetailsService) { }

  getCustomerInfoById$() {
    return this.customerDetailsService.getCustomerDetailsByIdState$();
  }
  setCurrentMenuItem(menuItem: { route: string, childMenuItem: string }) {
    this.customerDetailsService.setCurrentMenuItem(menuItem);
  }
  setChildMenuItem(item: string) {
    this.customerDetailsService.setChildMenuItem(item);
  }

}
