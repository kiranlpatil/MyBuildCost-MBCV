import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';


@Injectable()
export class CostSummaryService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  getProjectDetails(projectId: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBuildingDetails(projectId: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId +'/'+ API.ADD_BUILDING +
      '/'+SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCost(projectId: string,defaultCostIn:string,defaultCostPer:string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    console.log('defaultCostIn : '+defaultCostIn);
    console.log('defaultCostPer : '+defaultCostPer);

    var url = API.THUMBRULE_RULE_RATE + '/'+ API.VIEW_PROJECT +'/'+projectId+'/';

    if(defaultCostIn==='Rs/Sqft') {
      url=url + 'rate/' + API.SQFT;
    }    else {
      url=url + 'rate/' + API.SQM;
    }


    if(defaultCostPer==='SlabArea') {
      url=url + '/area/' + API.SLAB_AREA;
    }    else {
      url=url + '/area/' + API.SALEABLE_AREA;
    }

    console.log('url -> '+url);

    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteQuanatityDetails(buildingId:string, costHead:string) {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT);
    var url = 'project/'+projectId+'/'+API.VIEW_BUILDING+'/'+buildingId+'/'+'costhead/'+costHead+'/false';
    let body = {};
    return this.http.put(url, body)
      .map(this.extractData)
      .catch(this.handleError);
  }


  getCosthead(projectId:any,buildingID:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId +'/'+ API.VIEW_BUILDING + '/' +buildingID + '/costhead';
    console.log('url getcosthead() ->'+url);
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addCosthead(selectedinActiveCostHead:any,projectId:any,buildingID:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var url = API.VIEW_PROJECT + '/'+ projectId +'/'+ API.VIEW_BUILDING + '/' +buildingID + '/costhead/' +selectedinActiveCostHead+'/true';
    console.log('url addCosthead() ->'+url);
    return this.http.put(url,options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  }
