import {Component, OnInit} from "@angular/core";
import {ErrorService} from "../error.service";
import {ShareContainerService} from "./share-container.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShareLink} from "../model/share-link";

@Component({
  moduleId: module.id,
  selector: 'cn-share-container',
  template: `<div></div>`,
  styleUrls: ['share-container.component.css'],
})

export class ShareContainerComponent implements OnInit {

  constructor(private _router:Router, private activatedRoute:ActivatedRoute, private shareContainerService:ShareContainerService, private errorService:ErrorService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      var shortUrl = params['shortUrl'];
      if (shortUrl && shortUrl !== '') {
        this.getActualValuePortraitUrl(shortUrl);
      }
    });
  }

  getActualValuePortraitUrl(shortUrl:string) {
    this.shareContainerService.getActualValuePortraitUrl(shortUrl)
      .subscribe(
        (data:ShareLink[]) => {
          if (data.length > 0) { //TODO:Find proper solution ->krishna
            let url:any = new URL('localhost:8080/' + data[0].shortUrl);
            let newUrl = data[0].longUrl.split('/')[1];
            let id = newUrl.split('?')[0];
            let access = url.searchParams.get('access_token');
            this._router.navigate(['/value-portrait', id], {queryParams: {access_token: access}});
          } else {
            this._router.navigate(['/landing']);
          }
        },
        error=> {
          this.errorService.onError(error);
        }
      );
  }

}
