import { NewsletterTemplateList } from './../newsletter-build.service';
import { GeneralSrv } from './../../shared/services/GeneralSrv.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { map, takeUntil, switchMap } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


import { TableComponent } from 'src/app/shared/share-components/table/table.component';
import { MatTableDataSource } from '@angular/material';
import { DialogService } from 'src/app/shared/modals/dialog/dialogService';
import { Sender, NewSender, senderData } from 'src/app/models/send-newsletter.interfaces';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { TableService } from './../../shared/services/table.service';
import { DialogFactoryService } from './../../shared/modals/dialog/dialog-factory.service';
import { Response } from './../../models/response.model';
import { SendNewsletterService } from './send-newsletter.service';
import { SendDatePickerService } from './../send-date-picker/send-date-picker.service';
import { CustomerGroupsService } from 'src/app/core/services/customer-groups.service';
import { GeneralGroups } from 'src/app/models/generalGroups.model';
import * as moment from 'moment'
import { NewsletterBuildService } from '../newsletter-build.service';


@Component({
  selector: 'app-send-newsletter',
  templateUrl: './send-newsletter.component.html',
  styleUrls: ['./send-newsletter.component.css']
})
export class SendNewsletterComponent implements OnInit {
  @ViewChild('newSenderTemplate') newSenderTemplate: TemplateRef<any>;
  @ViewChild('sendersTable') sendersTable: TableComponent
  @ViewChild('listOfSenders') listOfSenders: TemplateRef<any>;

  sendersDataSource = new MatTableDataSource<any>([]);
  sendersTableButtons = [{ icon: 'create', label: 'Edit' }, { icon: 'delete', label: 'Delete' }];

  senders$: Observable<MatTableDataSource<Sender[]>>;
  sendersListColumns$: Observable<{ columnDef: string, header: string, cell: any }[]>;
  sendersListDisplayedColumns$: Observable<string[]>;
  subscription$ = new Subject();

  listOfSendersModal: DialogService;
  newSenderModal: DialogService;

  newSenderForm: FormGroup
  datepickerForm: FormGroup;
  senderForm: FormGroup;

  // selectedSender: Sender;
  templateId: number;
  sendingNewsletter$: Observable<NewsletterTemplateList>

  treeLoading = false;
  constructor(
    private notificationsService: NotificationsService,
    private sendNewsletterService: SendNewsletterService,
    private buildNewsletterService: NewsletterBuildService,
    private fb: FormBuilder,
    private dialogFactoryService: DialogFactoryService,
    private tableService: TableService,
    private pickerService: SendDatePickerService,
    private router: Router,
    private customerGroupsService: CustomerGroupsService,
    private generalServ: GeneralSrv,
    private route: ActivatedRoute
  ) { }

  // ngOnChanges(simpleChanges: SimpleChanges) {

  //   if (simpleChanges['selectedSender'] && simpleChanges['selectedSender'].currentValue !== simpleChanges['selectedSender'].previousValue)
  //     this.updateSenderForm(this.selectedSender);

  // }

  ngOnInit() {
    this.createNewSenderForm();
    this.createSenderForm();
    this.getGeneralGroups();
    this.createDatepickerForm();
    this.templateId = +this.route.snapshot.queryParams['template'];

    this.sendingNewsletter$ = this.buildNewsletterService.getListNewsletterTemplates().pipe(map(newsletters => newsletters.filter(newsletter => newsletter.TplCodeId === this.templateId)[0]));
  }


  get sendDate() {
    return this.datepickerForm.get('date')
  }

  get hours() {
    return this.datepickerForm.get('hours')
  }

  get minutes() {
    return this.datepickerForm.get('minutes')
  }

  getGeneralGroups() {
    this.treeLoading = true;
    this.customerGroupsService.getGeneralGroups$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((groups: GeneralGroups[]) => {
        if (groups) {
          const generalGroups = groups.sort(this.customerGroupsService.compareName);

          // this.treeViewGeneralGroups = 
          this.customerGroupsService.setDataForGroupsTree(this.customerGroupsService.getNestedChildren(generalGroups, 0));
        }
      }, err => console.error(err),
      () => this.treeLoading = false
      )
  }

