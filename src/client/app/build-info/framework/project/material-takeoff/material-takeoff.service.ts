import { Injectable } from '@angular/core';
import { Http, } from '@angular/http';
import { BaseService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';
import { API } from '../../../../shared/index';


@Injectable()
export class MaterialTakeoffService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  getMaterialFiltersList(projectId: string) {
    console.log('getMaterialFiltersList');
    var url = API.REPORT_MATERIAL_TAKE_OFF + '/' + API.PROJECT + '/' +projectId+ '/' + API.MATERIAL_FILTERS_LIST;
    console.log(url);
    return this.httpDelegateService.getAPI(url);
  }
}
