import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Subscription } from 'rxjs';
import { SendMessageService } from './send-message.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  selectedGroups: number[] = [];
  postfix = new FormControl('');
  currentLang: string;
  constructor(
    private fb: FormBuilder,
    private sendMessageService: SendMessageService,
    private generalService: GeneralSrv,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService
  ) { }


  ngOnInit() {
    this.postfix.valueChanges.subscribe(postfix => {
      let message: string = this.message.value;
      if (this.currentLang === 'he') {
        this.message.patchValue(`{${postfix}} ${message}`);
      } else {
        this.message.patchValue(`${message} {${postfix}} `);
      }
    })
    this.spinner.start();
    this.checkWindowSize();
    this.addClassOrderFirst();
    this.createMessageForm();
    this.getSelectedGroups();
    this.getOrgName();
    this.getQuantityOfMessages();
    this.generalService.currentLang$.subscribe(lang => this.currentLang = lang);
    this.spinner.stop();
  }
  addClassOrderFirst() {
    this.orderFirst = window.innerWidth > 765 ? false : true;
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
    this.subscription.add(this.sendMessageService.selectedGroups.subscribe((group: number) => {
      if (this.selectedGroups.includes(group)) {
        this.selectedGroups.splice(this.selectedGroups.indexOf(group), 1);
      } else {
        this.selectedGroups.push(group);
      }
      this.updateGroups();
      console.log('SELECTION', this.groups.value)
    }))
  }
  updateGroups() {
    debugger
    this.groups.patchValue(this.selectedGroups);
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
    this.spinner.start();
    this.subscription.add(this.sendMessageService.sendToServer(this.orgName, 0, this.messageForm.value).subscribe((response: { message: string, Error: string }) => {
      console.log('Final response', response);
      this.toastr.success(response.message, '', {
        positionClass: 'toast-top-center'
      });
      this.resetMessageForm();
      this.getQuantityOfMessages();
      this.spinner.stop();
    }));
  }
  sendConfirmation() {
    console.log(this.messageForm.value);
    // tslint:disable-next-line: max-line-length
    this.spinner.start();
    this.subscription.add(this.sendMessageService.sendToServer(this.orgName, 1, this.messageForm.value).subscribe((response: { message: string, Error: string }) => {
      if (confirm(response.message)) {
        this.spinner.stop();
        this.sendMessage();
      } else {
        this.spinner.stop();
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
    this.updateGroups();
    console.log(this.messageForm)
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
