import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, AppSettings, BaseService, LocalStorage, LocalStorageService, MessageService} from "../../shared/index";
import {CandidateDetail} from "../registration/candidate/candidate";

@Injectable()
export class DashboardService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getUserProfile(): Observable<any> { //todo
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateProfile(model: CandidateDetail): Observable<CandidateDetail> {
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  makeDocumentUpload(files: Array<File>, params: Array<string>) {
    var url = AppSettings.API_ENDPOINT + API.UPDATE_PICTURE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
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
      xhr.setRequestHeader('Authorization', 'Bearer ' + LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN));
      xhr.send(formData);
    });
  }
}
