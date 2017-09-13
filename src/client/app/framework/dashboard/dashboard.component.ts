import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {DashboardService} from "./dashboard.service";
import {UserProfile} from "./user";
import {
  LocalStorage,
  LocalStorageService,
  Message,
  MessageService,
  NavigationRoutes,
  ProfileService
} from "../../shared/index";
import {LoaderService} from "../../shared/loader/loaders.service";


@Component({
  moduleId: module.id,
  selector: 'tpl-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})

export class DashboardComponent implements OnInit, OnDestroy {
  mode = 'Observable';
  model = new UserProfile();
  overlayStyle = false;
  newUser: number;

  constructor(private _router: Router, private dashboardService: DashboardService, private messageService: MessageService,
              private profileService: ProfileService, private zone: NgZone, private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.newUser = parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      this.getUserProfile();
    }
  }

  ngOnDestroy() {
    // this.loaderService.stop();
    // this.loaderService.showLoading(false);
  }

  getUserProfile() {
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.onUserProfileError(error));
  }

  onUserProfileSuccess(result: any) {
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, result.data.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, result.data.mobile_number);
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
}
