import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {BaseService} from "../../../../framework/shared/httpservices/base.service";
import {JobPosterModel} from "../../model/jobPoster";
import {Http, RequestOptions,Headers} from "@angular/http";
import {API} from "../../../../framework/shared/constants";

@Injectable()
export class   QCardViewService extends BaseService{

  constructor(private http:Http) {
    super();
  }
  getSearchedcandidate(id: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url ="/api/recruiter/jobProfile/"+id+"/candidates";
    return this.http.get(url,{},options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  addCandidateLists(recruiterId:string, profileId:string,candidateId:string, listName:string, action:string):Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let url:string="recruiter/"+recruiterId+"/jobProfile/"+profileId+"/"+listName+"/"+candidateId+"/"+action;
    let body:any={};
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
