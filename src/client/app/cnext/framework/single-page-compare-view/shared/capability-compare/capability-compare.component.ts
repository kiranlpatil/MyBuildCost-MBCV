import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Role } from '../../../model/role';
import {Capability} from "../../../model/capability";

@Component({
  moduleId: module.id,
  selector: 'cn-capability-compare',
  templateUrl: 'capability-compare.component.html',
  styleUrls: ['capability-compare.component.css']
})

export class CapabilityCompareComponent  implements OnChanges{

  @Input() capabilities: Capability[] = new Array(0);
  @Input() isCompact : boolean = false;
  ngOnChanges() {
    //  console.log("in compare view",this.roles);
  }


}
