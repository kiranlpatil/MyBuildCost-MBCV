import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../../../shared/index';


@Injectable()
export class GetRateService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

  updateRateItems(costheadId:number,subCategoryId:number,workItemId:number,rateItemsArray:any) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    var body=rateItemsArray;
    var url = API.VIEW_PROJECT + '/' + SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT)+
      '/'+ API.VIEW_BUILDING + '/' +SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)+
      '/' + API.RATE + '/costhead/' + costheadId + '/subcategory/'+subCategoryId + '/workitem/'+workItemId ;// +costHeadItem;
    console.log('updateRateItems url : '+url);
    return this.http.put(url,body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
