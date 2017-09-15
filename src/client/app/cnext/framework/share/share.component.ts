import {Component, OnInit} from "@angular/core";
import {ShareService} from "./share.service";
import {SeoService} from "./seo.service";
import {ErrorService} from "../error.service";

@Component({
  moduleId: module.id,
  selector: 'cn-share',
  templateUrl: 'share.component.html',
  styleUrls: ['share.component.css'],
})

export class ShareComponent implements OnInit {

  public repoUrl:string;

  constructor(private shareService:ShareService, private seoService:SeoService, private errorService:ErrorService) {
  }

  ngOnInit() {
    this.buildValuePortraitUrl();
  }

  buildValuePortraitUrl() {
    this.shareService.buildValuePortraitUrl()
      .subscribe(
        user=> {
          //console.log('------', user);
          this.changeMeta(user);
          this.repoUrl = 'http://www.facebook.com/sharer.php?u=' + user.shareUrl;
        },
        error=> {
          this.errorService.onError(error);
        }
      );
  }

  changeMeta(user:any) {
    this.seoService.setTitle('Check out value portrait of ' + user.first_name);
    this.seoService.setMetaDescription('My Description');
    this.seoService.setMetaRobots('Index, Follow');
    this.seoService.setMetaOgDescription('This is value portrait of ' + user.first_name);
    this.seoService.setMetaOgTitle(user.first_name);
    this.seoService.setMetaOgImage('https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAv4AAAAJDQwZGMxZjdhLTkwYWUtNDEzNS04Y2NlLTE0OWU0NDZkODQ4MQ.png');
  }


}
