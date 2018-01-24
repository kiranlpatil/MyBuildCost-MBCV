import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from './../../model/project';
import { API, BaseService, SessionStorage, SessionStorageService, MessageService } from '../../../../shared/index';


@Injectable()
export class MaterialTakeoffService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }

}
