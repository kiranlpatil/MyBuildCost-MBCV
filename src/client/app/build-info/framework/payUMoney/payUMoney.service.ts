import { Injectable } from '@angular/core';
import { HttpDelegateService } from '../../../shared/services/http-delegate.service';
import { API } from '../../../shared/constants';
import { BaseService } from '../../../shared/services/http/base.service';
import { PayUMoneyModel } from '../model/PayUMoneyModel';
import { Headers, Http, RequestOptions } from '@angular/http';

@Injectable()

export class PayUMoneyService extends BaseService {

  constructor(protected httpDelegateService : HttpDelegateService, protected http: Http) {
    super();
  }

  goToPayment(payUMoney : PayUMoneyModel) {
    let url = API.SUBSCRIPTION + '/' + API.PAY_U_MONEY;
    let body = payUMoney;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.httpDelegateService.postAPI(url,body);
  }
}
