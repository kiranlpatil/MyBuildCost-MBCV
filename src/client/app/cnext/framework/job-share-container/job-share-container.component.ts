import {Component, OnInit} from '@angular/core';
import {JobShareContainerService} from './job-share-container.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareLink} from '../model/share-link';
import {SessionStorage} from "../../../shared/constants";
import {SessionStorageService} from "../../../shared/services/session.service";
import {ErrorService} from "../../../shared/services/error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-share-container',
  templateUrl: 'job-share-container.component.html',
  styleUrls: ['job-share-container.component.css'],
})

export class JobShareContainerComponent implements OnInit {
private jobId:string;
private recruiterId:string;
isJobPosted:boolean=true;
  constructor(private _router:Router,
              private activatedRoute:ActivatedRoute,
              private jobshareContainerService:JobShareContainerService,
              private errorService:ErrorService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      var shortUrl = params['shortUrl'];
      if (shortUrl && shortUrl !== '') {
        this.getActualJobShareUrl(shortUrl);
      }
    });
  }

  getActualJobShareUrl(shortUrl:string) {
    this.jobshareContainerService.getActualJobShareUrl(shortUrl)
      .subscribe(
        (data:ShareLink[]) => {
          if (data.length > 0) {
           this.onSuccess(data[0]);
          } else {
            this._router.navigate(['/signin']);
          }
        },
        error=> {
          this.errorService.onError(error);
        }
      );
  }

  onSuccess(shareLink:ShareLink) {
    //window.sessionStorage.clear();
    //window.localStorage.clear();
    let url:any = new URL('localhost:8080/' + shareLink.longUrl);
    let newUrl = shareLink.longUrl.split('/')[2];
    SessionStorageService.setSessionValue(SessionStorage.ACCESS_TOKEN, url.searchParams.get('access_token'));
    SessionStorageService.setSessionValue(SessionStorage.IS_CANDIDATE, 'false');
    SessionStorageService.setSessionValue(SessionStorage.IS_LOGGED_IN, 'true');
    SessionStorageService.setSessionValue(SessionStorage.ISADMIN, 'false');
    SessionStorageService.setSessionValue(SessionStorage.USER_ID, shareLink.longUrl.split('/')[1]);
    SessionStorageService.setSessionValue(SessionStorage.POSTED_JOB, this.jobId);
    this.isJobPosted=shareLink.isJobPosted;
    this.jobId = newUrl.split('?')[0];
  }
}
