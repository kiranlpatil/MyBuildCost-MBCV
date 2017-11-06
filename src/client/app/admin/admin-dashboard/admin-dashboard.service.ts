import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../shared/services/http/base.service";
import {MessageService} from "../../shared/services/message.service";
import {API, LocalStorage} from "../../shared/constants";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {CandidateDetail} from "../../user/models/candidate-details";


@Injectable()
export class AdminDashboardService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getUserProfile(): Observable<any> {
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllUsers(letter: string): Observable<any> {
    var url = API.ALL_USER_PROFILE + '/' + letter;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCountOfUsers(): Observable<any> {
    var url = API.COUNT_OF_USERS;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCandidates(letter: string): Observable<any> {
    var url = API.GET_CANDIDATE_DETAILS + '/' + letter;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllRecruiters(letter: string): Observable<any> {
    var url = API.GET_RECRUITER_DETAILS + '/' + letter;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUsageDetails(): Observable<any> {
    var url = API.USAGE_DETAIL;
    return this.http.get(url);
  }

  getKeySkillsData(): Observable<any> {
    var url = API.KEY_SKILLS;
    return this.http.get(url);
  }

  generateCandidateDetailFile(): Observable<any> {
    var url = API.EXPORT_CANDIDATE_DETAIL_PROFILE;
    return this.http.get(url);
  }

  generateRecruiterDetailFile(): Observable<any> {
    var url = API.EXPORT_RECRUITER_DETAIL_PROFILE;
    return this.http.get(url);
  }

  updateProfile(model: CandidateDetail): Observable<CandidateDetail> {
    var url = API.USER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateUser(model: any): Observable<any> {
    var url = API.UPDATE_USER + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    let body = JSON.stringify(model);
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
