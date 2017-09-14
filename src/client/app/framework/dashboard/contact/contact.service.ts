import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {API, BaseService, MessageService} from "../../../shared/index";
import {Contact} from "./contact";

@Injectable()

export class ContactService extends BaseService {
  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }


  contact(contactbody: Contact): Observable<any> {
    var body = JSON.stringify(contactbody);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(API.SEND_MAIL, body, options)
      .map(this.extractDataWithoutToken)
      .catch(this.handleError);
  }

}
