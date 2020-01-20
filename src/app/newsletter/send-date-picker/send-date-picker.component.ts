
import { SendDatePickerService } from './send-date-picker.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-send-date-picker',
  templateUrl: './send-date-picker.component.html',
  styleUrls: ['./send-date-picker.component.css'],
})
export class SendDatePickerComponent implements OnInit, OnDestroy {
  @Input() datepickerForm: FormGroup;
  today = new Date()
  constructor(private pickerService: SendDatePickerService) { }

  ngOnInit() {

  }

  get hours() {
    return this.datepickerForm.get('hours')
  }
  get minutes() {
    return this.datepickerForm.get('minutes')
  }


  incrementHour() {
    this.pickerService.incrementHour(this.hours)
  }

  dicrementHour() {
    this.pickerService.dicrementHour(this.hours)
  }

  incrementMinute() {
    this.pickerService.incrementMinute(this.minutes)
  }

  dicrementMinute() {
    this.pickerService.dicrementMinute(this.minutes)
  }


  ngOnDestroy() {
  }
}