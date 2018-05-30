import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API, AppSettings, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../shared/index';
import { CandidateDetail } from '../models/candidate-details';

@Injectable()
export class DashboardService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getUserProfile(): Observable<any> { //todo
    var url = API.USER_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateProfile(model: CandidateDetail): Observable<CandidateDetail> {
    var url = API.USER_PROFILE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  makeDocumentUpload(files: Array<File>, params: Array<string>) {
    var url = AppSettings.API_ENDPOINT + API.UPDATE_PICTURE + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    return new Promise((resolve: any, reject: any) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      formData.append('file', files[0], files[0].name);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + SessionStorageService.getSessionValue(SessionStorage.ACCESS_TOKEN));
      xhr.send(formData);
    });
  }
  changeRecruiterAccountDetails(model:any): Observable<any> {
    var url = API.CHANGE_COMPANY_ACCOUNT_DETAILS + '/' + SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    var body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);

  }
}
