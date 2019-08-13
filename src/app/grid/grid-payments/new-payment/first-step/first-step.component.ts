import { GlobalData } from 'src/app/models/globalData.model';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirstStepComponent implements OnInit {
  @Input() firstStep: FormGroup;
  @Input() globalData$: Observable<GlobalData>;
  constructor() { }

  ngOnInit() {
  console.log('GLOBAL DATA FIRST STEP', this.globalData$);
  }


}
