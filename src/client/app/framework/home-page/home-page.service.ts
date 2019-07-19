import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API, BaseService, MessageService } from '../../shared/index';
import { ContactUs } from '../../user/models/contactUs';

@Injectable()

export class ContactService1 extends BaseService {
  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }


  contact(contactbody: ContactUs): Observable<any> {
    var body = JSON.stringify(contactbody);
    console.log('inside conatct body ', body);
    let headers = new Headers({'content-type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(API.CONTACT_SEND_MAIL, body, options);
  }

}
