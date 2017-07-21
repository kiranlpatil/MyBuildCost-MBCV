import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class IndustryDataService {

  // Observable string sources
  _isCall = new Subject<boolean>();

  // Observable string streams
  makeCall$ = this._isCall.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._isCall.next(isAnswerTrue);
  }
}
