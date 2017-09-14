import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/httpservices/base.service";
import {API, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";

@Injectable()
export class ProficiencyDomainService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getProficiency(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.PROFICIENCYLIST;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  addCandidateProficiency(candidateproficiency: string[]): Observable<string[]> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'proficiencies': candidateproficiency});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addProficiencyToMasterData(newProficiency: string): Observable<string[]> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({});
    let url: string = API.PROFICIENCYLIST + '?proficiency=' + newProficiency;
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
