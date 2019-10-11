import { Injectable } from '@angular/core';
import { API, BaseService, MessageService } from '../../../shared/index';
import { HttpDelegateService } from '../../../shared/services/http-delegate.service';


@Injectable()
export class AdminService extends BaseService {

  constructor(protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  createAllExcelFiles() {
    var url = API.USER + API.EXPORT_DATA;
    var body = {};
    return this.httpDelegateService.postAPI(url,body);
  }
}



