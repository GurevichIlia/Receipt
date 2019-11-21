import { GlobalData } from './../../../../models/globalData.model';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fourth-step',
  templateUrl: './fourth-step.component.html',
  styleUrls: ['./fourth-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FourthStepComponent {
  @Input() fourthStep: FormGroup;
  @Input() globalData$: Observable<GlobalData | ''>;
  days = Array.from(Array(31).keys());
  constructor() { }

}
