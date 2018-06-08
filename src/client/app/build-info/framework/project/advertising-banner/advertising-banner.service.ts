import { Injectable } from '@angular/core';
import { BaseService } from '../../../../shared/services/http/base.service';
import { HttpDelegateService } from '../../../../shared/services/http-delegate.service';
import { API } from '../../../../shared/constants';

@Injectable()
export class AdvertisingBannerService extends BaseService {
  constructor(protected httpDelegateService: HttpDelegateService) {
    super();
  }

  getAdvertisingBanner() {
    var url = API.ADVERTSING_BANNER;
    return this.httpDelegateService.getAPI(url);
  }
}
