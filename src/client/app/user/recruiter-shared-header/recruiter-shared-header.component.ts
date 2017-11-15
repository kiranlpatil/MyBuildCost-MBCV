import {Component, ElementRef, HostListener, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {AppSettings, ImagePath, LocalStorage} from "../../shared/constants";
import {RedirectRecruiterDashboardService} from "../services/redirect-dashboard.service";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-shared-header',
  templateUrl: 'recruiter-shared-header.component.html',
  styleUrls: ['recruiter-shared-header.component.css'],
})

export class RecruiterSharedHeaderComponent implements OnInit {
  company_name: string;
  uploaded_image_path: string;
  public isClassVisible: boolean = false;
  public isOpenProfile: boolean = false;
  PROFILE_IMG_PATH: string;
  newUser: number;

  @HostListener('document:click', ['$event']) onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isOpenProfile = false;

    }
  }

  constructor(private _router: Router, private _eref: ElementRef,
              private redirectRecruiterDashboard: RedirectRecruiterDashboardService) {
  }

  ngOnInit() {
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);
    this.uploaded_image_path = LocalStorageService.getLocalValue(LocalStorage.PROFILE_PICTURE); //TODO:Get it from get user call.

    if (this.uploaded_image_path === 'undefined' || this.uploaded_image_path === null) {
      this.uploaded_image_path = ImagePath.COMPANY_LOGO_IMG_ICON;
    } else {
      this.uploaded_image_path = this.uploaded_image_path.replace('"', '');
      this.uploaded_image_path = AppSettings.IP + this.uploaded_image_path;
    }
  }

  logOut() {
    window.localStorage.clear();
    //window.location.href = window.location.hostname;
    let host = AppSettings.HTTP_CLIENT + AppSettings.HOST_NAME;
    window.location.href = host;
  }

  navigateTo(nav: string) {
    if (nav !== undefined) {
      this._router.navigate([nav]);
    }
  }

  redirectToRecruiterDashboard() {
    if(this._router.url==='/recruiter/dashboard') {
      this.redirectRecruiterDashboard.change(true);
    }else {
      this.navigateTo('/recruiter/dashboard');
    }
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

  getImagePath() {
    return ImagePath;
  }
}

