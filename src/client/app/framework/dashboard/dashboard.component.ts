import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../user/services/dashboard.service';
import { UserProfile } from '../../user/models/user';
import {
  SessionStorage,
  SessionStorageService,
  Message,
  MessageService,
  NavigationRoutes,
  ProfileService
} from '../../shared/index';


@Component({
  moduleId: module.id,
  selector: 'tpl-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  mode = 'Observable';
  model = new UserProfile();
  overlayStyle = false;
  newUser: number;

  constructor(private _router: Router, private dashboardService: DashboardService, private messageService: MessageService,
              private profileService: ProfileService, private zone: NgZone ) {
  }

  ngOnInit() {
    this.newUser = parseInt(SessionStorageService.getSessionValue(SessionStorage.IS_LOGGED_IN));
    let userJustLoggedIn = parseInt(SessionStorageService.getSessionValue(SessionStorage.IS_JUST_LOGGED_IN));

    if (userJustLoggedIn === 1 && document.documentElement.clientWidth <= 767) {
      this.showInfoMessageIfMobileView();
    }
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else if(!SessionStorageService.getSessionValue(SessionStorage.CURRENT_VIEW)) {
      console.log(SessionStorageService.getSessionValue(SessionStorage.CURRENT_VIEW));
      this.getUserProfile();
    }
  }
  getUserProfile() {debugger
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.onUserProfileError(error));
  }

  onUserProfileSuccess(result: any) {
    SessionStorageService.setSessionValue(SessionStorage.EMAIL_ID, result.data.email);
    SessionStorageService.setSessionValue(SessionStorage.MOBILE_NUMBER, result.data.mobile_number);
    this.zone.run(() => {
      if (result !== null) {
        this.model = result;
        this.profileService.onProfileUpdate(result);
      }
    });
  }

  onUserProfileError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.error_code =  error.err_code;
    message.isError = true;
    this.messageService.message(message);
  }

  navigateTo(nav: string) {
    if (nav !== undefined) {
      this._router.navigate([nav]);
    }
    this.overlayStyle = !this.overlayStyle;
  }

  onLogout() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }

  isShowSidebarMenu() {
    if (this.overlayStyle) {
      return '0';
    } else {
      return '0';
    }
  }
  showInfoMessageIfMobileView() {
    SessionStorageService.setSessionValue(SessionStorage.IS_JUST_LOGGED_IN, 0);
    var message = new Message();
    message.isError = false;
    message.custom_message = 'Data editing / data entry is not allowed on mobile. Please log in on desktop/laptop for the same.';
    this.messageService.message(message);
  }
}
