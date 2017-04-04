import {  Injectable  } from '@angular/core';
import { Http,Headers, RequestOptions } from '@angular/http';
import { BaseService } from '../../framework/shared/httpservices/base.service';
import { VALUE_CONSTANT } from '../../framework/shared/constants';
@Injectable()
export class DateService extends BaseService {
  private year: any;
  private currentDate: any;
  public yearList = new Array();
  public monthList = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  error_msg: string;



  constructor(private http: Http) {
    super()
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);
  }


  createYearList(year: any) {
    for (let i = 0; i < VALUE_CONSTANT.MAX_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }

  }

}
