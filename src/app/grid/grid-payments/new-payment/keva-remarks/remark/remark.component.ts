import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { KevaRemark } from 'src/app/grid/payments.service';

@Component({
  selector: 'app-remark',
  templateUrl: './remark.component.html',
  styleUrls: ['./remark.component.css']
})
export class RemarkComponent implements OnInit {
  @Input() kevaRemark;
  @Output() remarkAction = new EventEmitter();

  editMode = false;
  constructor() { }

  ngOnInit() {
  }

  sendNewAction(action: string, kevaRemark: KevaRemark) {
    // const remark = this.remarkControl.value;
    this.remarkAction.emit({ action, kevaRemark });
  }
}
