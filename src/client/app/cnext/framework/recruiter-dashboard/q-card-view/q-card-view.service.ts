import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {BaseService} from "../../../../shared/services/http/base.service";
import {Headers, Http, RequestOptions} from "@angular/http";
import {LocalStorage} from "../../../../shared/constants";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";

@Injectable()
export class QCardViewService extends BaseService {
  constructor(private http: Http) {
    super();
  }

  getSearchedcandidate(id: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = '/api/recruiter/jobProfile/' + id + '/candidates';
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCandidateLists(profileId: string, candidateId: string, listName: string, action: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = 'recruiter/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/jobProfile/' + profileId + '/' + listName + '/' + candidateId + '/' + action;
    let body: any = {};
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
