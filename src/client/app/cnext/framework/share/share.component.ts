import {Component} from "@angular/core";
import {ShareService} from "./share.service";

@Component({
  moduleId: module.id,
  selector: 'cn-share',
  templateUrl: 'share.component.html',
  styleUrls: ['share.component.css'],
})

export class ShareComponent {

  public repoUrl = 'https://github.com/Epotignano/ng2-social-share';

  constructor(private shareService:ShareService) {
  }

  buildValuePortraitUrl() {
    this.shareService.buildValuePortraitUrl()
      .subscribe(
        user=> {
          console.log('------', user);
        },
        error=> {
          console.log('------', error);
        }
      );
  }

}