  getActionFromSendersModal(event: { action: string, item?: Sender }) {
    switch (event.action.toUpperCase()) {
      case 'EDIT': this.onEditSender(event.item);
        break
      case 'DELETE': this.deleteSender(event.item);
        break
      case 'SELECT': this.onSelectSender(event.item);
        break
      case 'SEND NEWSLETTER': this.sendNewsletter();
        break
    }
  }


  showListOfSenders() {
    this.getListOfSenders();
    this.listOfSendersModal = this.openDialog('List of senders', this.listOfSenders, 1200);
  }

  getListOfSenders() {
    this.senders$ = this.sendNewsletterService.getListOfSenders()
      .pipe(
        // tap((listOfSenders: Sender[]) => this.createcolumnsForTable(listOfSenders, this.sendersListDisplayedColumns$, this.sendersListColumns$))
        map((listOfSenders: Sender[]) => {
          const showenColumns = this.createTableColumns(listOfSenders);
          this.sendersListDisplayedColumns$ = of(showenColumns);
          this.sendersListColumns$ = this.getValueForColumns(showenColumns);

          this.sendersDataSource.data = listOfSenders
          return this.sendersDataSource;
        }));

  }

  saveSender(senderInfo: NewSender) {
    if (this.newSenderForm.valid) {
      this.sendNewsletterService.saveNewsletterSender(senderInfo)
        .pipe(takeUntil(this.subscription$))
        .subscribe((data) => {

          if (data.error !== 'true') {
            this.notificationsService.success('Successfully')
            this.closeNewSenderModal();
            this.updateListOfSenders();
          } else {
            this.notificationsService.error(data.res_description)
          }



        }, err => this.notificationsService.error('', err.message))
    }
  }

  saveNewSender() {
    if (this.newSenderForm.valid) {

      const sender: NewSender = this.newSenderForm.value;
      sender.deleteRow = 0;
      this.saveSender(sender)
    } else {
      this.notificationsService.warn('Please fill in required fields')
    }
  }

  deleteSender(senderInfo: Sender) {
    const questionResult$ = this.notificationsService.askQuestion('למחוק תבנית', { name: senderInfo.Name })

    const afterDelete$ = questionResult$.pipe(switchMap(() => {
      const sender: Sender = senderInfo;
      sender.deleteRow = 1;
      return this.sendNewsletterService.saveNewsletterSender(sender)
    }))


    afterDelete$
      .pipe(takeUntil(this.subscription$))
      .subscribe((data) => {

        if (data.error !== 'true') {
          this.notificationsService.success('Successfully')
          this.closeNewSenderModal();
          this.updateListOfSenders();
        } else {
          this.notificationsService.error('Error')
        }



      }, err => this.notificationsService.error('', err.message))
  }

  onEditSender(senderInfo: Sender) {
    this.newSenderForm.patchValue({
      name: senderInfo.Name,
      mailFrom: senderInfo.MailFrom,
      replyEmailName: senderInfo.ReplyEmailName,
      replyToMail: senderInfo.ReplytoMail,
      id: senderInfo.id,
      deletRow: 0
    })
    this.openNewSenderModal();
  }

  onSelectSender(sender: Sender) {
    // this.selectedSender = sender;
    this.updateSenderForm(sender)
    this.listOfSendersModal.close();
  }

  updateListOfSenders() {
    this.sendNewsletterService.clearSenders();
    this.getListOfSenders();
  }

  // clearSelectedSender() {
  //   this.selectedSender = undefined;
  // }

  createNewSenderForm() {
    this.newSenderForm = this.fb.group({
      name: ['', Validators.required],
      mailFrom: ['', [Validators.required, Validators.email]],
      replyEmailName: ['', Validators.required],
      replyToMail: ['', [Validators.required, Validators.email]],
      id: [null],
      deleteRow: [0]
    })
  }

  openDialog(text: string, template: TemplateRef<any>, width: number = 400, disableClose = true) {
    return this.dialogFactoryService.open({
      headerText: text,
      template,
    }, { width: width, disableClose })

  }

  closeDialog(modalName: DialogService) {
    if (modalName) {
      modalName.close();
    }
  }

  openNewSenderModal() {
    this.newSenderModal = this.openDialog('Create new sender', this.newSenderTemplate, 400, false)
  }

