import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-fifth-step',
  templateUrl: './fifth-step.component.html',
  styleUrls: ['./fifth-step.component.css']
})
export class FifthStepComponent implements OnInit {
  @Input() fifthStep: FormGroup;
  @Input() globalData: object;
  @Input() projectCat: FormControl;
  constructor() { }

  ngOnInit() {
  }

}
