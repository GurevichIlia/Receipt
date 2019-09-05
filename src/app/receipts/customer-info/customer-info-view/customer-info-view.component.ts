import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { CustomerType } from 'src/app/models/customerType.model';

@Component({
  selector: 'app-customer-info-view',
  templateUrl: './customer-info-view.component.html',
  styleUrls: ['./customer-info-view.component.css']
})
export class CustomerInfoViewComponent implements OnInit {
  @Input() userInfoGroup: FormGroup
  @Input() filterCustTitle: { TitleEng: string, TitleHeb: string, TitleId: string }[];
  @Input() customerTypes: CustomerType[];

  constructor() { }

  ngOnInit() {
  }
  get phones() {
    return this.userInfoGroup.get('phones') as FormArray;
  }
  get emails() {
    return this.userInfoGroup.get('emails') as FormArray;
  }
}
