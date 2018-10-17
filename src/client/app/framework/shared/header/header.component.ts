/*
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonService, Message, MessageService } from '../../../shared/index';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ProfileService } from '../../shared/profileservice/profile.service';
import { UserProfile } from '../../../user/models/user';
import { DashboardService } from '../../../user/services/dashboard.service';
import { AppSettings, ImagePath, SessionStorage, NavigationRoutes } from '../../../shared/constants';
import { SessionStorageService } from '../../../shared/services/session.service';

@Component({
  moduleId: module.id,
  selector: 'tpl-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})

export class HeaderComponent implements OnInit {
  model = new UserProfile();
  public isClassVisible: boolean = false;
  public isOpenProfile: boolean = false;
  public isOpenNotification: boolean = false;
  subscription: Subscription;
  PROFILE_IMG_PATH: string;
  MY_LOGO: string;
  newUser: number;

  @HostListener('document:click', ['$event']) onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isOpenProfile = false;
      this.isOpenNotification = false;
    }
  }

  constructor(private _router: Router, private commonService: CommonService, private dashboardService: DashboardService,
              private profileService: ProfileService, private messageService: MessageService,
              private _eref: ElementRef) {
    this.subscription = profileService.profileUpdateObservable$.subscribe(
      (user: UserProfile) => {
        this.onUserProfileSuccess(user);
      });

    this.PROFILE_IMG_PATH = ImagePath.PROFILE_IMG_ICON;
      this.MY_LOGO = ImagePath.MY_WHITE_LOGO;
  }

  ngOnInit() {
    this.newUser = parseInt(SessionStorageService.getSessionValue(SessionStorage.IS_LOGGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      this.getUserProfile();
    }
  }

  getUserProfile() {
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.OnUserProfileFailure(error));
  }

  onUserProfileSuccess(user: any) {
    this.model = user.data;
    var socialLogin: string = SessionStorageService.getSessionValue(SessionStorage.IS_SOCIAL_LOGIN);
    if (socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
      this.PROFILE_IMG_PATH = this.model.social_profile_picture;
    } else if (!this.model.picture || this.model.picture === undefined) {
      this.PROFILE_IMG_PATH = ImagePath.PROFILE_IMG_ICON;
    } else {
      this.PROFILE_IMG_PATH = AppSettings.IP + this.model.picture;
    }
  }

  OnUserProfileFailure(error: any) {
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
  }

  toggleMenu() {
    this.isClassVisible = !this.isClassVisible;
    this.isOpenNotification = false;
    this.isOpenProfile = false;
  }

  openDropdownNotification() {
    this.isOpenNotification = !this.isOpenNotification;
    this.isOpenProfile = false;
  }

  openDropdownProfile() {
    this.isOpenProfile = !this.isOpenProfile;
    this.isOpenNotification = false;
  }

  closeMenu() {
    this.isClassVisible = false;
  }

  logOut() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }

  closeNotificationDropdown() {
    this.isOpenNotification = false;
  }
}
*/
