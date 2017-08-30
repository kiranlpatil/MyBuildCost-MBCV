import {Component, OnInit} from "@angular/core";
import {ImagePath} from "../shared/index";
import {Messages} from "../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.css'],
})
export class LandingPageComponent implements OnInit{
  BODY_BACKGROUND: string;
  landingPageText: string= Messages.MSG_LANDING_PAGE;
  isChrome: boolean;

  constructor() {
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit() {
     this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    console.log('isChrome = ', this.isChrome);
  }

  closeToaster() {
     document.getElementById("snackbar").style.visibility = "hidden";
  }
}
