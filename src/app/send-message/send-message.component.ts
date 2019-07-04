import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Subscription } from 'rxjs';
import { SendMessageService } from './send-message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, DoCheck, HostListener, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit, OnDestroy {
  orderFirst: boolean;
  messageForm: FormGroup;
  subscription = new Subscription;
  orgName: string;
  quantityOfMessages: string;
  constructor(
    private fb: FormBuilder,
    private sendMessageService: SendMessageService,
    private generalService: GeneralSrv,
    private toastr: ToastrService,
  ) { }


  ngOnInit() {
    this.checkWindowSize();
    this.addClassOrderFirst();
    this.createMessageForm();
    this.getSelectedGroups();
    this.getOrgName();
    this.getQuantityOfMessages();
  }
  addClassOrderFirst() {
    this.orderFirst = window.innerWidth > 450 ? false : true;
  }
  createMessageForm() {
    this.messageForm = this.fb.group({
      CellFrom: ['', Validators.required],
      Msg: ['', Validators.required],
      // date: [''],
      groups: [[], Validators.required]
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

  checkWindowSize() {
    this.generalService.currentSizeOfWindow.subscribe(width => this.addClassOrderFirst());
  }
  getOrgName() {
    this.generalService.currentOrgName$.subscribe((orgName: string) => {
      console.log('SEND MESSAGE', orgName)
      this.orgName = orgName;
    })
  }
  sendMessage() {
    // tslint:disable-next-line: max-line-length
    this.subscription.add(this.sendMessageService.sendToServer(this.orgName, 0, this.messageForm.value).subscribe((response: { message: string, Error: string }) => {
      console.log('Final response', response);
      this.toastr.success(response.message, '', {
        positionClass: 'toast-top-center'
      });
      this.resetMessageForm();
      this.getQuantityOfMessages();
    }));
  }
  sendConfirmation() {
    console.log(this.messageForm.value);
    // tslint:disable-next-line: max-line-length
    this.subscription.add(this.sendMessageService.sendToServer(this.orgName, 1, this.messageForm.value).subscribe((response: { message: string, Error: string }) => {
      if (confirm(response.message)) {
        this.sendMessage();
      } else {

      }
    }));
  }
  getQuantityOfMessages() {
    // tslint:disable-next-line: max-line-length
    this.subscription.add(this.sendMessageService.sendToServer(this.orgName, 2, this.messageForm.value).subscribe((response: { message: string, Error: string }) => {
      this.quantityOfMessages = response.message;
    }));
  }
  resetMessageForm() {
    this.messageForm.setValue({
      CellFrom: '',
      Msg: '',
      // date: [''],
      groups: []
    });
    this.messageForm.markAsUntouched();
    this.messageForm.updateValueAndValidity();
    console.log(this.messageForm.value)
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
