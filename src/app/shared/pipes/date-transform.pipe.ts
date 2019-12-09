import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateTransform'
})
export class DateTransformPipe implements PipeTransform {

  transform(date: string, coloumnHeader?: any): any {

    switch (coloumnHeader) {
      case 'מועד התחלה': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'שימוש פנימי\ סיום': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'תאריך פתיחה': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'חיוב אחרון': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'תאריך ביטול': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'תאריך יצירה': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'chargedate': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'CloseDate': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'ValueDate': date = moment(date).format('DD/MM/YYYY');
        break;
      case 'RecieptDate': date = moment(date).format('DD/MM/YYYY');
        break;
        case 'Date': date = moment(date).format('DD/MM/YYYY');
        break;
    }

    return date;
  }

}
