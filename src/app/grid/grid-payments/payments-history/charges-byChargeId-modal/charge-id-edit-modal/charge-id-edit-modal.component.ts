import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Output, Inject, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { KevaChargeById } from 'src/app/models/kevaChargeById.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-charge-id-edit-modal',
  templateUrl: './charge-id-edit-modal.component.html',
  styleUrls: ['./charge-id-edit-modal.component.css']
})
export class ChargeIdEditModalComponent implements OnInit {
  reasonFormGroup = new FormGroup({
    reasonRemark: new FormControl('', Validators.required),
    reasonId: new FormControl('', Validators.required)
  });
  reasons$: Observable<{ ReturnResonId: number, ReturnResonname: string }[]>
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: { chargeById: KevaChargeById, reasons$: Observable<{ ReturnResonId: number, ReturnResonname: string }[]> },
    public DialogRef: MatDialogRef<ChargeIdEditModalComponent>
  ) {
  }
  ngOnInit() {
    console.log('GOT DATA', this.dialogData)
    this.getReasons();
    this.setReasons();

  }
  getReasons() {
    this.reasons$ = this.dialogData.reasons$.pipe(map(data => {
      console.log(data)
      return data
    }));
  }
  getReasonForm() {
    return this.reasonFormGroup;
  }
  submitNewData() {
    this.DialogRef.close({ action: this.getReasonForm().value })
  }
  closeDialog() {
    this.DialogRef.close({ action: 'Cancel' })
  }
  setReasons() {
    this.getReasonForm().patchValue({
      reasonRemark: this.dialogData.chargeById.Remark,
      reasonId: this.dialogData.chargeById.ReturnResonId
    })
  }
  closeModal() {
    this.DialogRef.close({ action: 'Cancel' });
  }
}
