import {Component, OnInit} from "@angular/core";
import {ShareService} from "./share.service";
import {ErrorService} from "../error.service";
import {Share} from "../model/share";

@Component({
  moduleId: module.id,
  selector: 'cn-share',
  templateUrl: 'share.component.html',
  styleUrls: ['share.component.css'],
})

export class ShareComponent implements OnInit {

  public repoUrlFacebook:string;
  public repoUrlLinkedin:string;
  public repoUrlTwitter:string;

  constructor(private shareService:ShareService, private errorService:ErrorService) {
  }

  ngOnInit() {
    this.buildValuePortraitUrl();
  }

  buildValuePortraitUrl() {
    this.shareService.buildValuePortraitUrl()
      .subscribe(
        (data:Share) => {
          this.repoUrlFacebook = 'http://www.facebook.com/sharer.php?u=' + data.shareUrl;
          this.repoUrlLinkedin = 'https://www.linkedin.com/cws/share?url=' + data.shareUrl;
          this.repoUrlTwitter = 'https://twitter.com/share?url=' + data.shareUrl;
        },
        error=> {
          this.errorService.onError(error);
        }
      );
  }
}
