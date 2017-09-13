import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {API, BaseService} from "../../../shared/index";
import {Headers, Http, RequestOptions} from "@angular/http";
import {CompanyDetails} from "./company-details";
import {AppSettings, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";


@Injectable()
export class CompanyDetailsService extends BaseService {
  model = new CompanyDetails();

  constructor(private http: Http) {

    super();
  }


  companyDetails(companyDetails: CompanyDetails): Observable<CompanyDetails> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify(companyDetails);
    let url = API.RECRUITER_PROFILE + "/" + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  makeDocumentUpload(files: Array<File>, params: Array<string>) {
    var url = AppSettings.API_ENDPOINT + API.UPLOAD_DOCUMENTS + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
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

  activateAccount(): Observable<any> {

    var url = API.VERIFY_USER + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    var newData = {'isActivated': true}; //JSON.stringify();
    return this.http.put(url, newData)
      .map(this.extractData)
      .catch(this.handleError);

  }


}
