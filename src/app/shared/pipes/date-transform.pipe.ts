import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

const headersOfDateForTransform: string[] = [
  'מועד התחלה',
  'שימוש פנימי\ סיום',
  'תאריך פתיחה',
  'חיוב אחרון',
  'תאריך יצירה',
  'chargedate',
  'CloseDate',
  'ValueDate',
  'RecieptDate',
  'Date',
  'RowDate',
  'LastUpdate',


]

@Pipe({
  name: 'dateTransform'
})
export class DateTransformPipe implements PipeTransform {

  transform(date: string, coloumnHeader?: any): any {
    if (date && date !== 'undefined') {
      if (headersOfDateForTransform.includes(coloumnHeader)) {
        date = moment(date).format('DD/MM/YYYY');
      }
      if (coloumnHeader === 'lastWriteTime'){
        date = moment(date).format('DD/MM/YYYY HH:mm:ss')
      }
      // switch (coloumnHeader) {
      //   case headersOfDateForTransform.find(coloumnHeader): date = moment(date).format('DD/MM/YYYY');
      //     break;
      // case 'שימוש פנימי\ סיום': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'תאריך פתיחה': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'חיוב אחרון': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'תאריך ביטול': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'תאריך יצירה': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'chargedate': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'CloseDate': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'ValueDate': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'RecieptDate': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'Date': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'RowDate': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // case 'LastUpdate': date = moment(date).format('DD/MM/YYYY');
      //   break;
      // }
    } else {
      date = ''
    }


    return date;
  }

}
