import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Role} from '../model/role';
import {Capability} from '../model/capability';
import {LocalStorage, ValueConstant} from '../../../framework/shared/constants';
import {Section} from '../model/candidate';
import {LocalStorageService} from '../../../framework/shared/localstorage.service';

@Component({
  moduleId: module.id,
  selector: 'cn-capabilities',
  templateUrl: 'capabilities.component.html',
  styleUrls: ['capabilities.component.css']
})

export class CapabilitiesComponent {

  @Input() roles: Role[] = new Array(0);
  @Input() candidateRoles: Role[] = new Array();
  @Output() onComplete = new EventEmitter();
  @Input() highlightedSection: Section;
  private savedselectedRoles:Role[]= new Array(0);
  private showButton: boolean = true;
  private primaryNames: string[] = new Array(0);
  private savedprimaryNames: string[] = new Array(0);
  private secondaryNames: string[] = new Array(0);
  private savedsecondaryNames: string[] = new Array(0);
  private primaryCapabilitiesNumber: number = 0;
  private disableButton: boolean = true;
  private isCandidate: boolean = false;
  private emptyCapabilities: boolean;
  tooltipCandidateMessage: string =

    "<ul>" +
    "<li>" +
    "<h5>Capabilities </h5><p class='info'>Select those capabilities that describe your current strength. These capabilities would define you in the eyes of the recruiter and help you align with the best suitable job. If there are capabilities that you have developed in past but are no more relevent, you should not select such capabilites as this would dilute the matching and alignment with the best job opportunity.</p>" +
    "</li>" +
    "</ul>";

  tooltipRecruiterMessage: string =

    "<ul>" +
    "<li>" +
    "<h5>Capabilities </h5><p class='info'>Select those capabilities that are required in the candidate." +
    "These Capabilities are going to help you find best candidate you desire.</p>" +
    "</li>" +
    "</ul>";

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
    }
  }

  ngOnChanges(changes: any) {
    if (this.candidateRoles) {
      this.setPrimaryCapabilitydata();
    }
    this.primaryCapabilitiesNumber = this.primaryNames.length;
  }

  selectedCapability(selectedRole: Role, selectedCapability: Capability, event: any) {
    this.disableButton = false;
    this.roles[0].isAPIForComplexity = true;
    if (event.target.checked) {
      this.emptyCapabilities = false;
      if (this.primaryCapabilitiesNumber < ValueConstant.MAX_CAPABILITIES) {
        this.primaryCapabilitiesNumber++;
        selectedCapability.isPrimary = true;
        this.primaryNames.push(selectedCapability.name);

      } else {
        event.target.checked=false;
        /*this.secondaryNames.push(selectedCapability.name);
        selectedCapability.isSecondary = true;*/
      }
    } else {
      if (selectedCapability.isPrimary) {
        this.primaryCapabilitiesNumber--;
        this.primaryNames.splice(this.primaryNames.indexOf(selectedCapability.name), 1);
        selectedCapability.isPrimary = false;
      } else if (selectedCapability.isSecondary) {
        /*this.secondaryNames.splice(this.secondaryNames.indexOf(selectedCapability.name), 1);
        selectedCapability.isSecondary = false;*/

      }
    }
  }

  onNext() {
    if(!(this.primaryNames.length>0)){
      this.emptyCapabilities = true;
      return;
    }
    this.highlightedSection.name = "Complexities";
    this.highlightedSection.isDisable = false;
    this.disableButton = true;
    var newselectedRoles:Role[]= new Array(0);
    for(let role of this.roles){
      let tempRole =Object.assign({}, role);
      newselectedRoles.push(tempRole);
      tempRole.capabilities= tempRole.capabilities.filter((cap : Capability)=> {
        return cap.isPrimary;
      });
    }
    this.onComplete.emit(newselectedRoles);
  }

onSave(){
    if(!(this.primaryNames.length>0)){
      this.emptyCapabilities = true;
      return;
    }
    if(this.savedprimaryNames.length===this.primaryNames.length && this.savedsecondaryNames.length===this.secondaryNames.length){
      var goNext:boolean=false;
      for(let primary of this.primaryNames){
        if(this.savedprimaryNames.indexOf(primary)===-1) {
          goNext=true;
          break;
        }
      }
      for(let secondary of this.secondaryNames){
        if(this.savedsecondaryNames.indexOf(secondary)===-1) {
          goNext=true;
          break;
        }
      }

      if(goNext){
        this.onNext();
      } else{
        this.onCancel();
      }

    } else{
      this.onNext();
    }


}
  onCancel(){
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.roles=new Array(0);
    for(let role of this.savedselectedRoles){
      let originalRole =Object.assign({}, role);
      this.roles.push(originalRole);
    }
    this.primaryNames=this.savedprimaryNames.slice();
    this.secondaryNames=this.savedsecondaryNames.slice();
  }

  setPrimaryCapabilitydata() {
    this.secondaryNames = new Array(0);
    this.primaryNames = new Array(0);

    for (let role of this.candidateRoles) {
      for (let mainRole of this.roles) {
        if (role.name === mainRole.name) {
          if (role.capabilities) {
            for (let cap of role.capabilities) {
              if (mainRole.capabilities) {
                for (let mainCap of mainRole.capabilities) {
                  if (cap.name === mainCap.name) {
                    cap.isPrimary ? this.primaryNames.push(cap.name) : (cap.isSecondary ? this.secondaryNames.push(cap.name) : console.log(""));
                    mainCap.isPrimary = cap.isPrimary;
                    mainCap.isSecondary = cap.isSecondary;
                    if (cap.complexities && cap.complexities.length > 0) {
                      mainCap.complexities = cap.complexities;
                    }
                  }
                }
              }
            }
          }
          if (role.default_complexities && role.default_complexities.length) {
            mainRole.default_complexities = role.default_complexities;
          }
        }
      }
    }
    this.savedselectedRoles=new Array(0);
    for(let role of this.roles){
      let savetempRole =Object.assign({}, role);
      this.savedselectedRoles.push(savetempRole);
    }
    this.savedprimaryNames=this.primaryNames.slice();
    this.savedsecondaryNames=this.secondaryNames.slice();


  }
}
