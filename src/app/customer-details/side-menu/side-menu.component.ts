import { MainInfoService } from './../main-info/main-info.service';
import { FullCustomerDetailsById } from './../../models/fullCustomerDetailsById.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  _name: string;
  _email: string;
  _phone: string;
  pickedMenu: string;
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
  @Output() selectedRoute = new EventEmitter()

  constructor(private mainInfoService: MainInfoService) {
    
   }
  selectChildMenuItem(childMenuItem: string) {
    this.navigateTo('main-info');
    this.pickedMenu = childMenuItem;
    this.mainInfoService.setCurrentMenuItem(childMenuItem);
  }
  navigateTo(route: string) {
    this.selectedRoute.emit(route);
  }
}