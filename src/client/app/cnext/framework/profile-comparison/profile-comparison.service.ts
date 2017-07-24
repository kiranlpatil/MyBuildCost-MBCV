import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {API, LocalStorage} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";


@Injectable()

export class ProfileComparisonService extends BaseService{

  constructor(private http:Http) {
    super();
  }
  getCompareDetail(candidateId: string[], jobId: string): Observable<any> {
    var id=  LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var url = 'recruiter'+'/'+ id +'/'+'jobprofile'+'/'+ jobId +'?candidateId=' + JSON.stringify(candidateId);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}

