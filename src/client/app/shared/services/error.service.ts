import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Message } from '../models/message';



@Injectable()
export class ErrorService {
constructor(private messageService: MessageService){}

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    message.error_code=error.err_code;
    this.messageService.message(message);
  }

}
