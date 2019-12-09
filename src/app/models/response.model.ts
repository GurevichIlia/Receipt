export interface Response {
      Data: any;
      ErrMsg: string;
      IsError: boolean;
}

export interface ResponseData {
      error: string;
      res_description: string;
      customerid?: string;
}