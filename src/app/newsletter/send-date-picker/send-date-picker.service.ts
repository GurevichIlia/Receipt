import { Injectable } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';

@Injectable()
export class SendDatePickerService {

  constructor() { }


  addZero(value: string) {
    if (value.length === 1) {
      value = `0${value}`
    }
    return value
  }

  incrementHour(formControl: AbstractControl) {
    if (formControl.value === '23') {
      formControl.patchValue('00')
    } else {
      let value = formControl.value
      value++
      formControl.patchValue(this.addZero(value.toString()))
    }

  }

  dicrementHour(formControl: AbstractControl) {
    if (formControl.value === '00') {
      formControl.patchValue('23')
    } else {
      let value = formControl.value
      value--
      formControl.patchValue(this.addZero(value.toString()))
    }

  }

  incrementMinute(formControl: AbstractControl) {
    if (formControl.value === '59') {
      formControl.patchValue('00')
    } else {
      let value = formControl.value
      value++
      formControl.patchValue(this.addZero(value.toString()))
    }

  }

  dicrementMinute(formControl: AbstractControl) {
    if (formControl.value === '00') {
      formControl.patchValue('59')
    } else {
      let value = formControl.value
      value--
      formControl.patchValue(this.addZero(value.toString()))
    }

  }

  checkLength(formData: { date: Date, hours: string, minutes: string }, hours: AbstractControl, minutes: AbstractControl) {
    if (formData.hours.length === 1) {
      hours.patchValue(`0${formData.hours}`, { emitEvent: false })
    }
    if (+formData.hours >= 24) {
      hours.patchValue('23', { emitEvent: false })
    }

    if (formData.minutes.length === 1) {
      minutes.patchValue(`0${formData.minutes}`, { emitEvent: false })
    }
    if (+formData.minutes >= 60) {
      minutes.patchValue('59', { emitEvent: false })
    }
  }
  // incrementHour(value: number) {
  //   debugger
  //   if (value === 24) {
  //     value = 0
  //   } else {
  //     value = value + 1
  //   }

  // }

  // dicrementHour(value: number) {
  //   if (value === 0) {
  //     value = 24
  //   } else {
  //     value = value--
  //   }

  // }

  // incrementMinute(value: number) {
  //   if (value === 59) {
  //     value = 59
  //   } else {
  //     value = value++
  //   }

  // }

  // dicrementMinute(value: number) {
  //   if (value === 0) {
  //     value = 59
  //   } else {
  //     value = value--
  //   }
  // }
}
