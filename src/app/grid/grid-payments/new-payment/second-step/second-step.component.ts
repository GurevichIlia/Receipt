import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondStepComponent implements OnInit {
  @Input() secondStep: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
