import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {API, LocalStorage} from "../../../framework/shared/constants";
import {LocalStorageService} from "../../../framework/shared/localstorage.service";

@Injectable()
export class ComplexityComponentService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getCapabilityMatrix(jobId : string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url : any;
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      url = API.CAPABILITY_MATRIX_FOR_CANDIDATE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
    }else {
      url = API.CAPABILITY_MATRIX_FOR_RECRUITER + '/' + jobId;
    }
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


}
