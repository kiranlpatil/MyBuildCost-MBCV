import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class UpdateSubscriptionStatusService {

  updateSubscriptionStatusService = new BehaviorSubject<boolean>(true);
  changeSubscriptionStatus$ = this.updateSubscriptionStatusService.asObservable();

  change(isAnySubscriptionAvailable: boolean) {
    this.updateSubscriptionStatusService.next(isAnySubscriptionAvailable);
  }
}

