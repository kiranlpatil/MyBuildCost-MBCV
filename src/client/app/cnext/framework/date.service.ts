import {Injectable} from "@angular/core";
import {BaseService} from "../../shared/services/httpservices/base.service";
import {ValueConstant} from "../../shared/constants";
@Injectable()
export class DateService extends BaseService {
  monthList = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  yearList = new Array();
  error_msg: string;
  private year: any;
  private currentDate: any;

  constructor() {
    super();
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear();
    this.createYearList(this.year);
  }

  createYearList(year: any) {
    for (let i = 0; i < ValueConstant.MAX_YEAR_LIST; i++) {
      this.yearList.push(year--);
    }
  }

  createBirthYearList(year: any) {
    let validbirthYearList = new Array();
    for (let i = 0; i < ValueConstant.MAX_YEAR_LIST; i++) {
      validbirthYearList.push(year--);
    }
    return validbirthYearList;
  }

}
