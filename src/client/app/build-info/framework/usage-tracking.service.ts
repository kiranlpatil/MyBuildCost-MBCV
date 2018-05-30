import {Injectable} from "@angular/core";
import { Http } from "@angular/http";
import {BaseService} from "../../shared/services/http/base.service";

@Injectable()

export class UsageTrackingService extends BaseService {

  constructor(private http: Http) {
    super();
  }
}
