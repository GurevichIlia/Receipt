import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { KevaRemark } from './../../../../payments.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-edit-remark',
  templateUrl: './edit-remark.component.html',
  styleUrls: ['./edit-remark.component.css']
})
export class EditRemarkComponent implements OnInit {
  remarkControl = new FormControl('', Validators.required);
  oldRemarkValue = '';
  title = ''
  constructor(
    private toaster: ToastrService,
    private dialogRef: MatDialogRef<EditRemarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kevaRemark: KevaRemark, title: string }
  ) { }

  set remark(remark) {

    this.remarkControl.patchValue(remark);


  }

  ngOnInit() {
    if (this.data.kevaRemark) {
      this.remark = this.data.kevaRemark.Remark;
      this.oldRemarkValue = this.data.kevaRemark.Remark;
    }
    this.title = this.data.title;

  }

  onConfirm(): void {
    let id: number;
    if (this.remarkControl.valid && this.remarkControl.value !== this.oldRemarkValue) {
      if (this.data.kevaRemark) {
        id = this.data.kevaRemark.Id
      } else {
        id = 0;
      }

      const remark = this.remarkControl.value
      // Close the dialog, return true
      this.dialogRef.close({ action: true, payload: { id, remark } });
    } else if (!this.remarkControl.valid) {
      const message = 'Please fill in the required fields';
      this.toaster.warning('', message, {
        positionClass: 'toast-top-center'
      });
    } else if (this.remarkControl.value === this.oldRemarkValue) {
      this.onDismiss();
    }


  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }


}
