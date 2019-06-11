import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProductsByCat'
})
export class FilterProductsByCatPipe implements PipeTransform {

  transform(value: any, args?: number): any {
    if (args) {
      value = value.filter(data =>
        data.ProdCatId === args || data.ProjectCategoryId === args || data.groupId === args
      );
      console.log('PROJECT' , value);
      return value;
    } else {
      return null;
    }

  }

}
