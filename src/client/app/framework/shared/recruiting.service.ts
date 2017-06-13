import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";


@Injectable()
export class RecruitingService {

  recruitmentSource = new Subject<boolean>();
  //showRecruitmentFor$ Observable to observe recruitmentSource
  showRecruitmentFor$ = this.recruitmentSource.asObservable();

  change(recruitmentFor: boolean) {
    this.recruitmentSource.next(recruitmentFor);
  }
}

