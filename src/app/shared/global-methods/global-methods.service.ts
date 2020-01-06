import { GeneralSrv } from './../services/GeneralSrv.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';




@Injectable({
  providedIn: 'root'
})
export class GlobalMethodsService {

  constructor(
    private toastr: ToastrService,
    private generalService: GeneralSrv

  ) { }

  changeDateFormat(date: string, format: string) {
    if (date) {
      return moment(date).format(format);
    }

  }

  validateTZ(str) {
    // DEFINE RETURN VALUES
    let R_ELEGAL_INPUT = -1;
    let R_NOT_VALID = this.generalService.language.getValue() === 'he' ? 'מספר ת.ז לא חוקי' : 'TZ is not valid';
    let R_VALID = this.generalService.language.getValue() === 'he' ? 'מספר ת.ז  חוקי' : 'TZ is valid';


    //INPUT VALIDATION
    // Just in case -> convert to string
    let IDnum = String(str);

    // Validate correct input
    if ((IDnum.length > 9) || (IDnum.length < 5))
      return R_ELEGAL_INPUT;
    if (isNaN(+IDnum))
      return R_ELEGAL_INPUT;

    // The number is too short - add leading 0000
    if (IDnum.length < 9) {
      while (IDnum.length < 9) {
        IDnum = '0' + IDnum;
      }
    }

    // CHECK THE ID NUMBER
    var mone = 0, incNum;
    for (var i = 0; i < 9; i++) {
      incNum = Number(IDnum.charAt(i));
      incNum *= (i % 2) + 1;
      if (incNum > 9)
        incNum -= 9;
      mone += incNum;
    }
    if (mone % 10 == 0) {
      this.toastr.success('',  R_VALID)
      return R_VALID;
    }

    else {
      this.toastr.warning('', R_NOT_VALID)
      return R_NOT_VALID;
    }

  }

}


