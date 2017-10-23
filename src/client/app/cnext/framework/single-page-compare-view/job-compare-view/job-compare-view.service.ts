import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../../shared/services/http/base.service";
import {API, LocalStorage} from "../../../../shared/constants";
import {Capability} from "../../../../user/models/capability";
import {Complexity} from "../../../../user/models/complexity";
import {Scenario} from "../../../../user/models/scenario";
import {LocalStorageService} from "../../../../shared/services/localstorage.service";

@Injectable()
export class JobCompareService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getCompareDetail(candidateId: string, recruiterId: string): Observable<any> {
    /*
     /api/recruiter/jobProfile/:jobId/matchresult/:candidateId

     */
    let isCandidate: boolean= false;
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      isCandidate = true;
    }else {
      isCandidate = false;
    }
    let url: string ;
    if(isCandidate) {
      url= API.CANDIDATE_PROFILE + '/' + candidateId + '/matchresult/' + recruiterId;
    }else {
      url= API.RECRUITER_PROFILE + '/jobProfile/' + recruiterId + '/matchresult/' + candidateId;
    }
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStandardMatrix(data : any) : Capability[] {
    let capabilities : Capability[] = new Array(0);
    for(let value1 in data) {
      let temp = capabilities.filter((capability : Capability)=> {
        if (capability.name.toString() === data[value1].capability_name.toString()) {
          return true;
        }else {
          return false;
        }
      });
      let cap : Capability;
      let complexities : Complexity[];
      if(temp.length>0) {
          cap = temp[0];
        complexities  = cap.complexities;
      }else {
        cap = new Capability();
        cap.name= data[value1].capability_name;
        cap.code= data[value1].capability_code;
        complexities  = new Array(0);
      }
      for(let value2 in data) {
        if(data[value1].capability_name === data[value2].capability_name) {
          let sce = new Scenario();
          sce.name = data[value2].scenario_name;
          sce.candidate_scenario_name=data[value2].candidate_scenario_name;
          sce.job_scenario_name=data[value2].job_scenario_name;
          let com = new Complexity();
          com.match= data[value2].match;
          com.name= data[value2].complexity_name;
          com.complexityDetails = data[value2];
          com.scenarios.push(sce);
          com.complexityNote = data[value2].complexityNote;
          
          let isFound : boolean= false;
          for(let complex of cap.complexities){
            if(complex.name === com.name ) {
              isFound =true;
              break;
            }
          }
          if(!isFound) {
            complexities.push(com);
          }
        }
      }
      if(temp.length > 0) {

      }else {
        cap.complexities=complexities;
        cap.complexities = this.sortComplexities(cap.complexities);
        capabilities.push(cap);
      }
      /*}
    for(let i=0 ;i<8;i++){
        capabilities.push(capabilities[i]);*/
    }
    return capabilities;
  }

  sortComplexities (complexities : Complexity[]): Complexity[] {
    complexities=complexities.sort((o1, o2) => {
      if (o1.match > o2.match) {
        return 1;
      }
      if (o1.match < o2.match) {
        return -1;
      }
      return 0;
    });
    return complexities;
  }


}
