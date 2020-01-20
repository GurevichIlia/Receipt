import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sender-form',
  templateUrl: './sender-form.component.html',
  styleUrls: ['./sender-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SenderFormComponent implements OnInit {
  @Input() senderForm: FormGroup;
  @Output() action = new EventEmitter()

  constructor() { }

  ngOnInit() {

  }
  dispatchAction(action: string) {
    this.action.emit({action});
  }
}
