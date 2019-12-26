import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {
  questionText: string = '';
  questionItemInfo: string = '';
  acceptButtonName: string = 'Confirm';
  closeButtonName: string = 'Cancel';
  constructor(public matDialogRef: MatDialogRef<AskQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { questionText: string, acceptButtonName?: string, closeButtonName?: string, item?: { name?: string, id?: number } }
  ) { }

  ngOnInit() {
    this.createQuestionText();

    this.acceptButtonName = this.data.acceptButtonName;
    this.closeButtonName = this.data.closeButtonName

  }


  createQuestionText() {
    if (this.data.item) {
      const fileAs = this.data.item.name.trim() ? `על שם ${this.data.item.name}` : '';
      if (this.data.item.id) {
        this.questionItemInfo = `${this.data.item.id} ${fileAs}`
      } else {
        this.questionItemInfo = `${fileAs}`
      }
    }

    this.questionText = this.data.questionText

  }

  close() {
    this.matDialogRef.close(false);
  }

  accept() {
    this.matDialogRef.close(true);
  }
}


