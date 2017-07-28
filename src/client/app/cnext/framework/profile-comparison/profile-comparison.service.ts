import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {LocalStorage} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";


@Injectable()

export class ProfileComparisonService extends BaseService{

  constructor(private http:Http) {
    super();
  }

  getCompareDetail(candidateIde: string[], jobId: string): Observable<any> {
    var id=  LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var candidateId = ['5979825b64aa3dae0dfb46f6', '5979845064aa3dae0dfb47d3', '597a25bd64aa3dae0dfb4c2f'];
    var url = 'recruiter' + '/' + id + '/' + 'jobprofile' + '/' + '597981a064aa3dae0dfb463d' + '?candidateId=' + JSON.stringify(candidateId);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}

