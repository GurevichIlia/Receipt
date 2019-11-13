import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GlobalMethodsService {

  constructor() { }

  changeDateFormat(date: string, format: string) {
    if (date) {
      return moment(date).format(format);
    }

  }

}
