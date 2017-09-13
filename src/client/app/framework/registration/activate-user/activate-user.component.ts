import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ImagePath, LocalStorage, Messages, NavigationRoutes, ProjectAsset} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {ActiveUserService} from "./activate-user.service";
import {MessageService} from "../../../shared/services/message.service";
//import {  Message  } from '../../shared/message';

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
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  BODY_BACKGROUND: string;
  activationMessage_1: string= Messages.MSG_ACTIVATE_USER_1;
  activationMessage_2: string= Messages.MSG_ACTIVATE_USER_2;
  activationMessage_3: string= Messages.MSG_ACTIVATE_USER_3;

  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private activeService: ActiveUserService,
              private messageService: MessageService) {
    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit() {
    this.token = this._router.url.substr('activate_user?access_token'.length + 2);
    this.idPosition = this.token.indexOf('&') + 1;
    this.id = this.token.substring(this.idPosition + 28, this.idPosition + 4);
    this.token = this.token.substring(this.token.length - 29, 0);
    LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, this.token);
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, this.id);
    /*this.activeService.getUser()
      .subscribe(
        res => (this.activateUser(res)),
        error => (this.newRegistrationFail(error))
      );*/
    this.activeService.activeUser()
      .subscribe(
        res => (this.newRegistrationSuccess(res)),
        error => (this.newRegistrationFail(error)));
  }
  /*activateUser(user:any) { debugger
    this.activeService.activeUser()
      .subscribe(
        res => (this.newRegistrationSuccess(res)),
        error => (this.newRegistrationFail(error)));
  }*/

  newRegistrationSuccess(res: any) {
    this.USER_ACTIVATION_STATUS = Messages.MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS;
    this.USER_ACTIVATION_MESSAGE = Messages.MSG_SUCCESS_MAIL_VERIFICATION_BODY;
  }

  newRegistrationFail(error: any) {
    this.USER_ACTIVATION_STATUS = Messages.MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS;
    this.USER_ACTIVATION_MESSAGE = Messages.MSG_ERROR_MAIL_VERIFICATION_BODY;
  }

  navigateTo() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }
}
