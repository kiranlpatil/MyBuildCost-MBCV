import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";


@Injectable()

export class ProfileComparisonService {

  constructor(private http:Http) {

  }
  getCompareDetail(candidateId: string, recruiterId: string): Observable<any> {

    var url = API.RElEVENT_INDUSTRIES + '?candidateId=' + JSON.stringify(candidateId)+'&recruiterId=' + recruiterId;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}

