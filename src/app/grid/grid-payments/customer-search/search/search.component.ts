import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @Input() searchControl: FormControl;
  @Input() filteredOptions: any[];
  @Output() pickedCustomer: EventEmitter<number> = new EventEmitter();
  @Output() newCustomer: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  pickCustomer(customerId: number) {
    this.pickedCustomer.emit(customerId);
  }
  newCustomerIsClicked() {
    this.newCustomer.emit();

  }
}
