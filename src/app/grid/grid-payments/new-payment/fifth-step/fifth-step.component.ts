import { GlobalData } from 'src/app/models/globalData.model';
import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fifth-step',
  templateUrl: './fifth-step.component.html',
  styleUrls: ['./fifth-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FifthStepComponent implements OnInit, OnChanges {
  @Input() fifthStep: FormGroup;
  @Input() globalData$: Observable<GlobalData>;
  @Input() projectCat: FormControl;
  @Input() employeeList$: Observable<{ employeeId: number, EmpName: string }[]>;

  @Input() paymentType: string;

  // @Input() set paymentType$(paymentType$: Observable<string>) {
  //   debugger
  //   this._paymentType$ = paymentType$.subscribe();
  // };
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    console.log(this.paymentType)

  }
}
