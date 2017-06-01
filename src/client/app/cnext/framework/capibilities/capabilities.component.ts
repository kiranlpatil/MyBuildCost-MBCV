import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Role} from "../model/role";
import {Capability} from "../model/capability";
import {ValueConstant} from "../../../framework/shared/constants";
import {Section} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-capabilities',
  templateUrl: 'capabilities.component.html',
  styleUrls: ['capabilities.component.css']
})

export class CapabilitiesComponent {

  @Input() roles:Role[] = new Array(0);
  @Input() candidateRoles:Role[] = new Array();
  @Output() onComplete = new EventEmitter();
  @Input() highlightedSection: Section;

  private primaryNames:string[] = new Array(0);
  private secondaryNames:string[] = new Array(0);
  private primaryCapabilitiesNumber:number = 0;
  private disableButton:boolean = true;

  ngOnChanges(changes:any) {
    if (this.candidateRoles) {
       this.setPrimaryCapabilitydata();
      /*      for (let role of this.candidateRoles) {
        if (role.capabilities) {
          for (let primary of role.capabilities) {
            if (primary.isPrimary == true) {
              this.primaryNames.push(primary.name);
            }
            else if( primary.isPrimary == false) {
              this.secondaryNames.push(primary.name);
            }
          }
        }
      }*/
    }
    this.primaryCapabilitiesNumber= this.primaryNames.length;
    if(this.primaryNames.length>0){
      this.disableButton=false;
    }
  }

  selectedCapability(selectedRole:Role, selectedCapability:Capability, event:any) {
    this.disableButton = false;
    this.roles[0].isAPIForComplexity = true;
    if (event.target.checked) {
      if (this.primaryCapabilitiesNumber < ValueConstant.MAX_CAPABILITIES) {
        this.primaryCapabilitiesNumber++;
        selectedCapability.isPrimary = true;
        this.primaryNames.push(selectedCapability.name);

      } else {
        this.secondaryNames.push(selectedCapability.name);
        selectedCapability.isSecondary = true;
      }
    } else {
      if (selectedCapability.isPrimary) {
        this.primaryCapabilitiesNumber--;
        this.primaryNames.splice(this.primaryNames.indexOf(selectedCapability.name),1);
        selectedCapability.isPrimary = false;
      } else if (selectedCapability.isSecondary) {
        this.secondaryNames.splice(this.secondaryNames.indexOf(selectedCapability.name),1);
        selectedCapability.isSecondary = false;
      }
    }
  }

  onNext() {
    this.highlightedSection.name = "Complexities";
    this.highlightedSection.isDisable=false;
    this.disableButton = true;
    this.onComplete.emit(this.roles);
  }

  setPrimaryCapabilitydata(){
    this.secondaryNames = new Array(0);
    this.primaryNames = new Array(0);
    for (let role of this.candidateRoles) {
      if (role.capabilities) {
        for (let primary of role.capabilities) {
          if (primary.isPrimary == true) {
            this.primaryNames.push(primary.name);
          }
          else if( primary.isSecondary == true) {
            this.secondaryNames.push(primary.name);
          }
        }
      }
    }
  }
}
