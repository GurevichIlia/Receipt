import { HttpClient } from '@angular/common/http';
import { GeneralSrv } from '../receipts/services/GeneralSrv.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GeneralGroups } from '../models/generalGroups.model';
import { map } from 'rxjs/operators';

export class SendMessageForm {
  CellFrom: string;
  Msg: string;
  date: string;
  groups: number[];
}
export class TodoItemNode {
  GroupId: number;
  GroupName: string;
  GroupNameEng: string;
  isSelected?: boolean;
  GroupParenCategory: number;
  Quick: boolean;
  SecurityLevel: number;
  isHide: boolean;
  isKeva: boolean;
  isTop: boolean;
  isWork: boolean;
  children?: GeneralGroups[];
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  GroupId: number;
  GroupName: string;
  GroupNameEng: string;
  isSelected: boolean;
  GroupParenCategory: number;
  Quick: boolean;
  SecurityLevel: number;
  isHide: boolean;
  isKeva: boolean;
  isTop: boolean;
  isWork: boolean;
  children?: GeneralGroups[];
  // item: object;
  level: number;
  expandable: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class SendMessageService {
  generalGroups: GeneralGroups[] = [];
 
  selectedGroups = new Subject();
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/LandingPage/';
  orgName: string;
  
  constructor(
    private generalService: GeneralSrv,
    private http: HttpClient
  ) {
    console.log('SEND NESSAGE SERVICE LOADED');

  }
  /** Add an item to to-do list */
  // insertItem(parent: TodoItemNode, name: string) {
  //   if (parent.children) {
  //     parent.children.push({ GroupName: name } as TodoItemNode);
  //     this.dataChange.next(this.data);
  //   }
  // }
  // updateItem(node: TodoItemNode, name: string) {
  //   node.GroupName = name;
  //   this.dataChange.next(this.data);
  // }

  // createHebrewAlphabet() {
  //   let groupArray = 'אבגדהוזחטיכלמנסעפצקרשת';
  //   const hebrewAlphabet = groupArray.split('');
  //   console.log('GROUP ARRAY', hebrewAlphabet, groupArray);
  //   return hebrewAlphabet;
  // }
  sendToServer(orgName: string, option: number, sendMessageForm?: SendMessageForm) {
    console.log('SMS DATA', sendMessageForm)
    return this.http.post(`${this.baseUrl}SendGoupSMS?orgGuid=${orgName}&verifyOnly=${option}`, sendMessageForm)
    .pipe(map(response => response['Data']));
  }
}
