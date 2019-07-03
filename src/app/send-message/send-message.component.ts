import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Subscription } from 'rxjs';
import { SendMessageService } from './send-message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, DoCheck, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit, OnDestroy {
  orderFirst: boolean;
  messageForm: FormGroup;
  subscription = new Subscription;
  constructor(
    private fb: FormBuilder,
    private sendMessageService: SendMessageService,
    private generalService: GeneralSrv
  ) { }


  ngOnInit() {
    this.generalService.currentSizeOfWindow.subscribe(width => this.addClassOrderFirst());
    this.addClassOrderFirst();
    this.createMessageForm();
    this.getSelectedGroups();
  }
  addClassOrderFirst() {
    this.orderFirst = window.innerWidth > 450 ? false : true;
  }
  createMessageForm() {
    this.messageForm = this.fb.group({
      CellFrom: ['', Validators.required],
      Msg: ['', Validators.required],
      date: [''],
      groups: ['', Validators.required]
    });
  }
  get cellFrom() {
    return this.messageForm.get('CellFrom');
  }
  get message() {
    return this.messageForm.get('Msg');
  }
  get groups() {
    return this.messageForm.get('groups');
  }
  getSelectedGroups() {
    this.subscription.add(this.sendMessageService.selectedGroups.subscribe((groups: number[]) => this.groups.patchValue(groups)));
  }
  submitForm(form: FormGroup) {
    console.log(form);
    // this.sendMessageService.sendToServer(form.value).subscribe((response: Response) => console.log(response));
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
