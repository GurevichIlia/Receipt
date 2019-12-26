import { PaymentsService } from './../../../payments.service';
import { GlobalData } from '../../../../models/globalData.model';
import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFilterComponent {
  windowWidth: number;
  @Input() filterForm: FormGroup;
  @Input() globalData: GlobalData;
  // @Output() filterValue: EventEmitter<string> = new EventEmitter();
  // @Output() filterValueByDay: EventEmitter<string> = new EventEmitter();
  @Output() showPayments: EventEmitter<void> = new EventEmitter();
  @Output() paymentType: EventEmitter<void> = new EventEmitter();
  @Output() kevaChargesClicked: EventEmitter<void> = new EventEmitter();
  constructor(
    private paymentsService: PaymentsService,
  ) {
    this.windowWidth = window.innerWidth;
    console.log( ' this.windowWidth', this.windowWidth)
  }
  applyFilter(filterValue: string) {
    this.paymentsService.setFilterValue(filterValue);
  }
  applyFilterByDay(filterValue: string) {
    this.paymentsService.setFilterValueByDay(filterValue);
  }
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }
  // applyFilter($event) {
  //   this.filterValue.emit($event);
  // }
  showFilteredPayments() {
    this.showPayments.emit();
  }
  setPaymentType($event) {
    this.paymentType.emit($event);
  }
  kevaHistory() {
    this.kevaChargesClicked.emit();
  }
}
