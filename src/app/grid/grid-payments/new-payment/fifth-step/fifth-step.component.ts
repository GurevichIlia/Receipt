import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-fifth-step',
  templateUrl: './fifth-step.component.html',
  styleUrls: ['./fifth-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FifthStepComponent implements OnInit, OnChanges {
  @Input() fifthStep: FormGroup;
  @Input() globalData: object;
  @Input() projectCat: FormControl;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(){
    console.log('Changes')
  }
}
