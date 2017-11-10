import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";


@Injectable()

export class ProfileComparisonService extends BaseService {

  constructor(private http:Http) {
    super();
  }

  getCompareDetail(candidateId: string[], jobId: string): Observable<any> {
    var id=  LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var url = 'recruiter' + '/' + id + '/' + 'jobprofile' + '/' + jobId + '?candidateId=' + JSON.stringify(candidateId);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}

