import { takeUntil, distinctUntilChanged, take } from 'rxjs/operators';
import { FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { AutocompleteService } from './autocomplete.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AutocompleteService]
})
export class AutocompleteComponent{
  @Input() placeHolder: string = '';
  @Input() isRequired: boolean = false;
  @Input() filterKeyWord: string;
  @Input() autoFormControl: FormControl;
  @Input() arrayForFilter$: Observable<any[]>;

  // filtredArray$: Observable<any>

  filtredList = [];
  constructor(private autocompleteService: AutocompleteService) { }

  filterArray() {
    this.autocompleteService.autocomplete(this.arrayForFilter$, this.autoFormControl, this.filterKeyWord)
      .pipe(
        take(1),
      )
      .subscribe(filtredList => {
        this.filtredList = filtredList
      }, err => console.log(err), () => console.log('COMPLETE'))
  }

}
