import {Component, OnInit} from "@angular/core";
import {ShareService} from "./share.service";
import {ErrorService} from "../../../shared/services/error.service";
import {Share} from "../model/share";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {LocalStorage, Messages} from "../../../shared/constants";
import {MessageService} from "../../../shared/services/message.service";
import { Message } from '../../../shared/models/message';

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
  public socialActionValue:string;
  public getUrlCount:number = 0;
  public isCandidate: boolean;
  public isCandidateSubmitted: boolean;

  constructor(private shareService:ShareService, private errorService:ErrorService,
              private messageService: MessageService) {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED) === 'true') {
      this.isCandidateSubmitted = true;
    }
  }

  ngOnInit() {

  }

  buildValuePortraitUrl() {
    this.shareService.buildValuePortraitUrl()
      .subscribe(
        (data:Share) => {
          this.getUrlCount++;
          this.repoUrlFacebook = 'http://www.facebook.com/sharer.php?u=' + data.shareUrl;
          this.repoUrlLinkedin = 'https://www.linkedin.com/cws/share?url=' + data.shareUrl;
          this.repoUrlTwitter = 'https://twitter.com/share?url=' + data.shareUrl;
          this.bootTabAction(this.socialActionValue);
        },
        error=> {
          this.errorService.onError(error);
        }
      );
  }

  openTab(value:string) {
    if(!this.isCandidateSubmitted) {
      let message = new Message();
      message.isError = true;
      message.error_msg= Messages.PLEASE_COMPLETE_THE_PROFILE_MSG;
      this.messageService.message(message);
      return;
    } else {
      this.socialActionValue = value;
      if (this.getUrlCount === 0) {
        this.buildValuePortraitUrl();
      }
      if (this.getUrlCount !== 0 && this.socialActionValue) {
        this.bootTabAction(this.socialActionValue);
      }
    }
  }

  bootTabAction(socialActionValue:string) {
    if (socialActionValue === 'facebook') {
      window.open(this.repoUrlFacebook, 'popupwindow', 'width=800,height=500,left=200,top=5,scrollbars,toolbar=0,resizable');
    } else if (socialActionValue === 'linkedin') {
      window.open(this.repoUrlLinkedin, 'popupwindow', 'width=800,height=500,left=200,top=5,scrollbars,toolbar=0,resizable');
    } else if (socialActionValue === 'twitter') {
      window.open(this.repoUrlTwitter, 'popupwindow', 'width=800,height=500,left=200,top=5,scrollbars,toolbar=0,resizable');
    }
  }
}

