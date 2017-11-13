import {Component} from "@angular/core";
import {Button, Label, Messages} from "../constants";

@Component({
  moduleId: module.id,
  selector:'cn-page-not-found',
  templateUrl:'page-not-found.component.html',
  styleUrls:['page-not-found.component.css']
})

export class PageNotFoundComponent {

  getMessages() {
    return Messages;
  }
  getLabels() {
    return Label;
  }
  getButton() {
    return Button;
  }
}

