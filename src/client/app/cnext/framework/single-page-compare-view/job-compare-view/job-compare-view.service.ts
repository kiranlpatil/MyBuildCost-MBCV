import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {BaseService} from "../../../../framework/shared/httpservices/base.service";
import {API} from "../../../../framework/shared/constants";
import {Capability} from "../../model/capability";
import {Complexity} from "../../model/complexity";
import {Scenario} from "../../model/scenario";

@Injectable()
export class JobCompareService extends BaseService {

  constructor(private http: Http) {
    super();
  }

  getCompareDetail(candidateId: string, recruiterId: string): Observable<any> {
    /*
     /api/recruiter/jobProfile/:jobId/matchresult/:candidateId

     */
    let url: string = API.RECRUITER_PROFILE + '/jobProfile/' + recruiterId + '/matchresult/' + candidateId;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStandardMatrix(data : any) : Capability[] {
    let capabilities : Capability[] = new Array(0);
    for(let value1 in data) {
      let temp = capabilities.filter((capability : Capability)=> {
        if(capability.name == data[value1].capability_name) {
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
        complexities  = new Array(0);
      }
      for(let value2 in data) {
        if(data[value1].capability_name === data[value2].capability_name) {
          let sce = new Scenario();
          sce.name = data[value2].scenario_name;
          let com = new Complexity();
          com.match= data[value2].match;
          com.name= data[value2].complexity_name;
          com.complexityDetails = data[value2];
          com.scenarios.push(sce);
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
