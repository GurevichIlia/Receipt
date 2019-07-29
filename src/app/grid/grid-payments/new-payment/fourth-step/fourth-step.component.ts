import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fourth-step',
  templateUrl: './fourth-step.component.html',
  styleUrls: ['./fourth-step.component.css']
})
export class FourthStepComponent implements OnInit {
@Input() fourthStep: FormGroup;
@Input() globalData: object;
days = Array.from(Array(31).keys());
  constructor() { }

  ngOnInit() {
  }

}
