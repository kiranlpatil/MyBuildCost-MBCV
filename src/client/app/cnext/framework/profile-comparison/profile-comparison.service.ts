import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/httpservices/base.service";
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";


@Injectable()

export class ProfileComparisonService extends BaseService {

  constructor(private http:Http) {
    super();
  }

  getCompareDetail(candidateId: string[], jobId: string): Observable<any> {
    var id=  LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    //var candidateId = ['5979825b64aa3dae0dfb46f6', '5979845064aa3dae0dfb47d3', '597a25bd64aa3dae0dfb4c2f', '597b1ef912bfacf80de44fc6', '597b1f421354eb2308db58cc'];
    var url = 'recruiter' + '/' + id + '/' + 'jobprofile' + '/' + jobId + '?candidateId=' + JSON.stringify(candidateId);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}

