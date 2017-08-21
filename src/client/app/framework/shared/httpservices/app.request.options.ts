import {Headers, RequestOptions, RequestOptionsArgs} from "@angular/http";
import {AppSettings, LocalStorage, LocalStorageService} from "../../shared/index";
//import {  Config  } from '../config/env.config';
export class AppRequestOptions extends RequestOptions {
  constructor() {
    super();
  }

  merge(options?: RequestOptionsArgs): RequestOptions {

    /* if(options !== null && options.headers !== null) {
     var url =  AppSettings.API_ENDPOINT + options.url;
     }*/
    if (options === null) {
      options = new RequestOptions();
    }
      options.headers = new Headers();
      options.headers.append('Content-Type', 'application/json');
      options.headers.append('Cache-Control', 'no-cache');
      options.headers.append('Pragma', 'no-cache');//'If-Modified-Since'
      //options.headers.append('If-Modified-Since','Mon, 26 Jul 1997 05:00:00 GMT');
      options.headers.append('Authorization', 'Bearer ' + LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN));
    //options.url = `${Config.API}/` + options.url;
    options.url = AppSettings.API_ENDPOINT + options.url;
    var result = super.merge(options);
    result.merge = this.merge;
    return result;
  }
}
