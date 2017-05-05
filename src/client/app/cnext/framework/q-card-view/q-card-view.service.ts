import {Injectable} from "@angular/core";
import {BaseService} from "../../../framework/shared/httpservices/base.service";
import {Http, Headers, RequestOptions} from "@angular/http";
import {API} from "../../../framework/shared/constants";
import {JobPosterModel} from "../model/jobPoster";
@Injectable()
export class   QCardViewService extends BaseService{

  constructor(private http:Http) {
    super();
  }
  getSearchedcandidate(jobPosterModel:JobPosterModel)
  {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let url:string=API.SEARCHED_CANDIDATE+'/jobPosterModel?jobPosterModel='+jobPosterModel;
    return this.http.get(url,options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
