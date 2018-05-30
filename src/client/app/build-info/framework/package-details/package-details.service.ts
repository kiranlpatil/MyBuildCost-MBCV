import { Injectable } from '@angular/core';
import { API, BaseService, MessageService } from '../../../shared/index';
import { HttpDelegateService } from '../../../shared/services/http-delegate.service';


@Injectable()
export class PackageDetailsService extends BaseService {

  constructor(protected messageService: MessageService, protected httpDelegateService : HttpDelegateService) {
    super();
  }

  getBaseSubscriptionPackageList() {
    var url = API.SUBSCRIPTION + '/' + API.BASE_PACKAGES_LIST;
    return this.httpDelegateService.getAPI(url);
  }
}



