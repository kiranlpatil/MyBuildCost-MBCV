import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePath, SessionStorage, Messages, NavigationRoutes, ProjectAsset } from '../../../shared/constants';
import { SessionStorageService } from '../../../shared/services/session.service';
import { ActiveUserService } from './activate-user.service';
import { MessageService } from '../../../shared/services/message.service';
@Component({
  moduleId: module.id,
  selector: 'tpl-activate-user',
  templateUrl: 'activate-user.component.html',
  styleUrls: ['activate-user.component.css'],
})
export class ActivateUserComponent implements OnInit {
  USER_ACTIVATION_MESSAGE: string;
  USER_ACTIVATION_STATUS: string;
  token: string;
  idPosition: number;
  id: string;
  isEmailVerification:boolean=false;
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  BODY_BACKGROUND: string;
  activationMessageHeading: string= Messages.MSG_ACTIVATE_USER_HEADING;
  activationMessageSubHeading: string= Messages.MSG_ACTIVATE_USER_SUB_HEADING;
  activationMessage: string= Messages.MSG_ACTIVATE_USER_MESSAGE;
  emailVerificationMessageHeading: string= Messages.MSG_EMAIL_VERIFICATION_HEADING;
  emailVerificationMessage: string= Messages.MSG_EMAIL_VERIFICATION_MESSAGE;

  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private activeService: ActiveUserService,
              private messageService: MessageService) {
    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit() {
    this.token = this._router.url.substr('activate-user?access_token'.length + 2);
    if(this._router.url.indexOf('isEmailVerification')!==-1) {
      this.isEmailVerification=true;
    }
    this.idPosition = this.token.indexOf('&') + 1;
    this.id = this.token.substring(this.idPosition + 28, this.idPosition + 4);
    this.token = this.token.substring(this.token.length - 29, 0);
    SessionStorageService.setSessionValue(SessionStorage.ACCESS_TOKEN, this.token);
    SessionStorageService.setSessionValue(SessionStorage.USER_ID, this.id);
    this.activeService.activeUser()
      .subscribe(
        res => (this.OnNewRegistrationSuccess(res)),
        error => (this.onNewRegistrationFailure(error)));
  }

  OnNewRegistrationSuccess(res: any) {
    console.log(res);
    this.USER_ACTIVATION_STATUS = Messages.MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS;
    this.USER_ACTIVATION_MESSAGE = Messages.MSG_SUCCESS_MAIL_VERIFICATION_BODY;
  }

  onNewRegistrationFailure(error: any) {
    this.USER_ACTIVATION_STATUS = Messages.MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS;
    this.USER_ACTIVATION_MESSAGE = Messages.MSG_ERROR_MAIL_VERIFICATION_BODY;
  }

  navigateTo() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }
}
