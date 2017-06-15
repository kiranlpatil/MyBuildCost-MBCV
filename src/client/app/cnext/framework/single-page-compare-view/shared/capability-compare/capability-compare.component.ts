import { Component, Input, OnChanges } from '@angular/core';
import { Role } from '../../../model/role';

@Component({
  moduleId: module.id,
  selector: 'cn-capability-compare',
  templateUrl: 'capability-compare.component.html',
  styleUrls: ['capability-compare.component.css']
})

export class CapabilityCompareComponent implements OnChanges {

  @Input() roles: Role[] = new Array(0);

  ngOnChanges() {
    //  console.log("in compare view",this.roles);
  }

}
