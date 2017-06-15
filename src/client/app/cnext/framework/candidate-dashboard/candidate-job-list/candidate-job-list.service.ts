import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../../../../framework/shared/httpservices/base.service';
import { API, LocalStorage, ValueConstant } from '../../../../framework/shared/constants';
import { LocalStorageService } from '../../../../framework/shared/localstorage.service';

@Injectable()
export class CandidateJobListService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getAppliedJobList() {
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) + '/list/' + ValueConstant.APPLIED_CANDIDATE;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBlockedJobList() {
    let url: string = API.CANDIDATE_PROFILE + '/' + LocalStorageService.getLocalValue(LocalStorage.END_USER_ID) +
      '/list/' + ValueConstant.BLOCKED_CANDIDATE;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
