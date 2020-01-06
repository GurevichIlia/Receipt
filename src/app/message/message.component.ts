import { GlobalStateService } from './../shared/global-state-store/global-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerGroupsService } from './../core/services/customer-groups.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  value = ''
  constructor(
    private customerGroupsService: CustomerGroupsService
  ) { }

  ngOnInit() {
    this.customerGroupsService.clearSelectedGroups();
  }

  ngOnDestroy() {
    this.customerGroupsService.clearSelectedGroups();
  }

  setValue(value) {
    debugger
    this.value = value
  }

  // test() {
  //   //   const fanc = this.setValue
  //   //   // const test = setInterval(function () {
  //   //   //   let x = new Date();
  //   //   //   this.value = x
  //   //   // console.log(this.value)
  //   //   // }, 1000)
  //   //   console.log(this.value)
  //   const second = 1000,
  //     minute = second * 60,
  //     hour = minute * 60,
  //     day = hour * 48;
  //   let newVal = null
    
  //   let x = setInterval( () => {
    
  //    console.log('THIS',  test )
  //     // let newsetValue = this.setValue.bind(this.setValue)
  //     var dt = new Date().toLocaleString("en-US", { timeZone: "Israel" });

  //     let countDown = new Date('Jan 01, 2020 00:00:00').getTime()

  //     //console.log(new Date( dt ));
  //     let now = new Date(dt).getTime(),
  //       distance = countDown - now;


  //     //     // document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)),
  //     //     // document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
  //     //     // document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

  //     //     console.log(Math.floor((distance % (day)) / (hour)));

  //     //     console.log(Math.floor((distance % (hour)) / (minute)))
  //     //     console.log(Math.floor((distance % (minute)) / (second)))

  //     newVal = `${Math.floor((distance % (day)) / (hour))} ${Math.floor((distance % (hour)) / (minute))} ${Math.floor((distance % (minute)) / (second))}`
  //     // newsetValue(newVal)


  //     //     this.setValue(newVal)
  //     //     // document.getElementById('hours1').innerText = Math.floor((distance % (day)) / (hour)),
  //     //     //   document.getElementById('minutes1').innerText = Math.floor((distance % (hour)) / (minute)),
  //     //     //   document.getElementById('seconds1').innerText = Math.floor((distance % (minute)) / second);

  //   }, second)

  // }


}
