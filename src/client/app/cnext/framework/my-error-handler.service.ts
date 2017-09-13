import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { Message } from '../../shared/models/message';

@Injectable()
export class LoggerService {
  constructor(private messageService: MessageService){}

  log(error:any) {
    var message = new Message();
    message.error_msg = error.message;
    message.isError = true;
    this.messageService.message(message);
  }
}

@Injectable()
export class MyErrorHandler extends ErrorHandler {

  constructor(private logger: LoggerService) {
    // We rethrow exceptions, so operations like 'bootstrap' will result in an error
    // when an error happens. If we do not rethrow, bootstrap will always succeed.
    super(true);
  }

  handleError(error:any) {
    this.logger.log(error);
    super.handleError(error);
  }
}
