import {Component, Input} from "@angular/core";
import {Role} from "../../../model/role";

@Component({
  moduleId: module.id,
  selector: 'cn-capability-compare',
  templateUrl: 'capability-compare.component.html',
  styleUrls: ['capability-compare.component.css']
})

export class CapabilityCompareComponent {

  @Input() roles:Role[] = new Array(0);
}