  closeNewSenderModal() {
    if (this.newSenderModal) {
      this.newSenderModal.close();
    }
    this.newSenderForm.reset();
  }

  getValueForColumns(showenColumns: string[]) {
    return of(this.tableService.getValueForColumns(showenColumns))
  }

  createTableColumns(tableData: any[]): string[] {
    return this.tableService.createTableColumns(tableData)
  }

  createDatepickerForm() {
    this.datepickerForm = this.fb.group({
      date: [new Date(), Validators.required],
      hours: [new Date().getHours() + 1, [Validators.required, Validators.maxLength(2), Validators.min(new Date().getHours()), Validators.max(23)]],
      minutes: [new Date().getMinutes(), [Validators.required, Validators.maxLength(2), Validators.min(new Date().getMinutes()), Validators.max(59)]]
    })


  }

  getDatepickerFormChanges() {
    this.datepickerForm.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe(formData => {
        this.pickerService.checkLength(formData, this.hours, this.minutes)
      })
  }


  createSenderForm() {
    this.senderForm = this.fb.group({
      name: ['', Validators.required],
      mailFrom: ['', [Validators.required, Validators.email]],
      replyEmailName: ['', Validators.required],
      replyToMail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      sendLater: [false],
      olang: [0],
      mailToGender: [0],
      record2customerService: [false],
    })
  }


  updateSenderForm(senderInfo: Sender) {
    if (senderInfo) {
      this.refreshSenderForm();
      this.senderForm.patchValue({
        name: senderInfo.Name,
        mailFrom: senderInfo.MailFrom,
        replyEmailName: senderInfo.ReplyEmailName ? senderInfo.ReplyEmailName : senderInfo.Name,
        replyToMail: senderInfo.ReplytoMail ? senderInfo.ReplytoMail : senderInfo.MailFrom,
      })
    }

  }

  refreshSenderForm() {
    this.senderForm.reset();
    this.senderForm.patchValue({
      name: '',
      mailFrom: '',
      replyEmailName: '',
      replyToMail: '',
      subject: '',
      sendLater: false,
      olang: 0,
      mailToGender: 0,
      record2customerService: false
    })
  }

  sendNewsletter() {

    const selectedGroups = this.customerGroupsService.getGroupsCondidatesToAddition().map(group => { return { GroupId: group } });

    if (this.senderForm.valid) {

      if (this.senderForm.get('sendLater').value === 'true' && this.datepickerForm.invalid) {
        this.notificationsService.warn('Please fill in sending date')

      } else if (selectedGroups.length !== 0) {
        const newsletterData: senderData = this.senderForm.value;
        newsletterData.TplCodeId = this.templateId;
        newsletterData.groups = selectedGroups;
        newsletterData.sendLater = +newsletterData.sendLater;
        newsletterData.record2customerService = +newsletterData.record2customerService;

        if (newsletterData.sendLater) {
          //Prepare date if selected send later
          const date: string[] = moment(this.sendDate.value).format('DD-MM-YYYY').split('-');
          newsletterData.sendDate_day = date[0];
          newsletterData.sendDate_mont = date[1];
          newsletterData.sendDate_year = date[2];
          newsletterData.sendHour = `${this.hours.value}:${this.minutes.value}`;
        }

        console.log('SENDING NEWSLETTER DATA', newsletterData)


        // this.sendNewsletterService.sendNewsletter(newsletterData)
        //   .pipe(takeUntil(this.subscription$))
        //   .subscribe((data) => {

        /** FOR TESTING */
        const data = {
          error: 'false',
          TplCodeId: '36',
          res_description: ''
        }
        /** FOR TESTING */

        if (data.error !== 'true') {
          console.log('RESPONSE AFTER SENDING', data)
          this.notificationsService.success('Successfully')
          this.router.navigate(['newsletter/sent'], { queryParams: { template: data.TplCodeId } })
        } else {
          this.notificationsService.error(data.res_description)
        }



        // }, err => this.notificationsService.error('', err.message))

      } else {
        this.notificationsService.warn('Please select groups')
      }

    } else {
      this.notificationsService.warn('Please fill in required fields')

    }
  }


  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
    this.sendNewsletterService.clearSenders();
    this.customerGroupsService.clearGroupsCondidatesToAddition();
  }


}
