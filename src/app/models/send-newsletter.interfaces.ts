import { Group } from './../shared/services/receipts.service';
export interface NewSender {
      name: string;
      mailFrom: string;
      replyMailName: string;
      replyToMail: string;
      id: number;
      deleteRow: number
}

export interface Sender {
      MailFrom: string;
      Name: string;
      OrganizationId: number;
      ReplyEmailName: string;
      ReplytoMail: string;
      id: number;
      deleteRow?: number
}

export interface senderData {
      name: string;
      mailFrom: string;
      replyEmailName: string;
      replyToMail: string;
      TplCodeId: number;
      subject: string;
      groups: Group[];
      sendLater: number;
      sendDate_year?: string;
      sendDate_mont?: string;
      sendDate_day?: string;
      sendHour?: string;// 17:00
      olang: number;
      mailToGender: number;
      record2customerService: number;
}




