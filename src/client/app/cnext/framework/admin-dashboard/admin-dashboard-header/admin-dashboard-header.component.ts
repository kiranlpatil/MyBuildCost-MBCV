
import { Component,ElementRef, HostListener, Input } from '@angular/core';
import {Candidate, Section} from '../../model/candidate';
import {Router} from "@angular/router";
import {AppSettings, ImagePath} from "../../../../framework/shared/constants";

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
 this.MY_LOGO = ImagePath.MY_WHITE_LOGO;
 }

 getImagePath(imagePath: string) {
 if (imagePath !== undefined) {
 return AppSettings.IP + imagePath.substring(4).replace('"', '');
 }

 return null;
 }

 logOut() {
 window.localStorage.clear();
 let host = 'http://' + window.location.hostname;
 window.location.href = host;
 }

 navigateTo(nav: string) {
 if (nav !== undefined) {
 this._router.navigate([nav]);
 }
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
}



