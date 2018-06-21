import { Injectable } from '@angular/core';
import { API, BaseService, MessageService } from '../../../../shared/index';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';
import { PackageDetailsService } from '../package-details.service';


@Injectable()
export class RenewPackageService extends BaseService {

  constructor(protected messageService: MessageService, protected httpDelegateService: HttpDelegateService) {
    super();
  }


}
