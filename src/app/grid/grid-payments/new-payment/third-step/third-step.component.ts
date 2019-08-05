import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';

@Component({
  selector: 'app-third-step',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThirdStepComponent implements OnInit {
  @Input() thirdStep: FormGroup;
  @Input() paymentType: FormGroup;

  constructor() { }

  ngOnInit() {
    
  }

}
