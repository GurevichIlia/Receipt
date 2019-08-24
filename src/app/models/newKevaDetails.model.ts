export class NewKevaDetails {
      Customerid: number;
      MountToCharge: number;
      HokDonationTypeId: number;
      AccountID: number;
      KEVAStart: string;
      KEVAEnd: string;
      KEVANAME: string;
      ShortComment: string;
      BankCode: string;
      AccountNo: string;
      SnifNo: string;
      ID: string;
      customercreditCardid: number;
      TotalMonthtoCharge: number;
      TotalChargedMonth: number;
      TotalLeftToCharge: number;
      CurrencyId: string;
      EmployeeId: number;
      HokProjectId: number;
      KEVAJoinDate: string;
      KEVACancleDate: string;
      LastChargeDate: string;
      HokChargeDay: number;
      instituteId: number;
      RecieptTypeId: number;
      RecieptTypeIdREC: number;
      HokType: number;
      NameOnTheReciept: string;
      Address: string;
      Phone1: string;
      Phone2: string;
      KevaStatusId: number;
      NewSumToCharge: number;
      NewSumAfterChargeNo: number;
      GroupId: number;
      createDate: string;
      tadirut: number;
      endchargedate: string;
      maxToCharge: number;
      ThanksLetterId: number;
      KevaMakeRecieptByYear: number;
      email: string;
      Kevaid?: number
      constructor() {

      }

      setValueNewKeva(Customerid: number, MountToCharge: number, HokDonationTypeId: number, AccountID: number, KEVAStart: string, KEVAEnd: string,
            KEVANAME: string,
            ShortComment: string,
            BankCode: string,
            AccountNo: string,
            SnifNo: string,
            ID: string,
            customercreditCardid: number,
            TotalMonthtoCharge: number,
            TotalChargedMonth: number,
            TotalLeftToCharge: number,
            CurrencyId: string,
            EmployeeId: number,
            HokProjectId: number,
            KEVAJoinDate: string,
            KEVACancleDate: string,
            LastChargeDate: string,
            HokChargeDay: number,
            instituteId: number,
            RecieptTypeId: number,
            RecieptTypeIdREC: number,
            HokType: number,
            NameOnTheReciept: string,
            Address: string,
            Phone1: string,
            Phone2: string,
            KevaStatusId: number,
            NewSumToCharge: number,
            NewSumAfterChargeNo: number,
            GroupId: number,
            createDate: string,
            tadirut: number,
            endchargedate: string,
            maxToCharge: number,
            ThanksLetterId: number,
            KevaMakeRecieptByYear: number,
            email: string) {
            const newKeva = <NewKevaDetails>{
                  Customerid,
                  MountToCharge,
                  HokDonationTypeId,
                  AccountID,
                  KEVAStart,
                  KEVAEnd,
                  KEVANAME,
                  ShortComment,
                  BankCode,
                  AccountNo,
                  SnifNo,
                  ID,
                  customercreditCardid,
                  TotalMonthtoCharge,
                  TotalChargedMonth,
                  TotalLeftToCharge,
                  CurrencyId,
                  EmployeeId,
                  HokProjectId,
                  KEVAJoinDate,
                  KEVACancleDate,
                  LastChargeDate,
                  HokChargeDay,
                  instituteId,
                  RecieptTypeId,
                  RecieptTypeIdREC,
                  HokType,
                  NameOnTheReciept,
                  Address,
                  Phone1,
                  Phone2,
                  KevaStatusId,
                  NewSumToCharge,
                  NewSumAfterChargeNo,
                  GroupId,
                  createDate,
                  tadirut,
                  endchargedate,
                  maxToCharge,
                  ThanksLetterId,
                  KevaMakeRecieptByYear,
                  email
            }

            return newKeva;
      }
}