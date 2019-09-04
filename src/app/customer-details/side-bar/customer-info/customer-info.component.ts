import { Component, OnInit, Input } from '@angular/core';
import { FullCustomerDetailsById } from 'src/app/models/fullCustomerDetailsById.model';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {
  _name: string;
  _email: string;
  _phone: string;
  @Input() set customerDetailsById(customerDetailsById: FullCustomerDetailsById) {
    if (customerDetailsById !== null) {
      this._name = customerDetailsById.CustomerCard_MainDetails.length !== 0 ?
        customerDetailsById.CustomerCard_MainDetails[0].FileAs :
        '';
      this._email = customerDetailsById.CustomerEmails.length !== 0 ?
        customerDetailsById.CustomerEmails[0].Email :
        '';
      this._phone = customerDetailsById.CustomerMobilePhones.length !== 0 ?
        customerDetailsById.CustomerMobilePhones[0].PhoneNumber :
        '';
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
