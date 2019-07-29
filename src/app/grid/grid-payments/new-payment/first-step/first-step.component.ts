import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.css']
})
export class FirstStepComponent implements OnInit {
  @Input() firstStep: FormGroup;
  @Input() globalData: object;
  constructor() { }

  ngOnInit() {
  console.log('GLOBAL DATA FIRST STEP', this.globalData);
  }


}
