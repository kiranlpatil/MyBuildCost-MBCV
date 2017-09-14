import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../shared/services/httpservices/base.service';
import { API } from '../../../shared/constants';

@Injectable()
export class MultiSelectService extends BaseService {

  constructor(private http: Http) {
    super();
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
