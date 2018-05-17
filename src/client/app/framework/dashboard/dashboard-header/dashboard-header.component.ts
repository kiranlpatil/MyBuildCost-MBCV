import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Candidate } from '../../../user/models/candidate';
import { AppSettings, ImagePath, SessionStorage, LocalStorage } from '../../../shared/constants';
import { SessionStorageService } from '../../../shared/services/session.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import {UserProfile} from '../../../user/models/user';
import {ProfileService} from '../../shared/profileservice/profile.service';

@Component({
  moduleId: module.id,
  selector: 'tpl-dashboard-header',
  templateUrl: 'dashboard-header.component.html',
  styleUrls: ['dashboard-header.component.css'],
})

export class DashboardHeaderComponent {
  @Input() candidate: Candidate;
  public isClassVisible: boolean = false;
  public isOpenProfile: boolean = false;
  PROFILE_IMG_PATH: string;
  user_first_name: string;
  user_email: string;
  HEADER_LOGO: string;
  MOBILE_LOGO: string;
  first_letter:string;

  @HostListener('document:click', ['$event']) onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isOpenProfile = false;

    }
  }

  constructor(private _router: Router, private _eref: ElementRef,
  private profileService: ProfileService) {
    this.HEADER_LOGO = ImagePath.HEADER_LOGO;
    this.MOBILE_LOGO = ImagePath.MOBILE_WHITE_LOGO;
    this.user_first_name = SessionStorageService.getSessionValue(SessionStorage.FIRST_NAME);
    this.user_email = SessionStorageService.getSessionValue(SessionStorage.EMAIL_ID);
    this.first_letter =(this.user_first_name).toString().charAt(0);
    profileService.profileUpdateObservable$.subscribe(
      (user: UserProfile) => {
        if (user.first_name) {
          this.user_first_name = user.first_name;
        }
        if (user.company_name) {
          SessionStorageService.setSessionValue(SessionStorage.COMPANY_NAME, user.company_name);
        }
      });
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.replace('"', '');
    }
    return null;
  }

  logOut() {
    if(parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN))!=1) {
      window.sessionStorage.clear();
      window.localStorage.clear();
    }
    let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME;
    window.location.href = host;
  }

  navigateToWithId(nav:string) {
    var userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    this._router.navigate([nav, userId]);
  }

  navigateTo(nav:string) {
    this.deleteProjectDetailsFromSessionStorege();
    this._router.navigate([nav]);
    this.closeMenu();
  }

  deleteProjectDetailsFromSessionStorege() {
    // sessionStorage.removeItem(SessionStorage.CURRENT_PROJECT_ID);
     sessionStorage.removeItem(SessionStorage.CURRENT_PROJECT_NAME);
    // sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
  }

  toggleMenu() {
    this.isClassVisible = !this.isClassVisible;
    this.isOpenProfile = false;
  }

  openDropdownProfile() {
    this.isOpenProfile = !this.isOpenProfile;
  }

  closeMenu() {
    this.isClassVisible = false;
  }

  toggleDashboardMenu(value:boolean) {
    this.isClassVisible = value;
  }
  getCurrentProjectId() {
    return SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
  }
}
