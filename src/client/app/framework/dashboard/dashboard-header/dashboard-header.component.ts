import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Candidate, Section } from '../../../user/models/candidate';
import {AppSettings, ImagePath, SessionStorage, Label, LocalStorage} from '../../../shared/constants';
import { SessionStorageService } from '../../../shared/services/session.service';
import {LocalStorageService} from '../../../shared/services/localstorage.service';

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
  user_last_name: string;
  MY_LOGO: string;
  MOBILE_LOGO: string;
  newUser: number;
  private highlightedSection: Section = new Section();

  @HostListener('document:click', ['$event']) onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isOpenProfile = false;

    }
  }

  constructor(private _router: Router, private _eref: ElementRef) {
    this.MY_LOGO = ImagePath.MY_WHITE_LOGO;
    this.MOBILE_LOGO = ImagePath.MOBILE_WHITE_LOGO;
    this.user_first_name = SessionStorageService.getSessionValue(SessionStorage.FIRST_NAME);
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
    this._router.navigate([nav]);
    this.closeMenu();
  }
  onSkip() {
    this.highlightedSection.name='none';
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

  goToGuidedTour() {
    this.highlightedSection.name = 'GuideTour';
    this.closeMenu();
  }
  getLabel() {
    return Label;
  }
}
