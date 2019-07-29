import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-third-step',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.css']
})
export class ThirdStepComponent implements OnInit {
@Input() thirdStep: FormGroup;
@Input() paymentType: FormGroup;

  constructor() { }

  ngOnInit() {
    console.log(this.thirdStep)
  }

}
