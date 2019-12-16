import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { debounceTime, switchMap, map, tap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  constructor() { }

  autocomplete(arrayForFilter$: Observable<any[]>, formControl: AbstractControl, filterKey: string) {
    return this.formControlAutoComplete(
      // this.generalService.getCities$(),
      arrayForFilter$,
      formControl, filterKey)
    // .pipe(
    //   // tap(city => console.log('CITIES FILTERED', city))
    //   )
    // return this.filtredArray$.pipe(tap(city => console.log('CITIES FILTERED' ,city)))
  }


  formControlAutoComplete(filterList: Observable<any[]>, searchControl: AbstractControl, filterKey) {
    const filteredOptions$ = searchControl.valueChanges
      .pipe(
        // tap(value => console.log('VALUE IN INPUT', value)),
        switchMap((value: string) => filterList
          .pipe(

            map(objects => objects
              .filter(someObject => someObject[filterKey].toLowerCase().includes(value.toLowerCase()))))
        ),
      );
    return filteredOptions$;
  }

}
