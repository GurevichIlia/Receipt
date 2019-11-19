import { AddressesService, Address } from './addresses.service';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FullCustomerDetailsById } from 'src/app/models/fullCustomerDetailsById.model';
import { Response } from 'src/app/models/response.model';
import { CustomerAddresses } from 'src/app/models/customer-info-by-ID.model';


@Component({
  selector: 'app-addresses-info',
  templateUrl: './addresses-info.component.html',
  styleUrls: ['./addresses-info.component.css'],
})
export class AddressesInfoComponent implements OnInit {
  @Input() mainInfoForm: FormGroup;
  customerAddresses: CustomerAddresses[];
  subscription$ = new Subject();
  loading = true;
  newEvent: { action: string, index?: number };

  constructor(private addressService: AddressesService) { }

  get addresses() {
    return this.mainInfoForm.get('addresses') as FormArray;
  }

  ngOnInit() {
    this.getCustomerAddresses();
  }

  getCustomerAddresses() {
    this.addressService.getCustomerDetailsByIdState$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((customerDetails: FullCustomerDetailsById) => {
        console.log('GOT CUSTOMER DETAILS', customerDetails);
        if (customerDetails) {
          this.customerAddresses = customerDetails.CustomerAddresses;
          this.createAddressInputsArray(this.addresses, this.customerAddresses);
          this.loading = false;
        }
      });
  }

  createAddressInputsArray(addressInputsArray: FormArray, customerAddress: CustomerAddresses[]) {
    this.addressService.createAddressInputsArray(addressInputsArray, customerAddress);
  }

  getAction(event: { action: string, index?: number }) {
    switch (event.action) {
      case 'addNewAddress': this.addAddressInput(this.addresses, event.index);
        break
      case 'deleteAddress': this.deleteAddress(this.addresses, event.index);
        break
      case 'saveAddress': this.saveAddress(this.addresses, event.index);
        break
      case 'editAddress': this.editAddress(this.addresses, event.index);
        break
    }

  }

  editAddress(array: FormArray, i) {
    this.addressService.enableFormControl(array.controls[i]);
  }

  saveAddress(array: FormArray, i) {
    const address: Address = array.controls[i].value;
    if (address.street !== '') {
      this.loading = true;
      this.addressService.saveAddressOnServer(address)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            this.loading = false;
            this.disableFormControl(array.controls[i]);
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
            this.addressService.updateCustomerInfo();
          } else if (response.Data.error === 'true') {
            console.log('RESPONSE ERROR', response.Data.res_description);
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          }
        },
          error => console.log(error));

    } else {
      alert('Please enter correct address');
      array.removeAt(i);
    }


  }

  addAddressInput(array: FormArray, i) {
    this.addressService.addAddress(array);
  }

  deleteAddress(array: FormArray, i) {
    const address: Address = array.controls[i].value;
    if (array.length === 1) {
      return;
    } else if (!address.addressId) {
      array.removeAt(i);
    } else if (confirm('Would you like to delete this field?')) {
      this.loading = true;
      this.addressService.deleteAddress(address)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            array.removeAt(i);
            this.loading = false;
            this.addressService.updateCustomerInfo();

            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          } else if (response.Data.error === 'true') {
            console.log('RESPONSE ERROR', response.Data.res_description);
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          }
        },
          error => console.log(error));
    }
  }

  disableFormControl(control: AbstractControl) {
    control.disable();
  }

  enableFormControl(control: AbstractControl) {
    control.enable();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.createAction({ action: 'saveAddress', subject: this.Address});
    this.subscription$.next();
    this.subscription$.complete();
  }
}