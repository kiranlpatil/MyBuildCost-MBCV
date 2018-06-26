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

  getSubscriptionPackageByName(body : any) {
    var url = API.SUBSCRIPTION + '/'+ API.BY_NAME ;
    return this.httpDelegateService.postAPI(url,body);

  }

  getRetainOrRenewProject(projectId:string, body : any) {
    var url = API.USER + '/' + API.PROJECT + '/' + projectId +'/'+ API.UPDATE_SUBSCRIPTION;
    return this.httpDelegateService.putAPI(url,body);
  }

  assignPremiumPackage(userId:string, body:any) {
    var url=API.USER +'/'+ userId + '/assignPremium';
    return this.httpDelegateService.putAPI(url,body);
  }
}



