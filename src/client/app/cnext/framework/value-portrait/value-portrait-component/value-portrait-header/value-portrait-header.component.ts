import {Component, Input} from "@angular/core";
import {Candidate} from "../../../../../user/models/candidate";
import {AppSettings, Label} from "../../../../../shared/constants";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'cn-value-portrait-header',
  templateUrl: 'value-portrait-header.component.html',
  styleUrls: ['value-portrait-header.component.css'],
})

export class ValuePortraitHeader {

  @Input() candidate: Candidate;

  constructor(private _router: Router) {

  }

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath.replace('"', '');
    }
    return null;
  }

  getLabel() {
    return Label;
  }

}
