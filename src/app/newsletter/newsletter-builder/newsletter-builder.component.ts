import { Response } from './../../models/response.model';
import { NotificationsService } from '../../core/services/notifications.service';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Newsletter } from './newsletter-build.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, TemplateRef } from '@angular/core';

import { Subject, BehaviorSubject } from 'rxjs';
import { NewsletterBuildService } from './newsletter-build.service';
import { DialogService } from 'src/app/shared/modals/dialog/dialogService';
import { DialogFactoryService } from 'src/app/shared/modals/dialog/dialog-factory.service';


@Component({
  selector: 'app-newsletter-builder',
  templateUrl: './newsletter-builder.component.html',
  styleUrls: ['./newsletter-builder.component.css']
})
export class NewsletterBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('changeHistoryContainer') changeHistoryContainer: ElementRef;
  @ViewChild('stripoSettingsContainer') stripoSettingsContainer: ElementRef;
  @ViewChild('userDialogTemplate') userDialogTemplate: TemplateRef<any>;
  dialog: DialogService;
  subscription$ = new Subject();

  templateName = new FormControl('', Validators.required);
  static token: string = '';
  constructor(
    private newsLetterService: NewsletterBuildService,
    private dialogFactoryService: DialogFactoryService,
    private notificationsService: NotificationsService

  ) { }

  ngOnInit() {
    this.newsLetterService.getNewsletterToken()
      .subscribe(token => {
        NewsletterBuilderComponent.token = JSON.parse(token['Data']).token
        this.loadDemoTemplate(this.initPlugin);
      })

    // this.newsLetterService.getNewsletterToken().pipe(switchMap(token => {
    //   const newtoken = JSON.parse(token['Data']).token
    //   return this.loadDemoTemplate(newtoken);
    // }))

    //   .subscribe(token => console.log('TOKEN', token))
    // this.loadDemoTemplate(this.initPlugin)
  }

  ngAfterViewInit() {
    const test = new BehaviorSubject(this.stripoSettingsContainer);
    test.subscribe((data) => {

      console.log('DIV UPLOADED', data.nativeElement.childrens)
    })
  }
  saveEmail() {
    debugger;
    // console.log(window);
    window['StripoApi'].compileEmail((error, html, ampHtml, ampErrors) => { console.log(html) })
  }

  saveTemplate() {
    if (this.templateName.valid) {
      //callback(HTML, CSS, width, height)
      window['StripoApi'].getTemplate((HTML, CSS, width, height) => {
        console.log(CSS);
        console.log(HTML);
        const newsletter: Newsletter = {
          HTML,
          CSS,
          TITLE: this.templateName.value
        }

        this.newsLetterService.saveNewsletter(newsletter)
          .pipe(takeUntil(this.subscription$))
          .subscribe((respose: Response) => {
            if (!respose.ErrMsg) {
              console.log(respose.Data)
              this.notificationsService.success('', 'Successfully')
              this.closeDialog();
            }

          }, err => this.notificationsService.error('', err.message)
          )
      })
    } else {
      this.notificationsService.warn('', 'Required template name')
    }



  }

  // Utility methods
  request(method, url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        callback(req.responseText);
      } else if (req.readyState === 4 && req.status !== 200) {
        console.error('Can not complete request. Please check you entered a valid PLUGIN_ID and SECRET_KEY values');
      }
    };
    req.open(method, url, true);
    if (method !== 'GET') {
      // req.setRequestHeader('content-type', 'application/json');
    }
    req.send(data);
  }

  // requestToken(method, url, data, callback) {
  //   var req = new XMLHttpRequest();
  //   req.onreadystatechange = () => {
  //     if (req.readyState === 4 && req.status === 200) {
  //       var myObj = JSON.parse(req.responseText);
  //       JSON.parse(myObj.Data, (key, value) => {
  //         if (typeof value === 'string') {
  //           callback(value);
  //         }
  //         return "";
  //       });

  //     } else if (req.readyState === 4 && req.status !== 200) {
  //       console.error('Can not complete request. Please check you entered a valid PLUGIN_ID and SECRET_KEY values');
  //     }
  //   };

  //   req.open(method, url, true);
  //   if (method !== 'GET') {
  //     req.setRequestHeader('content-type', 'application/json');
  //   }
  //   req.send(data);
  // }


  loadDemoTemplate(callback) {
    // localStorage.setItem('id_newstoken', token)
    //            request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.html', null, function(html) {
    //                request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.css', null, function(css) {
    //                    callback({html: html, css: css});
    //                });
    //           });
    this.request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Empty-Template/Empty-Template.html', null, (html) => {
      this.request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Empty-Template/Empty-Template.css', null, (css) => {
        callback({ html: html, css: css });
      });
    });

    // return combineLatest(this.newsLetterService.getHtml(), this.newsLetterService.getCss())
    // .pipe(takeUntil(this.subscription$))
    // .subscribe(template => {
    //   console.log('TEMPLATE', template)
    //   initPlugin(template)
    // })
    // })
  }

  // Call this function to start plugin.
  // For security reasons it is STRONGLY recommended NOT to store your PLUGIN_ID and SECRET_KEY on client side.
  // Please use backend middleware to authenticate plugin.
  // See documentation: https://stripo.email/plugin-api/
  initPlugin(template) {
    const token = NewsletterBuilderComponent.token;
    const apiRequestData = {
      emailId: 123
    };
    const script = document.createElement('script');
    script.id = 'stripoScript';
    script.type = 'text/javascript';
    script.src = 'https://plugins.stripo.email/static/latest/stripo.js';
    script.onload = () => {

      window['Stripo'].init({
        settingsId: 'stripoSettingsContainer',
        previewId: 'stripoPreviewContainer',
        codeEditorButtonId: 'codeEditor',
        undoButtonId: 'undoButton',
        redoButtonId: 'redoButton',
        locale: 'en',
        html: template.html,
        css: template.css,
        mergeTags: [
          {
            "category": "Jaffa Tags",
            "entries": [
              {
                "label": "First Name",
                "value": "{{FNAME}}"
              },
              {
                "label": "Last Name",
                "value": "{{LNAME}}"
              }
            ]
          }
        ]
        ,

        notifications: {
          info: (message) => this.showNotification(message),
          error: (message) => this.showNotification(message),
          warn: (message) => this.showNotification(message),
          loader: (message) => this.showNotification(message),
          hide: (message) => this.showNotification(message),
          success: (message) => this.showNotification(message),
        },
        apiRequestData: apiRequestData,
        userFullName: 'Plugin Demo User',
        versionHistory: {
          changeHistoryLinkId: 'changeHistoryLink',
          onInitialized: (lastChangeIndoText) => this.changeHistoryContainer.nativeElement.show()
        },

        getAuthToken: (callback) => {
          callback(token);
        }


      });


    };
    document.body.appendChild(script);


  }

  showNotification(message) {
    console.log(message)
  }


  openDialog() {
    this.dialog = this.dialogFactoryService.open({
      headerText: 'Please enter a template name',
      template: this.userDialogTemplate
    }, { width: 400, disableClose: true })
  }

  closeDialog() {
    const activity = this.dialog.context // Get context before close
    this.templateName.reset('');
    this.dialog.close();
    console.log(activity)
  }
}
