import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';




@Component({
  selector: 'app-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFilterComponent {
  @Input() filterForm: FormGroup;
  @Input() globalData: object;
  @Output() filterValue: EventEmitter<string> = new EventEmitter();
  @Output() showPayments: EventEmitter<void> = new EventEmitter();
  @Output() paymentType: EventEmitter<void> = new EventEmitter();
  constructor(
  ) { }

  applyFilter($event) {
    this.filterValue.emit($event);
  }
  showFilteredPayments() {
    this.showPayments.emit();
  }
  setPaymentType($event) {
    this.paymentType.emit($event);
  }
}
