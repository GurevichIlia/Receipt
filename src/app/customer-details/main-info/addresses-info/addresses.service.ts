import { CustomerAddresses } from 'src/app/models/customer-info-by-ID.model';
import { Injectable } from '@angular/core';
import { FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MainInfoService } from '../main-info.service';
import { CustomerTitle } from 'src/app/models/globalData.model';

export interface Address {
  cityName: string;
  street: string;
  street2: string;
  zip: string;
  addressTypeId: string;
  addressId: string;
  remark: string;
  mainaddress: string;
  stateid: string;
  deleteRow: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  
  constructor(
    private fb: FormBuilder,
    private mainInfoService: MainInfoService

  ) { }


  getCustomerDetailsByIdState$() {
    return this.mainInfoService.getCustomerDetailsByIdState$();
  }



  createAddressInputsArray(addressInputsArray: FormArray, customerAddresss: CustomerAddresses[]) {
    console.log('METHOD IS STARTED');
    addressInputsArray.controls = []; // Очищаю массив потому что какого то хуя вызывается этот метод дважды. Пока не понял почему.
    if (customerAddresss.length > 0) {
      for (let i = 0; i < customerAddresss.length; i++) {
        this.addAddress(addressInputsArray);
        this.disableFormControl(addressInputsArray.controls[i]);
        if (i < 10) {
          addressInputsArray.controls[i].patchValue({
            cityName: customerAddresss[i].CityName,
            street: customerAddresss[i].Street,
            street2: customerAddresss[i].Street2,
            zip: customerAddresss[i].Zip,
            addressTypeId: customerAddresss[i].AddressTypeId,
            addressId: customerAddresss[i].AddressId,
            remark: customerAddresss[i].remark,
            mainaddress: customerAddresss[i].MainAddress,
            stateid: customerAddresss[i].StateId,
            deleteRow: ''
          })
          // addressInputsArray.controls[i].setValidators(Validators.required);
          // addressInputsArray.controls[i].updateValueAndValidity();
          console.log(addressInputsArray.value)
        }
      }
    }
    console.log('ADDRESS ARRAY FROM Address SERVICE', addressInputsArray);
  }


  addAddress(array: FormArray) {
    if (array.length < 10) {
      array.push(this.fb.group({
        cityName: ['', Validators.required],
        street: ['', Validators.required],
        street2: [''],
        zip: [''],
        addressTypeId: [''],
        addressId: [''],
        remark: [''],
        mainaddress: [''],
        stateid: [''],
        deleteRow: ['']
      }))
    }
  }

  deleteAddress(address: Address) {
    address.deleteRow = 1; // Чтобы удалился объект deletRow должно быть равно 1;
    return this.mainInfoService.saveChangedCustomerData({ addresses: [address] })
  }

  saveAddressOnServer(address: Address) {
    return this.mainInfoService.saveChangedCustomerData({ addresses: [address] });
  }

  disableFormControl(control: AbstractControl) {
    control.disable();
  }

  enableFormControl(control: AbstractControl) {
    control.enable();
  }

  updateCustomerInfo(){
    this.mainInfoService.updateCustomerInfo();
  }
}
