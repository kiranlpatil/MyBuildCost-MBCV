import { Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { AppSettings, SessionStorage, SessionStorageService } from '../../index';
import { LocalStorageService } from '../local-storage.service';
import { LocalStorage } from '../../constants';
export class AppRequestOptions extends RequestOptions {
  constructor() {
    super();
  }

  merge(options?: RequestOptionsArgs): RequestOptions {
    if (options === null) {
      options = new RequestOptions();
    }
      options.headers = new Headers();
      options.headers.append('Content-Type', 'application/json');
      options.headers.append('Cache-Control', 'no-cache');
      options.headers.append('Pragma', 'no-cache');

    if (window.location.href.indexOf('?access_token=') !== -1) {
      let url:any = new URL(window.location.href);
      let access_token:string = url.searchParams.get('access_token');
      options.headers.append('Authorization', 'Bearer ' + access_token);
    } else {
      options.headers.append('Authorization', 'Bearer ' +(LocalStorageService.getLocalValue(LocalStorage.ACCESS_TOKEN) ||
        ( SessionStorageService.getSessionValue(SessionStorage.ACCESS_TOKEN))));
    }

    options.url = AppSettings.API_ENDPOINT + options.url;
    var result = super.merge(options);
    result.merge = this.merge;
    return result;
  }
}
