import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankComponent implements OnInit {
  @Input() bank: FormGroup;
  @Input() isSubmit: boolean;

  constructor() { }

  ngOnInit() {
  }

}
