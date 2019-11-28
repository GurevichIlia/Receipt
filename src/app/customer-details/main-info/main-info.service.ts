import { BehaviorSubject, Observable } from 'rxjs';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { CustomerAddresses } from './../../models/customer-info-by-ID.model';
import { CustomerPhones, CustomerEmails, MainDetails } from './../../models/fullCustomerDetailsById.model';
import { CustomerDetailsService } from './../customer-details.service';
import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { CustomerTitle } from 'src/app/models/globalData.model';


@Injectable({
  providedIn: 'root'
})
export class MainInfoService {
  // phoneInputsArray = new BehaviorSubject<FormArray>(null);
  // phoneInputsArray$ = this.phoneInputsArray.asObservable();

  constructor(
    private customerDetailsService: CustomerDetailsService,
    private fb: FormBuilder,
    private generalSevice: GeneralSrv
  ) { }

  getCustomerDetailsByIdState$() {
    return this.customerDetailsService.getCustomerDetailsByIdState$();
  }

  getCustomerDetailsByIdState(){
    return this.customerDetailsService.getCustomerDetailsByIdState();
  }

  getGlobalData$() {
    return this.customerDetailsService.getGlobalData$();
  }


  // patchInputValue(inputsArray: FormArray | FormGroup, valueArray: CustomerPhones[] | CustomerEmails[] | CustomerAddresses[] | MainDetails[], addNewInputFunction?: Function, formBuilder?: FormBuilder) {
  //   let controlsKeys;
  //   if (valueArray.length > 0) {
  //     // если массив значений для инпутов не пустой, запуска. цикл для извлечения нужных значений.
  //     for (let i = 0; i < valueArray.length; i++) {

  //       if (inputsArray instanceof FormArray) {

  //         //создаю массив с названиями ключей на основании пришедшего FormArray.
  //         controlsKeys = Object.keys(inputsArray.controls[0]['controls']);
  //         // каждый ключ использую как имя при инизиализации импута и получаю в него значение по такому же ключу.
  //         controlsKeys.forEach((key: string) => {
  //           // изменяю стиль написания ключа, потому что в приходящих данных везде первая буква большая а название инпута в форме с маленькой, кроме fname и lname
  //           const arrKey = key.toLowerCase();
  //           // (key === 'lname' || key === 'fname') ? key : key[0].toUpperCase() + key.substring(1);
  //           // обновляю массив FormArray c объектами в которых инпуты.
  //           if (i < 10) {
  //             inputsArray.controls[i].patchValue({
  //               [key]: valueArray[i][arrKey],
  //               deleteRow: 0,
  //             })
  //           }
  //         })
  //       } else if (inputsArray instanceof FormGroup) {
  //         //создаю массив с названиями ключей на основании пришедшего FormGroup.
  //         controlsKeys = Object.keys(inputsArray.controls);
  //         // каждый ключ использую как имя при инизиализации импута и получаю в него значение по такому же ключу.
  //         controlsKeys.forEach(key => {
  //           // изменяю стиль написания ключа, потому что в приходящих данных везде первая буква большая а название инпута в форме с маленькой, кроме fname и lname
  //           const arrKey = (key === 'lname' || key === 'fname') ? key : key[0].toUpperCase() + key.substring(1);
  //           // добавляю значения в объектe FormGroup с инпутами
  //           if (i < 10) {
  //             inputsArray.patchValue({
  //               [key]: valueArray[i][arrKey]
  //             })
  //           } else {
  //             return
  //           }

  //         })
  //       }
  //       if (valueArray.length > i + 1) {
  //         // если в массиве значений для инпутов больше чем 1 объект, создаю еще один инпут.
  //         addNewInputFunction(inputsArray, formBuilder)
  //       } else {
  //         break;
  //       }
  //     }
  //   } else {
  //     // если массив с значения для инпута пустой, дабвляю дефолтные значения(пустая строка).
  //     controlsKeys = Object.keys(inputsArray.controls);
  //     controlsKeys.forEach(key => {
  //       inputsArray.controls[0].patchValue({
  //         [key]: ''
  //       })
  //     })
  //   }
  //   return inputsArray;
  // }

  removeEmptyControl(array: FormArray, key: string) {
    for (let i = array.value.length - 1; i > 0; i--) {
      if (array.value.length > 1) {
        if (array.value[i][key] === '') {
          array.removeAt(i);
        }
      }
    }
  }

  createNewObjectWithLowerCaseObjectKeys(object: any) {
    let newObject = <any>{};
    for (let key in object) {
      const lowerKey = key.toLowerCase();
      newObject[lowerKey] = object[key]
    }
    // console.log(newObject)
    return newObject;
  }

  deletePhone(array: FormArray, i) {
    if (array.length === 1) {
      return;
    } else if (confirm('Would you like to delete this field?')) {
      array.controls[i].value.deleteRow = 1;
      this.saveChangedCustomerData({ phones: [array.value[i]] })
      array.removeAt(i);
    }
  }

  deleteEmail(array: FormArray, i) {
    if (array.length === 1) {
      return;
    } else if (confirm('Would you like to delete this field ?')) {
      array.controls[i].value.deleteRow = 1;
      this.saveChangedCustomerData({ emails: [array.value[i]] })
      array.removeAt(i);
    }
  }

  deleteAddress(array: FormArray, i) {
    if (array.length === 1) {
      return;
    } else if (confirm('Would you like to delete this field?')) {
      array.controls[i].value.deleteRow = 1;
      this.saveChangedCustomerData({ addresses: [array.value[i]] })
      array.removeAt(i);
    }
  }

  // deleteControl(array: FormArray, i) {
  //   if (array.length === 1) {
  //     return;
  //   } else {
  //     array.removeAt(i);
  //   }
  //   if (confirm('Would you like delete this?')) {
  //     array.controls[i].value.deleteRow = 1;
  //     this.saveChangedCustomerData({ phones: [array.value[i]] })
  //     console.log('DELETED PHONE', array.value[i]);

  //   }

  // }

  changeDateFormat(date: string, format: string) {
    return this.generalSevice.changeDateFormat(date, format);
  }

  getCurrentChildMenuItem$() {
    return this.customerDetailsService.getChildMenuItem$()
  }

  customerTitleAutoComplete(filteredSubject: CustomerTitle[], titleInput: AbstractControl, filterKey: string) {
    return this.generalSevice.formControlAutoComplete(filteredSubject, titleInput, filterKey);
  }

  saveChangedCustomerData(newCustomerData) {
    return this.customerDetailsService.saveChangedCustomerData(newCustomerData);
  }

  updateCustomerInfo() {
    this.customerDetailsService.updateCustomerInfo();
  }

  getDisplayWidth$() {
    return this.customerDetailsService.getDisplayWidth();
  }
  // setPhoneInputsArray(inputsArray: FormArray) {
  //   this.phoneInputsArray.next(inputsArray)
  // }

  // getPhoneInputsArrayValue(): FormArray {
  //   return this.phoneInputsArray.getValue();
  // }

  // getPhoneInputsArray$(): Observable<FormArray> {
  //   return this.phoneInputsArray$;
  // }
}
