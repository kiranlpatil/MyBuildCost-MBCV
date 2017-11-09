import {Component, OnInit} from '@angular/core';
import {JobShareContainerService} from './job-share-container.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareLink} from '../model/share-link';
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
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
            this._router.navigate(['/landing']);
          }
        },
        error=> {
          this.errorService.onError(error);
        }
      );
  }

  onSuccess(shareLink:ShareLink) {
    window.localStorage.clear();
    let url:any = new URL('localhost:8080/' + shareLink.longUrl);
    let newUrl = shareLink.longUrl.split('/')[2];
    LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, url.searchParams.get('access_token'));
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE, 'false');
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 'true');
    LocalStorageService.setLocalValue(LocalStorage.ISADMIN, 'false');
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, shareLink.longUrl.split('/')[1]);
    LocalStorageService.setLocalValue(LocalStorage.POSTED_JOB, this.jobId);
    this.isJobPosted=shareLink.isJobPosted;
    this.jobId = newUrl.split('?')[0];
  }
}
