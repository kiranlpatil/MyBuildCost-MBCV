import {Injectable} from "@angular/core";


@Injectable()
export class CommonService {

  goBack() {
    window.history.go(-1);
  }

}
