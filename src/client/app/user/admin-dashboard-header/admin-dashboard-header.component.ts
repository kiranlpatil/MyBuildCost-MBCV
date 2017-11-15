import {Component, ElementRef, HostListener, Input} from "@angular/core";
import {Candidate, Section} from "../../user/models/candidate";
import {Router} from "@angular/router";
import {AppSettings, ImagePath} from "../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-admin-dashboard-header',
  templateUrl: 'admin-dashboard-header.component.html',
  styleUrls: ['admin-dashboard-header.component.css'],
})

export class AdminDashboardHeaderComponent {
  @Input() candidate: Candidate;
  public isClassVisible: boolean = false;
  public isOpenProfile: boolean = false;
  PROFILE_IMG_PATH: string;
  MY_LOGO: string;
  newUser: number;
  private highlightedSection: Section = new Section();

  @HostListener('document:click', ['$event']) onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isOpenProfile = false;
    }
  }

  constructor(private _router: Router, private _eref: ElementRef) {
    this.MY_LOGO = ImagePath.MOBILE_WHITE_LOGO;
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.replace('"', '');
    }

    return null;
  }

  logOut() {
    window.localStorage.clear();
    let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME;
    window.location.href = host;
  }

  onSkip() {
    this.highlightedSection.name = 'none';
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
}



