import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {BaseService} from "../../shared/services/http/base.service";

@Injectable()

export class UsageTrackingService extends BaseService {

  constructor(private http: Http) {
    super();
  }
}
