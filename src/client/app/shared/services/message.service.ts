import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Message} from "../models/message";

@Injectable()
export class MessageService {
  MessageSource = new Subject<Message>();
  messageObservable$ = this.MessageSource.asObservable();


  message(message: Message) {
    this.MessageSource.next(message);
  }
}

