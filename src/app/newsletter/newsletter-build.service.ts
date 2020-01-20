import { Response } from 'src/app/models/response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, ElementRef } from '@angular/core';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import { TableService } from './../shared/services/table.service';
import { GeneralSrv } from '../shared/services/GeneralSrv.service';
import { NewsletterFile, NewsletterFiles } from './newsletter.interfaces';
export interface NewNewsletter {
  HTML?: string,
  CSS?: string,
  TITLE?: string,
  TPLCODEID?: number,
  DELETEROW?: number,
  TPLHTMLCODE4SEND?: string
}

export interface NewsletterTemplateList {
  LastUpdate?: string;
  OrgiD?: number;
  RowDate?: string;
  TplCodeId?: number;
  // TplCssCode?: string
  // TplHTMLCode?: string;
  TplTitile?: string;
}

export interface NewsletterTemplate {
  LastUpdate: string;
  OrgiD: number;
  RowDate: string;
  TplCodeId: number;
  TplCssCode: string
  TplHTMLCode: string;
  TplHTMLCode4Send: string;
  TplTitile: string;
}



@Injectable(
  //   {
  //   providedIn: 'root'
  // }
)
export class NewsletterBuildService {
  actionFromChild$ = new Subject<{ action: string, item?: any }>()
  newsletterTemplateUrl = 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Empty-Template/Empty-Template.'
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  token: string;
  templates$: Observable<NewsletterTemplateList[]>
  // newsletterSenders$: Observable<Sender[]>
  constructor(
    private http: HttpClient,
    private generalService: GeneralSrv,
    private tableService: TableService
  ) { }

  getNewsletterToken() {
    return this.http.get(`${this.baseUrl}NewsLetter/LoginToStripo?guid=${this.generalService.getOrgName()}`)
  }

  saveNewsletter(newsletter: NewNewsletter) {
    return this.http.post(`${this.baseUrl}NewsLetter/SaveNewsLetterTpl?urlAddr=${this.generalService.getOrgName()}`, newsletter)
  }


  getListNewsletterTemplates(): Observable<NewsletterTemplateList[]> {
    if (!this.templates$) {
      this.templates$ = this.http.get<NewsletterTemplateList[]>(`${this.baseUrl}NewsLetter/GetNewsLetterTpls?urlAddr=${this.generalService.getOrgName()}`).pipe(
        map((response) => {
          console.log('NEWSLETTERS', response)
          if (response['IsError'] === 'true') {
            console.log('MY ERROR', response['ErrMsg'])
            return of([])
          } else {
            return response['Data'].NewsletterTpls
          }
        }),
        catchError(err => {
          console.log('ERROR', err)
          return of([])
        }),
        shareReplay(1)
      )

    }
    return this.templates$;
  }

  getNewsletterById(id: number) {
    return this.http.get(`${this.baseUrl}NewsLetter/GetNewsLetterTplById?urlAddr=${this.generalService.getOrgName()}&TplCodeId=${id}`)
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

  loadDemoTemplate(newsletterToken: string, changeHistoryContainer?: ElementRef) {
    // localStorage.setItem('id_newstoken', token)
    //            request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.html', null, function(html) {
    //                request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.css', null, function(css) {
    //                    callback({html: html, css: css});
    //                });
    //           });
    this.request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Empty-Template/Empty-Template.html', null, (html) => {
      this.request('GET', 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Empty-Template/Empty-Template.css', null, (css) => {
        this.initPlugin({ html: html, css: css }, newsletterToken, changeHistoryContainer);
      });
    });
  }


  getNewsletterFileList(type: string):Observable<NewsletterFiles> {
    return this.http.post<Response>(`${this.baseUrl}NewsLetter/GetNewsletterFileList?urlAddr=${this.generalService.getOrgName()}&filetype=${type}`, '')
      .pipe(
        catchError(err => {

          console.log('ERROR', err)
          return of([])
        }),
        map((response: Response) => response.Data.GetNewsLetterTplById),
        map((files: NewsletterFile[]) => files.map(file => {

          const newFile = {};

          for (let key in file) {
            newFile[key[0].toLowerCase() + key.substr(1)] = file[key];
          }

          return newFile
        })),
        map(files => {
        
          return { [type]: files }
        })
      )
  }

  // https://jaffawebapisandbox.amax.co.il/Api/NewsLetter/GetNewsletterFileList?urlAddr=jaffanet1&filetype=docs 

  // Call this function to start plugin.
  // For security reasons it is STRONGLY recommended NOT to store your PLUGIN_ID and SECRET_KEY on client side.
  // Please use backend middleware to authenticate plugin.
  // See documentation: https://stripo.email/plugin-api/
  initPlugin(template: { html: string, css: string }, newsletterToken: string, changeHistoryContainer?: ElementRef) {
    this.token = newsletterToken
    const token = newsletterToken
    const apiRequestData = {
      emailId: this.generalService.getOrgId()
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
          onInitialized: (lastChangeIndoText) => changeHistoryContainer.nativeElement.show()
        },

        getAuthToken: (callback) => {
          callback(token);
        }


      });


    };
    document.body.appendChild(script);
  }

  clearTemplates() {
    this.templates$ = undefined;
  }

  dispatchAction(event: { action: string, item?: any }) {
    this.actionFromChild$.next(event)
  }

  showNotification(message) {
    console.log(message)
  }


}
