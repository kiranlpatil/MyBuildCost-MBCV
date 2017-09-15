import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../shared/services/httpservices/base.service";

@Injectable()

export class ShareService extends BaseService {

  constructor(private http: Http) {
    super();
  }


  buildValuePortraitUrl():Observable<any> {
    var url = 'buildValuePortraitUrl';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
