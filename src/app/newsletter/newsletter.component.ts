import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, map, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NewsletterBuildService, NewsletterTemplateList, NewNewsletter, NewsletterTemplate } from './newsletter-build.service';
import { DialogService } from '../shared/modals/dialog/dialogService';
import { Subject, Observable, of, combineLatest } from 'rxjs';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { DialogFactoryService } from '../shared/modals/dialog/dialog-factory.service';
import { NotificationsService } from '../core/services/notifications.service';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';


import { CustomerGroupsService } from './../core/services/customer-groups.service';
import { TableService } from 'src/app/shared/services/table.service';
import { Response } from './../models/response.model';
import { NewsletterBuilderComponent } from './newsletter-builder/newsletter-builder.component';
import { NewsletterFile, NewsletterFiles } from './newsletter.interfaces';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(NewsletterBuilderComponent) newsletterBuilderComponent: NewsletterBuilderComponent
  @ViewChild('userDialogTemplate') userDialogTemplate: TemplateRef<any>;
  @ViewChild('listOfTemplates') listOfTemplates: TemplateRef<any>;

  @ViewChild('newsletterFiles') filesTemplate: TemplateRef<any>;
  @ViewChild('fullImage') fullImage: TemplateRef<any>;
  @ViewChild('uploadFile') uploadFile: TemplateRef<any>;

  dialog: DialogService;
  subscription$ = new Subject();
  token: string;
  templateName = new FormControl('', Validators.required);
  newsletterTemplates$: Observable<MatTableDataSource<NewsletterTemplateList[]>>;
  showGroups = false;



  templateKeys = {
    keyForItemName: 'TplTitile',
    keyForItemId: 'TplCodeId',
    keyForItemDate: 'RowDate',
    labelName: ''
  }

  newsletterTemplate: NewsletterTemplate = {
    LastUpdate: '',
    OrgiD: null,
    RowDate: '',
    TplCodeId: null,
    TplCssCode: '',
    TplHTMLCode: '',
    TplHTMLCode4Send: '',
    TplTitile: '',
  };

  templateListColumns$: Observable<{ columnDef: string, header: string, cell: any }[]>;
  templateListDisplayedColumns$: Observable<string[]>;


  templatesDataSource = new MatTableDataSource<any>([]);

  templatesTableButtons = [{ icon: 'control_point_duplicate', label: 'Duplicate' }, { icon: 'create', label: 'Edit' }, { icon: 'delete', label: 'Delete' }];


  templateNameModal: DialogService;
  listOfTemplatesModal: DialogService
  newsletterFilesModal: DialogService

  docsTableDataSource = new MatTableDataSource<NewsletterFile>()
  imagesTableDataSource = new MatTableDataSource<NewsletterFile>()
  newsletterFiles$: Observable<NewsletterFiles>

  filesListDisplayedColumns$: Observable<string[]>;
  filesListColumns$: Observable<{ columnDef: string, header: string, cell: any }[]>

  imagesListDisplayedColumns$: Observable<string[]>;
  imagesListColumns$: Observable<{ columnDef: string, header: string, cell: any }[]>


  filesTableButtons = [{ icon: 'control_point_duplicate', label: 'Copy' }, { icon: 'delete', label: 'Delete' }];

  imageSrc = '';
  uploadModal: MatDialogRef<any>
  constructor(
    private newsLetterService: NewsletterBuildService,
    private dialogFactoryService: DialogFactoryService,
    private notificationsService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private tableService: TableService,
    private fb: FormBuilder,
    private groupsService: CustomerGroupsService,
    private matDialog: MatDialog

  ) { }

  ngOnInit() {

    this.getActionFromChild();

  }


  ngAfterViewInit() {
    this.newsLetterService.getNewsletterToken()
      .pipe(takeUntil(this.subscription$))
      .subscribe((response: Response) => {
        if (response['Data']) {
          const token = JSON.parse(response['Data']).token
          this.token = token;
          const queryParams = this.route.snapshot.queryParams['template']
          if (!queryParams) {
            this.newsLetterService.loadDemoTemplate(this.token);
          } else {

            this.router.navigate(['newsletter'], { queryParams: { template: queryParams } })

            this.uploadTemplate(+queryParams)
          }
        }

      })
  }

  getActionFromChild() {
    this.newsLetterService.actionFromChild$
      .pipe(takeUntil(this.subscription$))
      .subscribe((event: { action: string, item?: any }) => {
        this.doAction(event)
      })
  }

  doAction(event: { action: string, item?: any }) {
    switch (event.action.toUpperCase()) {
      case 'SHOW TEMPLATES': this.openListOfTemplates();
        break
      case 'SAVE TEMPLATE': this.openTemplateNameModal();
        break
      case 'EDIT': this.uploadTemplate(event.item.TplCodeId);
        break
      case 'SELECT': this.uploadTemplate(event.item.TplCodeId);
        break
      case 'DELETE': this.deleteTemplateFromList(event.item);
        break
      case 'DUPLICATE': this.duplicateTemplate(event.item)
        break
      case 'NEW': this.refreshTemplate();
        break
      case 'SEND NEWSLETTER': this.goToSendingNewsletter();
        break
      case 'SHOW FILES': this.openNewsletterFilesModal();
        break
      case 'REFRESH FILES': this.refreshFiles();
        break

    }
  }

  // getActionFromSendersModal(event: { action: string, item?: Sender }) {
  //   switch (event.action.toUpperCase()) {
  //     case 'EDIT': this.onEditSender(event.item);
  //       break
  //     case 'DELETE': this.deleteSender(event.item);
  //       break
  //     case 'SELECT': this.onSelectSender(event.item);
  //       break
  //   }
  // }
  openListOfTemplates() {
    this.getNewsletterTemplatesList();
    this.listOfTemplatesModal = this.openDialog('List of templates', this.listOfTemplates, 1200)
  }

  closeListOfTemplates() {
    if (this.listOfTemplatesModal) {
      this.listOfTemplatesModal.close()
    }
    this.newsletterTemplates$ = undefined;
  }


  openTemplateNameModal() {
    const templateTitle = this.newsletterTemplate.TplTitile ? this.newsletterTemplate.TplTitile : '';
    this.templateName.patchValue(templateTitle);
    this.templateNameModal = this.openDialog('Please enter a template name', this.userDialogTemplate, 400);
  }

  closeTemplateNameModal() {
    this.closeDialog(this.templateNameModal)
  }

  openDialog(text: string, template: TemplateRef<any>, width?: number, disableClose = false) {
    return this.dialogFactoryService.open({
      headerText: text,
      template,
    }, { width: width, disableClose })

  }

  closeDialog(modalName: DialogService) {
    // const activity = this.dialog.context // Get context before close
    this.templateName.reset('');
    if (modalName) {
      modalName.close();
    }
  }

  saveEmail() {
    // console.log(window);
    window['StripoApi'].compileEmail((error, html, ampHtml, ampErrors) => console.log(html))
  }


  getNewsletterTemplatesList() {
    this.newsletterTemplates$ = this.newsLetterService.getListNewsletterTemplates()
      .pipe(map(newsletters => {
        const shownColumns: string[] = this.createTableColumns(newsletters)

        this.templateListDisplayedColumns$ = of(shownColumns)
        this.templateListColumns$ = this.getValueForColumns(shownColumns);

        this.templatesDataSource.data = newsletters
        return this.templatesDataSource
      }))
  }



  uploadTemplate(templateId: number) {
    this.newsLetterService.getNewsletterById(templateId)
      .pipe(takeUntil(this.subscription$))
      .subscribe((respose: Response) => {

        console.log(respose)
        if (!respose.IsError) {
          if (respose.Data.IsError !== true) {
            if (respose.Data.GetNewsLetterTplById[0]) {
              const template: NewsletterTemplate = respose.Data.GetNewsLetterTplById[0];
              this.newsLetterService.initPlugin({ html: template.TplHTMLCode, css: template.TplCssCode }, this.token);
              this.newsletterTemplate = template;
              this.closeListOfTemplates();
            } else {
              this.refreshTemplate();
            }

          }

        }

      }, err => this.notificationsService.error('', err.message)
      )


  }



  saveNewOrEditedTemplate() {
    if (this.templateName.valid) {
      if (this.newsletterTemplate.TplCodeId) {
        this.saveEditedTemplate()
      } else {
        this.saveNewTemplate();
      }
    } else {
      this.notificationsService.warn('', 'Required template name')
    }

  }

  saveEditedTemplate() {
    let TPLHTMLCODE4SEND = ''
    window['StripoApi'].compileEmail((error, html, ampHtml, ampErrors) => {
      TPLHTMLCODE4SEND = html
      window['StripoApi'].getTemplate((HTML, CSS, width, height) => {
        const newsletter: NewNewsletter = {
          HTML,
          CSS,
          TITLE: this.templateName.value,
          TPLCODEID: this.newsletterTemplate.TplCodeId,
          TPLHTMLCODE4SEND: TPLHTMLCODE4SEND
        }
        this.saveTemplate(newsletter);
        this.closeDialog(this.templateNameModal);
      })
    })


  }

  saveNewTemplate() {
    let TPLHTMLCODE4SEND = ''
    window['StripoApi'].compileEmail((error, html, ampHtml, ampErrors) => {
      TPLHTMLCODE4SEND = html
      window['StripoApi'].getTemplate((HTML, CSS, width, height) => {
        const newsletter: NewNewsletter = {
          HTML,
          CSS,
          TITLE: this.templateName.value,
          TPLHTMLCODE4SEND: TPLHTMLCODE4SEND
        }
        this.saveTemplate(newsletter);
        this.closeDialog(this.templateNameModal);
      })
    })


  }

  saveTemplate(newsletter: NewNewsletter) {
    this.newsLetterService.saveNewsletter(newsletter)
      .pipe(takeUntil(this.subscription$))
      .subscribe((respose: Response) => {
        if (!respose.IsError) {
          console.log(respose)
          if (respose.Data.error !== 'true') {
            this.notificationsService.success('', 'Successfully')
            this.newsLetterService.clearTemplates();
            this.getNewsletterTemplatesList();

            if (respose.Data.TplCodeId) {
              this.newsletterTemplate.TplCodeId = respose.Data.TplCodeId;
              this.newsletterTemplate.TplTitile = newsletter.TITLE;
            }

          } else {
            this.notificationsService.error('', respose.Data.res_description)
          }
        }

      }, err => this.notificationsService.error('', err.message)
      )
  }

  deleteTemplate() {
    const questionResult$ = this.notificationsService.askQuestion('למחוק תבנית', { name: this.newsletterTemplate.TplTitile })

    const afterDelete$ = questionResult$.pipe(switchMap(() => {
      const newsletter: NewNewsletter = {
        TPLCODEID: +this.newsletterTemplate.TplCodeId,
        DELETEROW: 1
      }
      return this.newsLetterService.saveNewsletter(newsletter)
    }))

    afterDelete$
      .pipe(takeUntil(this.subscription$))
      .subscribe((respose: Response) => {
        if (!respose.IsError) {
          if (respose.Data.error !== 'true') {
            console.log(respose)
            this.notificationsService.success('', 'Successfully')
            this.newsLetterService.clearTemplates();
            this.getNewsletterTemplatesList();
            this.newsLetterService.loadDemoTemplate(this.token, this.newsletterBuilderComponent.changeHistoryContainer);
            this.resetNewsletterTemplate();
          }
        }

      }, err => this.notificationsService.error('', err.message)
      )

  }


  deleteTemplateFromList(template: NewsletterTemplateList) {
    const questionResult$ = this.notificationsService.askQuestion('למחוק תבנית', { name: template.TplTitile })

    const afterDelete$ = questionResult$.pipe(switchMap(() => {
      const newsletter: NewNewsletter = {
        TPLCODEID: template.TplCodeId,
        DELETEROW: 1
      }
      return this.newsLetterService.saveNewsletter(newsletter)
    }))

    afterDelete$.pipe(takeUntil(this.subscription$))
      .subscribe((respose: Response) => {
        if (!respose.IsError) {
          console.log(respose)
          if (respose.Data.error !== 'true') {
            this.notificationsService.success('', 'Successfully')
            this.newsLetterService.clearTemplates();
            this.getNewsletterTemplatesList();
          }

        }

      }, err => this.notificationsService.error('', err.message)
      )

  }

  duplicateTemplate(template: NewsletterTemplate) {
    this.newsLetterService.getNewsletterById(template.TplCodeId)
      .pipe(takeUntil(this.subscription$))
      .subscribe((response: Response) => {

        console.log(response)
        if (!response.IsError) {
          if (response.Data.error !== 'true') {
            if (response.Data.GetNewsLetterTplById[0]) {
              const template: NewsletterTemplate = response.Data.GetNewsLetterTplById[0];
              this.newsLetterService.initPlugin({ html: template.TplHTMLCode, css: template.TplCssCode }, this.token);
              this.newsletterTemplate = {
                LastUpdate: '',
                OrgiD: template.OrgiD,
                RowDate: '',
                TplCodeId: null,
                TplCssCode: template.TplCssCode,
                TplHTMLCode: template.TplHTMLCode,
                TplHTMLCode4Send: template.TplHTMLCode4Send,
                TplTitile: template.TplTitile,
              }
              this.closeListOfTemplates();
            } else {
              this.refreshTemplate();
            }

          }

        }

      }, err => this.notificationsService.error('', err.message)
      )


  }

  resetNewsletterTemplate() {
    this.newsletterTemplate = {
      LastUpdate: '',
      OrgiD: null,
      RowDate: '',
      TplCodeId: null,
      TplCssCode: '',
      TplHTMLCode: '',
      TplHTMLCode4Send: '',
      TplTitile: '',
    }
  }

  refreshTemplate() {
    this.router.navigate(['newsletter'])
    this.newsLetterService.loadDemoTemplate(this.token
      // , this.newsletterBuilderComponent.changeHistoryContainer
    );
    this.resetNewsletterTemplate();
    this.closeDialog(this.listOfTemplatesModal);
  }

  // openListOfSenders() {
  //   this.getListOfSenders();
  //   this.listOfSendersModal = this.openDialog('List of senders', this.listOfSenders, 1200);
  // }



  // getListOfSenders() {
  //   this.senders$ = this.newsLetterService.getListOfSenders()
  //     .pipe(
  //       // tap((listOfSenders: Sender[]) => this.createcolumnsForTable(listOfSenders, this.sendersListDisplayedColumns$, this.sendersListColumns$))
  //       map((listOfSenders: Sender[]) => {
  //         const showenColumns = this.createTableColumns(listOfSenders);
  //         this.sendersListDisplayedColumns$ = of(showenColumns);
  //         this.sendersListColumns$ = this.getValueForColumns(showenColumns);

  //         this.sendersDataSource.data = listOfSenders
  //         return this.sendersDataSource;
  //       }));

  // }

  showListGroups() {
    // this.router.navigate(['newsletter/send'])
    this.showGroups = !this.showGroups
  }

  getValueForColumns(showenColumns: string[]) {
    return of(this.tableService.getValueForColumns(showenColumns))
  }

  createTableColumns(tableData: any[]): string[] {
    return this.tableService.createTableColumns(tableData)
  }


  // createNewSenderForm() {
  //   this.newSenderForm = this.fb.group({
  //     name: ['', Validators.required],
  //     mailFrom: ['', [Validators.required, Validators.email]],
  //     replyMailName: ['', Validators.required],
  //     replyToMail: ['', [Validators.required, Validators.email]],
  //     id: [null],
  //     deleteRow: [0]
  //   })
  // }

  // openNewSenderModal() {
  //   this.newSenderModal = this.openDialog('Create new sender', this.newSenderTemplate, 400, false)
  // }

  // closeNewSenderModal() {
  //   if (this.newSenderModal) {
  //     this.newSenderModal.close();
  //   }
  // }

  // saveNewSender() {
  //   if (this.newSenderForm.valid) {

  //     const sender: NewSender = this.newSenderForm.value;
  //     sender.deleteRow = 0;
  //     this.saveSender(sender)
  //   } else {
  //     this.notificationsService.warn('Please fill in required fields')
  //   }
  // }



  // deleteSender(senderInfo: Sender) {
  //   const questionResult$ = this.notificationsService.askQuestion('למחוק תבנית', { name: senderInfo.Name })

  //   const afterDelete$ = questionResult$.pipe(switchMap(() => {
  //     const sender: Sender = senderInfo;
  //     sender.deleteRow = 1;
  //     return this.newsLetterService.saveNewsletterSender(sender)
  //   }))


  //   afterDelete$
  //     .pipe(takeUntil(this.subscription$))
  //     .subscribe((response: Response) => {
  //       if (!response.IsError) {
  //         if (response.Data.IsError !== true) {
  //           this.notificationsService.success('Successfully')
  //           this.closeNewSenderModal();
  //           this.updateListOfSenders();
  //         } else {
  //           this.notificationsService.error('Error')
  //         }

  //       }

  //     }, err => this.notificationsService.error('', err.message))
  // }



  // saveSender(senderInfo: NewSender) {
  //   if (this.newSenderForm.valid) {
  //     this.newsLetterService.saveNewsletterSender(senderInfo)
  //       .pipe(takeUntil(this.subscription$))
  //       .subscribe((response: Response) => {
  //         if (!response.IsError) {
  //           debugger
  //           if (response.Data.error !== 'true') {
  //             this.notificationsService.success('Successfully')
  //             this.closeNewSenderModal();
  //             this.updateListOfSenders();
  //           } else {
  //             this.notificationsService.error(response.Data.res_description)
  //           }

  //         }

  //       }, err => this.notificationsService.error('', err.message))
  //   }
  // }



  updateListOfTemplates() {
    this.newsLetterService.clearTemplates();
    this.getNewsletterTemplatesList();
  }

  getNewsletterFileList() {
    const docs$ = this.newsLetterService.getNewsletterFileList('docs')
      .pipe(map(docs => {
        const shownColumns: string[] = ['name', 'size', 'lastWriteTime']
        // this.createTableColumns(docs.docs)

        this.filesListDisplayedColumns$ = of(shownColumns)
        this.filesListColumns$ = this.getValueForColumns(shownColumns);

        this.docsTableDataSource.data = docs.docs
        return this.docsTableDataSource;

      }))

    const images$ = this.newsLetterService.getNewsletterFileList('images')
      .pipe(map(images => {
        const shownColumns: string[] = ['name', 'size', 'lastWriteTime', 'fullName']
        // this.createTableColumns(docs.docs)

        this.imagesListDisplayedColumns$ = of(shownColumns)
        this.imagesListColumns$ = this.getValueForColumns(shownColumns);
        this.imagesTableDataSource.data = images.images

        return this.imagesTableDataSource;

      }), tap(images => console.log(images.data)));

    this.newsletterFiles$ = combineLatest(docs$, images$) as Observable<NewsletterFiles>
  }

  openNewsletterFilesModal() {
    this.getNewsletterFileList();
    this.newsletterFilesModal = this.openDialog('Newsletter files', this.filesTemplate, 1000, false)
  }

  showFullImage(item: NewsletterFile) {
    this.imageSrc = item.fullName
    const dialog = this.matDialog.open(this.fullImage)
  }

  getActionsFromDocsTable() {

  }

  getActionsFromImagesTable(event: { action: string, item?: any }) {
    switch (event.action) {
      case 'SELECT': this.showFullImage(event.item)

        break;

      default:
        break;
    }
  }

  refreshFiles() {
    this.newsletterFiles$ = undefined;
    this.getNewsletterFileList();
    this.uploadModal.close();
  }
  // onSelectSender(sender: Sender) {
  //   this.selectedSender = sender;
  //   this.listOfSendersModal.close();
  // }

  // updateListOfSenders() {
  //   this.newsLetterService.clearSenders();
  //   this.getListOfSenders();
  // }

  // clearSelectedSender() {
  //   this.selectedSender = undefined;
  // }
  openUploadFileModal() {
    this.uploadModal = this.matDialog.open(this.uploadFile)
  }

  goToSendingNewsletter() {
    this.router.navigate(['newsletter/sending'], { queryParams: { template: this.newsletterTemplate.TplCodeId } })
  }



  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
    this.newsLetterService.clearTemplates();
  }
}
