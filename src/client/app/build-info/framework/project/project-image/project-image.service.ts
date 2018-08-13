import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../../../shared/services/http/base.service';
import { MessageService } from '../../../../shared/services/message.service';
import { API, AppSettings, SessionStorage } from '../../../../shared/constants';
import { SessionStorageService } from '../../../../shared/services/session.service';

@Injectable()
export class ProjectImageService extends BaseService {

  constructor(protected http: Http, protected messageService: MessageService) {
    super();
  }
  projectImageUpload(files: Array<File>) {
    var url = AppSettings.API_ENDPOINT +API.PROJECT+ API.PROJECT_IMAGE_UPLOAD;
    return new Promise((resolve: any, reject: any) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      formData.append('file', files[0], files[0].name);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + SessionStorageService.getSessionValue(SessionStorage.ACCESS_TOKEN));
      xhr.send(formData);
    });
  }


}
