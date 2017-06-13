import {Component} from "@angular/core";
import {ImagePath} from "../shared/index";

@Component({
  moduleId: module.id,
  selector: 'landing-page',
  templateUrl: 'landing-page.component.html',
  styleUrls: ['landing-page.component.css'],
})
export class LandingPageComponent {
  BODY_BACKGROUND: string;

  constructor() {
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }
}
