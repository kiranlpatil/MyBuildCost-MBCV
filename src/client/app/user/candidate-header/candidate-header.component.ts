import {Component, ElementRef, HostListener, Input} from "@angular/core";
import {Router} from "@angular/router";
import {Candidate, Section} from "../models/candidate";
import {AppSettings, ImagePath, LocalStorage} from "../../shared/constants";
import {LocalStorageService} from "../../shared/services/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-header',
  templateUrl: 'candidate-header.component.html',
  styleUrls: ['candidate-header.component.css'],
})

export class CandidateHeaderComponent {
  @Input() candidate: Candidate;
  public isClassVisible: boolean = false;
  public isOpenProfile: boolean = false;
  PROFILE_IMG_PATH: string;
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
  }

  getImagePath(imagePath: string) {
    if (imagePath !== undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }

  logOut() {
    window.localStorage.clear();
    let host = AppSettings.HTTP_CLIENT + window.location.hostname;
      window.location.href = host;
  }

  navigateToWithId(nav:string) {
    var userId = LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    if (nav !== undefined) {
      this._router.navigate([nav, userId]);
    }
  }

  navigateTo(nav:string) {
    if (nav !== undefined) {
      this._router.navigate([nav]);
    }
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
}
