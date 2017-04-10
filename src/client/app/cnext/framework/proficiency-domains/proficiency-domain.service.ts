import {  Injectable  } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {  Observable  } from 'rxjs/Observable';
import { BaseService } from '../../../framework/shared/httpservices/base.service';
import {API, LocalStorage} from '../../../framework/shared/constants';
import {LocalStorageService} from "../../../framework/shared/localstorage.service";

@Injectable()
export class ProficiencyDomainService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getProficiency(industry:string):Observable<any> {
    var url = API.PROFICIENCYLIST;
    var industry=industry;
    var tempurl='industry/'+industry+'/proficiency';
    return this.http.get(tempurl)
      .map(this.extractData)
      .catch(this.handleError);
  }


addCandidateProficiency(candidateproficiency:string[]):Observable<string[]>{
  let headers=new Headers({'Content-Type':'application/json'});
  let options=new RequestOptions({headers:headers});
  let body=JSON.stringify({"proficiencies":candidateproficiency})
  let url:string=API.CANDIDATE_PROFILE+'/'+LocalStorageService.getLocalValue(LocalStorage.USER_ID);
  return this.http.put(url, body,options)
    .map(this.extractData)
    .catch(this.handleError);
}

  addProficiencyToMasterData(newProficiency:string,selectedIndustry:string):Observable<string[]>{
    let headers=new Headers({'Content-Type':'application/json'});
    let options=new RequestOptions({headers:headers});
    let body=JSON.stringify({})
    let url:string=API.INDUSTRY_LIST+'/'+selectedIndustry+'/proficiency?proficiency='+newProficiency;
    return this.http.put(url, body,options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
