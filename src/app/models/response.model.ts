export interface Response {
      Data: Data;
      ErrMsg: string;
      IsError: boolean;
}

interface Data {
      error: string;
      res_description: string;
      customerid?: string;
}