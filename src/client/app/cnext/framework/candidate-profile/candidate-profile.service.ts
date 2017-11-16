import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/http/base.service";
import {API, LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {Candidate} from "../../../user/models/candidate";
import {ErrorService} from "../../../shared/services/error.service";

@Injectable()
export class CandidateProfileService extends BaseService {

  constructor(private errorService:ErrorService,private http: Http) {
    super();
  }

  addProfileDetail(profile: Candidate): Observable<Candidate> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify(profile);
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateStepTracking(value:number) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    //let body = JSON.stringify(item);
    let url: string = API.CANDIDATE_PROFILE + '/' +'fieldUpdate'+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID)+'?value='+value;
    this.http.put(url, {}, options)
      .map(this.extractData)
      .catch(this.handleError)
      .subscribe(
      res => {
      }, error => this.errorService.onError(error));
  }

  getCandidateDetails(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
   // let options = new RequestOptions({headers: headers});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getRecruiterDetails() :Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let url: string = API.RECRUITER_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID) + '/jobs';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getJobsInIndustry(industryCode:string) :Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let url: string = API.JOBS + '/' +industryCode;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCandidateAllDetails(userId:string):Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url:string = API.CANDIDATE_DETAIL_PROFILE + '/' + userId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMasterIndustry(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getCandidateDetailsOfParticularId(candidateId: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID) + '/' + candidateId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getIndustries(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = API.INDUSTRY_LIST;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

//why it is here
  getRoles(industry: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    if (industry == undefined) {
      return null;
    }
    let url = 'industry/' + industry + '/role';
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRoleTypes(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = API.ROLE_TYPE;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCapability(industry: string, roles: Array<string>): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = API.INDUSTRY_LIST + '/' + industry + '/' + API.ROLE_LIST + '/' + API.CAPABILITY_LIST + '?roles=' + JSON.stringify(roles);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getComplexity(industry: string, roles: Array<any>, capabilities: Array<any>): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = API.INDUSTRY_LIST + '/' + industry + '/' + API.ROLE_LIST + '/' + API.CAPABILITY_LIST + '/complexity?roles=' + JSON.stringify(roles) + '&capability=' + JSON.stringify(capabilities);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProficiency(): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = API.PROFICIENCYLIST;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


}
