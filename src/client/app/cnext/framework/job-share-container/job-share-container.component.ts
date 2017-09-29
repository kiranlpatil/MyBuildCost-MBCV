import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../error.service';
import {JobShareContainerService} from './job-share-container.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareLink} from '../model/share-link';
import {RecruiterDashboard} from '../model/recruiter-dashboard';
import {LocalStorage} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-share-container',
  templateUrl: 'job-share-container.component.html',
  styleUrls: ['job-share-container.component.css'],
})

export class JobShareContainerComponent implements OnInit {
private jobId:string;
private recruiterId:string;
private isJobPosted:boolean;
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
    this.isJobPosted=shareLink.isJobPosted;
    let newUrl = shareLink.longUrl.split('/')[2];
    this.jobId = newUrl.split('?')[0];
    LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, url.searchParams.get('access_token'));
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE, 'false');
    LocalStorageService.setLocalValue(LocalStorage.IS_LOGGED_IN, 'true');
    LocalStorageService.setLocalValue(LocalStorage.ISADMIN, 'false');
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, shareLink.longUrl.split('/')[1]);
  }
}
