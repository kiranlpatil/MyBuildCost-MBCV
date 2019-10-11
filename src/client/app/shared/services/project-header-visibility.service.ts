import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class ProjectHeaderVisibilityService {

  updateProjectHeaderVisibilityStatusService = new BehaviorSubject<boolean>(true);
  changeProjectHeaderVisibilityStatus$ = this.updateProjectHeaderVisibilityStatusService.asObservable();

  change(isShowHeader: boolean) {
    this.updateProjectHeaderVisibilityStatusService.next(isShowHeader);
  }
}

