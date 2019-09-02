import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { CustomerAddresses } from './../../models/customer-info-by-ID.model';
import { CustomerPhones, CustomerEmails, MainDetails } from './../../models/fullCustomerDetailsById.model';
import { CustomerDetailsService } from './../customer-details.service';
import { Injectable } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MainInfoService {
  currentMenuItem = new BehaviorSubject<string>('personalInfo');
  currentMenuItem$ = this.currentMenuItem.asObservable();
  constructor(
    private customerDetailsService: CustomerDetailsService,
    private fb: FormBuilder,
    private generalSevice: GeneralSrv
  ) { }

  getMainInfo() {
    return this.customerDetailsService.getCustomerDetailsByIdState$();
  }
  getGlobalData$() {
    return this.customerDetailsService.getGlobalData$();
  }

  patchInputValue(inputsArray: FormArray | FormGroup, valueArray: CustomerPhones[] | CustomerEmails[] | CustomerAddresses[] | MainDetails[], addNewInputFunction?: Function, formBuilder?: FormBuilder) {
    let controlsKeys;
    if (valueArray.length > 0) {
      // если массив значений для инпутов не пустой, запуска. цикл для извлечения нужных значений.
      for (let i = 0; i < valueArray.length; i++) {
        if (inputsArray instanceof FormArray) {
          //создаю массив с названиями ключей на основании пришедшего FormArray.
          controlsKeys = Object.keys(inputsArray.controls[0]['controls']);
          // каждый ключ использую как имя при инизиализации импута и получаю в него значение по такому же ключу.
          controlsKeys.forEach(key => {
            // обновляю массив FormArray c объектами в которых инпуты.
            inputsArray.controls[i].patchValue({
              [key]: valueArray[i][key]
            })
          })
        } else if (inputsArray instanceof FormGroup) {
          //создаю массив с названиями ключей на основании пришедшего FormGroup.
          controlsKeys = Object.keys(inputsArray.controls);
          // каждый ключ использую как имя при инизиализации импута и получаю в него значение по такому же ключу.
          controlsKeys.forEach(key => {
            // добавляю значения в объектe FormGroup с инпутами
            inputsArray.patchValue({
              [key]: valueArray[i][key]
            })
          })
        }
        if (valueArray.length > i + 1) {
          // если в массиве значений для инпутов больше чем 1 объект, создаю еще один инпут.
          addNewInputFunction(inputsArray, formBuilder)
        } else {
          break;
        }
      }
    } else {
      // если массив с значения для инпута пустой, дабвляю дефолтные значения(пустая строка).
      controlsKeys = Object.keys(inputsArray.controls);
      controlsKeys.forEach(key => {
        inputsArray.controls[0].patchValue({
          [key]: ''
        })
      })
    }
  }
  removeEmptyControl(array: FormArray) {
    for (let i = array.value.length - 1; i > 0; i--) {
      if (array.value.length > 1) {
        if (array.value[i].PhoneNumber === '') {
          array.removeAt(i);
        }
      }
    }
  }
  changeDateFormat(date: string, format: string) {
    return this.generalSevice.changeDateFormat(date, format);
  }
  setCurrentMenuItem(menuItem: string) {
    this.currentMenuItem.next(menuItem);
  }
  getCurrentMenuItem$() {
    return this.currentMenuItem$;
  }

}
