import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {
  comment: string;
  constructor(
    public matDialog: MatDialogRef<CommentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comment: string }
  ) { }

  ngOnInit() {
    this.comment = this.data.comment
  }
  saveComment() {
    this.matDialog.close(this.comment);
  }

  closeModal() {
    this.matDialog.close();
  }
}
