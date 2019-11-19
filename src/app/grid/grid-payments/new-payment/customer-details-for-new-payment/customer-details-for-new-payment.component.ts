// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CustomerInfoById, CustomerAddresses } from 'src/app/models/customer-info-by-ID.model';
// import { Component, OnInit, Input } from '@angular/core';
// import { NewPaymentService } from '../new-payment.service';


// @Component({
//   selector: 'app-customer-details-for-new-payment',
//   templateUrl: './customer-details-for-new-payment.component.html',
//   styleUrls: ['./customer-details-for-new-payment.component.css']
// })
// export class CustomerDetailsForNewPaymentComponent implements OnInit {
//   customerDetails: CustomerInfoById;
//   userInfoGroup: FormGroup;
//   constructor(
//     private newPaymentService: NewPaymentService,
//     private fb: FormBuilder
//   ) { }

//   ngOnInit() {
//     this.createCustomerInfoForm();
//   }
//   createCustomerInfoForm() {
//     this.userInfoGroup = this.fb.group({
//       customerMainInfo: this.fb.group({
//         customerId: [null],
//         fname: [''],
//         lname: [''],
//         company: [''],
//         // tslint:disable-next-line: max-line-length
//         customerType: [''],
//         title: [''],
//         gender: [''],
//         customerCode: [''],
//         spouseName: [''],
//         fileAs: [''],
//         birthday: [''],
//         afterSunset1: [''],
//       }),
//       phones: this.fb.array([
//         this.fb.group({
//           phoneTypeId: [2],
//           phoneNumber: ['']
//         })
//       ]),
//       emails: this.fb.array([
//         this.fb.group({
//           emailName: [''],
//           email: ['', Validators.email],
//         })
//       ]),
//       address: this.fb.group({
//         cityName: [''],
//         street: [''],
//         street2: [''],
//         zip: [''],
//         addressTypeId: ['']
//       }),

//       groups: ['']
//     });
//   }

//   getCustomerDetails(customerDetails: CustomerInfoById) {
//     console.log('INPUTED', customerDetails)
//     this.customerDetails = customerDetails;
//   }

  // setCustomerDetailsToNewKevaService(customerEmails: CustomerEmails[], customerPhones: CustomerPhones[], customerAddress: CustomerAddresses[],
  //   customerMainInfo: Customermaininfo[] | MainDetails[],
  //   customerCreditCardTokens?: any[], customerGroupList?: CustomerGroupById[]
  // ) {
  //   const customerInfoById = {
  //     customerEmails,
  //     customerPhones,
  //     customerAddress,
  //     customerMainInfo,
  //     customerCreditCardTokens,
  //     customerGroupList
  //   }
  //   this.newPaymentService.setCustomerInfoForNewKeva(customerInfoById)
  // }


