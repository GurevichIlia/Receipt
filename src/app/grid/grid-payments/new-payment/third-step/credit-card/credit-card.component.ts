import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardComponent implements OnInit {
  @Input() creditCard: FormControl;
  constructor() { }

  ngOnInit() {
  }

}
