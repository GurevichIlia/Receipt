import { CustomerCreditCard } from './../../../../../models/customerCreditCard.model';
import { FormControl } from '@angular/forms';
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardComponent implements OnChanges {
  @Input() creditCard: FormControl;
  @Input() listCustomerCreditCard: CustomerCreditCard[];
  @Output() addNewCardIsClicked = new EventEmitter();
  constructor() { }

  ngOnChanges() {
console.log('CREDIT CARD LIST', this.listCustomerCreditCard)
  }
  clickAddNewCard() {
    this.addNewCardIsClicked.emit();
  }
}
