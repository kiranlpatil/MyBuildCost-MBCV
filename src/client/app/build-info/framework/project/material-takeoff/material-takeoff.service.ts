import { Injectable } from '@angular/core';
import { Http, } from '@angular/http';
import { BaseService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';
import { API } from '../../../../shared/index';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../model/project';


@Injectable()
export class MaterialTakeoffService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  materialFiltersList(projectId: string) {
    var url = API.REPORT_MATERIAL_TAKE_OFF + '/' + API.PROJECT + '/' +projectId+ '/' + API.MATERIAL_FILTERS_LIST;
    return this.httpDelegateService.getAPI(url);
  }

  getMaterialTakeOffReport(projectId : string, elementWiseReport : string, element : string, building : string): Observable<Project> {
    var url = API.REPORT_MATERIAL_TAKE_OFF + '/' + API.PROJECT + '/' +projectId;
    let body = {
      "elementWiseReport" : elementWiseReport,
      "element" : element,
      "building" : building
    };
    return this.httpDelegateService.postAPI(url, body);
  }
}
