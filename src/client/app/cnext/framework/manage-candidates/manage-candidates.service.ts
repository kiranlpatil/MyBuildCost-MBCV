import {BaseService} from "../../../shared/services/http/base.service";
import {Injectable} from "@angular/core";
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class ManageCandidatesService extends BaseService {

  constructor(private http: Http) {
      super();
  }

  getMyCareerPageSummary(fromDate: string, toDate: string):Observable<any> {
    let url = 'recruiter/'+ LocalStorageService.getLocalValue(LocalStorage.END_USER_ID)
      +'/recruiterCandidatesSummary' + '?from=' + fromDate + '&to=' + toDate;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
