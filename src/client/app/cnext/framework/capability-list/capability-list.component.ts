import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Role} from "../model/role";
import {Capability} from "../model/capability";
import {ValueConstant} from "../../../framework/shared/constants";

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
  private primaryNames:string[] = new Array(0);
  private secondaryNames:string[] = new Array(0);
  private primaryCapabilitiesNumber:number = 0;
  private disableButton:boolean=true;

  ngOnChanges(changes:any) {
    if (changes.roles) {
      this.roles = changes.roles.currentValue;
    }
    if (this.candidateRoles) {
      this.secondaryNames = new Array(0);
      this.primaryNames= new Array(0);
      for (let role of this.candidateRoles) {
        if (role.capabilities) {
          for (let primary of role.capabilities) {
            if(primary.isPrimary){
              this.primaryNames.push(primary.name);
            }
            else if(primary.isSecondary){
              this.secondaryNames.push(primary.name);
            }
          }
        }
      }
    }
  }


  selectedCapability(selectedRole:Role, selectedCapability:Capability, event:any) {
    this.disableButton=false;
    this.roles[0].isAPIForComplexity=true;
    if (event.target.checked) {
      if (this.primaryCapabilitiesNumber < ValueConstant.MAX_CAPABILITIES) {
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
    this.disableButton=true;
    this.selectCapabilityWithRole.emit(this.roles);
  }
}
