export class Message {
  error_msg: any; //string
  error_code: number; //string
  custom_message: string;
  isError: boolean;
  constructor(err?:string) {
    this.custom_message=err;
  }
}
