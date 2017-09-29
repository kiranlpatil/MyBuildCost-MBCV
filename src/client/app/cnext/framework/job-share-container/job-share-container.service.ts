import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../shared/services/http/base.service';

@Injectable()

export class JobShareContainerService extends BaseService {

  constructor(private http:Http) {
    super();
  }

  getActualJobShareUrl(shortUrl:string):Observable<any> {
    var url = 'share' + '/' + shortUrl;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
