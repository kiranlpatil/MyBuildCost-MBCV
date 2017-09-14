import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseService } from '../../../shared/services/httpservices/base.service';
import { API, LocalStorage } from '../../../shared/constants';
import { LocalStorageService } from '../../../shared/services/localstorage.service';
import { AcademicDetails } from '../model/academic-details';

@Injectable()
export class CandidateAcademyDetailService extends BaseService {
  constructor(private http: Http) {
    super();
  }


  addCandidateAcademyDetails(academicDetails: AcademicDetails[]): Observable<AcademicDetails[]> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let body = JSON.stringify({'academics': academicDetails});
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    return this.http.put(url, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
