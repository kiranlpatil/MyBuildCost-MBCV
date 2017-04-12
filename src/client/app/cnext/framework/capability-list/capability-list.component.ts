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
  private primaryNames :string[]=new Array(0);
  private secondaryNames :string[]=new Array(0);
  private primaryCapabilitiesNumber:number = 0

  ngOnChanges(changes:any) {
    if(changes.roles){
      this.roles=changes.roles.currentValue;
    }
    if(this.candidateRoles){
      for(let role of this.candidateRoles){
        for(let primary of role.capabilities){
          this.primaryNames.push(primary.name);
        }
        if(role.secondaryCapabilities){
          for(let second of role.secondaryCapabilities){
            this.secondaryNames.push(second.name);
          }
        }
      }
    }
  }


  selectedCapability(selectedRole:Role, selectedCapability:Capability, event:any) {
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
