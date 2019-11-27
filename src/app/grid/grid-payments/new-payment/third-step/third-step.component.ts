import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CustomerCreditCard } from 'src/app/models/customerCreditCard.model';
import { Observable } from 'rxjs';
import { Creditcard } from 'src/app/models/creditCard.model';

@Component({
  selector: 'app-third-step',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThirdStepComponent {
  @Input() thirdStep: FormGroup;
  @Input() paymentType: FormGroup;
  @Input() listCustomerCreditCard$: Observable<CustomerCreditCard[]>;
  @Output() addNewCardIsClicked = new EventEmitter();
  @Input() listNewCreditCard: Creditcard[];
  @Input() isSubmit: boolean;

  constructor() { }

  clickAddNewCard() {
    this.addNewCardIsClicked.emit();
  }
}
