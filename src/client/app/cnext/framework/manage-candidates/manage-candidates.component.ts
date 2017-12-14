import {Component} from "@angular/core";
import {Button} from "../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-manage-candidates',
  templateUrl: 'manage-candidates.component.html',
  styleUrls: ['manage-candidates.component.css']
})

export class ManageCandidatesComponent{

  getButtons() {
    return Button;
  }
}
