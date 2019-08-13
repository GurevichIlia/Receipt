import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerCreditCard } from 'src/app/models/customerCreditCard.model';

@Component({
  selector: 'app-third-step',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThirdStepComponent implements OnInit {
  @Input() thirdStep: FormGroup;
  @Input() paymentType: FormGroup;
  @Input() listCustomerCreditCard: CustomerCreditCard[];
  @Output() addNewCardIsClicked = new EventEmitter();
  constructor() { }

  ngOnInit() {
    
  }
  clickAddNewCard() {
    this.addNewCardIsClicked.emit();
  }
}
