import {Component} from "@angular/core";
import {ImagePath} from "../shared/index";
import {Messages} from "../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.css'],
})
export class LandingPageComponent {
  BODY_BACKGROUND: string;
  landingPageText: string= Messages.MSG_LANDING_PAGE;
  isChrome: boolean;

  constructor() {
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

}
