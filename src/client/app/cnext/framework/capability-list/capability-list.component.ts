import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Role} from "../model/role";
import {Capability} from "../model/capability";

@Component({
  moduleId: module.id,
  selector: 'cn-capibility-list',
  templateUrl: 'capability-list.component.html',
  styleUrls: ['capability-list.component.css']
})

export class CapabilityListComponent {

  @Input() roles:Role[] = new Array(0);
  @Input() candidateRoles:Role[] = new Array();
  @Output() selectCapabilityWithRole = new EventEmitter()
  private selectedCapabilityWithRoles:Role[] = new Array();


  private primaryCapabilitiesNumber:number = 0

  ngOnChanges(changes:any) {
    
  }


  selectedCapability(selectedRole:Role, selectedCapability:Capability, event:any) {
    debugger

    if (event.target.checked) {
      if (this.primaryCapabilitiesNumber < 2) {
        this.primaryCapabilitiesNumber++;
        selectedCapability.isPrimary = true;
      } else {
        selectedCapability.isSecondary = true;
      }
    } else {
      if (selectedCapability.isPrimary) {
        this.primaryCapabilitiesNumber--;
        selectedCapability.isPrimary = false;
      } else if (selectedCapability.isSecondary) {
        selectedCapability.isSecondary = false;
      }
    }
  }

  disableCapability() {
    this.selectCapabilityWithRole.emit(this.roles);
  }
}
