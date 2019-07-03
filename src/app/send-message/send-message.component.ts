import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, DoCheck, HostListener } from '@angular/core';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  orderFirst: boolean;
  messageForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.addClassOrderFirst();
    this.createMessageForm();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.orderFirst = this.addClassOrderFirst();
  }
  addClassOrderFirst() {
    const orderFirst = window.innerWidth > 450 ? false : true;

    return orderFirst;
  }
  createMessageForm() {
    this.messageForm = this.fb.group({
      CellFrom: ['', Validators.required],
      Msg: ['', Validators.required],
      date: [''],
      groups: ['', Validators.required]
    });
  }
  submitForm(form: FormGroup) {
    
  }
}
