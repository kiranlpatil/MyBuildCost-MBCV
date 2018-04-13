import { Injectable } from '@angular/core';
import { Http, } from '@angular/http';
import { BaseService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';
import { API } from '../../../../shared/index';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../model/project';
import { MaterialTakeOffFilters } from '../../model/material-take-off-filters';


@Injectable()
export class MaterialTakeOffService extends BaseService {

  constructor(protected httpDelegateService : HttpDelegateService) {
    super();
  }

  getMaterialFiltersList(projectId: string) {
    let url = API.REPORT_MATERIAL_TAKE_OFF + '/' + API.PROJECT + '/' +projectId+ '/' + API.MATERIAL_FILTERS_LIST;
    return this.httpDelegateService.getAPI(url);
  }

  getMaterialTakeOffReport(projectId : string, materialTakeOffFilters : MaterialTakeOffFilters): Observable<Project> {
    let url = API.REPORT_MATERIAL_TAKE_OFF + '/' + API.PROJECT + '/' +projectId;
    return this.httpDelegateService.postAPI(url, materialTakeOffFilters);
  }
}
