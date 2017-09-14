import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/services/message.service';
import { Message } from '../../shared/models/message';



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
