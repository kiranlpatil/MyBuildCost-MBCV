import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role } from '../model/role';
import { Capability } from '../../../user/models/capability';
import { Headings, ImagePath, LocalStorage, Messages, Tooltip, ValueConstant } from '../../../shared/constants';
import { Section } from '../../../user/models/candidate';
import { LocalStorageService } from '../../../shared/services/localstorage.service';
import { GuidedTourService } from '../guided-tour.service';
import { ErrorService } from '../../../shared/services/error.service';
import {ComplexityAnsweredService} from "../complexity-answered.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'cn-capabilities',
  templateUrl: 'capabilities.component.html',
  styleUrls: ['capabilities.component.css']
})

export class CapabilitiesComponent {

  @Input() roles: Role[] = new Array(0);
    @Input() candidateRoles: Role[] = [];
  @Output() onComplete = new EventEmitter();
  @Input() highlightedSection: Section;
  candidateCapabilityMessage:string = Headings.CAPABILITIES_FOR_CANDIDATE;
  recruiterCapabilityMessage:string = Headings.CAPABILITIES_FOR_RECRUITER;
  gotItMessage:string = Headings.GOT_IT;
  private savedselectedRoles:Role[]= new Array(0);
  private showButton: boolean = true;
  private primaryNames: string[] = new Array(0);
  private savedprimaryNames: string[] = new Array(0);
  private secondaryNames: string[] = new Array(0);
  private savedsecondaryNames: string[] = new Array(0);
  private primaryCapabilitiesNumber: number = 0;
  private disableButton: boolean = true;
  isCandidate: boolean = false;
  private isValid: boolean = true;
  private validationMessage = Messages.MSG_ERROR_VALIDATION_CAPABILITIES_REQUIRED_RECRUITER;
  private capabilitiesCodes : string[]= new Array(0);
  guidedTourStatus:string[] = new Array(0);
  guidedTourImgOverlayScreensCapabilities: string;
  //private guidedTourImgOverlayScreensComplexitiesPath:string;
  isGuideImg:boolean = false;
  private isInfoMessage: boolean = false;
  userId: string;

  tooltipCandidateMessage: string =

    '<ul>' +
    '<li><p>1. ' + Tooltip.CANDIDATE_CAPABILITY_TOOLTIP_1 + '</p></li>' +
    '<li><p>2. ' + Tooltip.CANDIDATE_CAPABILITY_TOOLTIP_2 + '</p>' + '</li>' +
    '</ul>';

  tooltipRecruiterMessage: string =

    '<ul>' +
    '<li><p>1. ' + Tooltip.RECRUITER_CAPABILITY_TOOLTIP + '</p></li>' +
    '</ul>';

  constructor(private guidedTourService:GuidedTourService, private errorService:ErrorService,
              private complexityAnsweredService: ComplexityAnsweredService,
              private _router: Router) {

  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === 'true') {
      this.isCandidate = true;
      this.userId=LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    }
  }

  ngOnChanges(changes: any) {
    this.isValid = true;
    this.validationMessage = '';
    if (this.candidateRoles) {
      this.setPrimaryCapabilitydata();
    }
    if(changes.roles && changes.roles.currentValue) {
      this.capabilitiesCodes= new Array(0);
      for(let role of changes.roles.currentValue) {
        let duplicateCapabilityIndex : number;
          for(let capability of role.capabilities) {
            if(this.capabilitiesCodes.indexOf(capability.code) != -1 ) {
              duplicateCapabilityIndex= role.capabilities.indexOf(capability);
            }else {
              this.capabilitiesCodes.push(capability.code);
            }
          }
          if(duplicateCapabilityIndex != undefined) {
            role.capabilities.splice(duplicateCapabilityIndex,1);
          }
      }
      let guidedTourImages = LocalStorageService.getLocalValue(LocalStorage.GUIDED_TOUR);
      let newArray = JSON.parse(guidedTourImages);
      if (newArray == undefined || newArray == null || (newArray && newArray.indexOf(ImagePath.CANDIDATE_OERLAY_SCREENS_CAPABILITIES) == -1)) {
        this.isGuidedTourImgRequire();
      }
    }
    this.primaryCapabilitiesNumber = this.primaryNames.length;
  }

  selectedCapability(selectedRole: Role, selectedCapability: Capability, event: any) {
    selectedCapability.complexities=[];
    this.isValid = true;
    this.isInfoMessage = false;
    this.validationMessage = '';
    this.disableButton = false;
    this.roles[0].isAPIForComplexity = true;
    let setOfCapabilityNumber = [7,8,9];
    if (event.target.checked) {
      this.isValid = false;
      this.isInfoMessage = false;
      if (this.primaryCapabilitiesNumber < ValueConstant.MAX_CAPABILITIES) {
        this.primaryCapabilitiesNumber++;
        if(setOfCapabilityNumber.indexOf(this.primaryCapabilitiesNumber) > -1 && this.capabilitiesCodes.length >= ValueConstant.MAX_CAPABILITIES) {
          this.isValid = false;
          this.isInfoMessage = true;
          this.validationMessage = `You can select ${ValueConstant.MAX_CAPABILITIES - this.primaryCapabilitiesNumber} more capabilities.`
        }
        selectedCapability.isPrimary = true;
        this.primaryNames.push(selectedCapability.name);
        this.complexityAnsweredService.change(true);
        this.saveOnSelect();

      } else {
        event.target.checked=false;
        this.isValid = false;
        this.isInfoMessage = true;
        this.validationMessage = Messages.MSG_ERROR_VALIDATION_MAX_CAPABILITIES_CROSSED;
        /*this.secondaryNames.push(selectedCapability.name);
        selectedCapability.isSecondary = true;*/
      }
    } else {
      if (selectedCapability.isPrimary) {
        this.primaryCapabilitiesNumber--;
        if(setOfCapabilityNumber.indexOf(this.primaryCapabilitiesNumber) > 0 && this.capabilitiesCodes.length >= ValueConstant.MAX_CAPABILITIES) {
          this.isValid = false;
          this.isInfoMessage = true;
          this.validationMessage = `You can select ${ValueConstant.MAX_CAPABILITIES - this.primaryCapabilitiesNumber} more capabilities.`
        }
        this.primaryNames.splice(this.primaryNames.indexOf(selectedCapability.code), 1);
        selectedCapability.isPrimary = false;
        //this.complexityAnsweredService.change(true);
        this.saveOnSelect();
      } else if (selectedCapability.isSecondary) {
        /*this.secondaryNames.splice(this.secondaryNames.indexOf(selectedCapability.name), 1);
        selectedCapability.isSecondary = false;*/

      }
    }
  }

  onNext() {
    this.onNextAction();
  }

  isGuidedTourImgRequire() {
    this.isGuideImg = true;
    this.guidedTourImgOverlayScreensCapabilities = ImagePath.CANDIDATE_OERLAY_SCREENS_CAPABILITIES;
    //this.guidedTourImgOverlayScreensComplexitiesPath = ImagePath.BASE_ASSETS_PATH_DESKTOP + ImagePath.CANDIDATE_OERLAY_SCREENS_COMPLEXITIES;
  }
  onGotItGuideTour() {
    this.guidedTourStatus = this.guidedTourService.updateTourStatus(ImagePath.CANDIDATE_OERLAY_SCREENS_CAPABILITIES, true);
    this.guidedTourStatus = this.guidedTourService.getTourStatus();
    this.isGuideImg = false;
    this.guidedTourService.updateProfileField(this.guidedTourStatus)
      .subscribe(
        (res:any) => {
          LocalStorageService.setLocalValue(LocalStorage.GUIDED_TOUR, JSON.stringify(res.data.guide_tour));
        },
        error => this.errorService.onError(error)
      );
  }

  onNextAction() {
    this.isValid = true;
    this.validationMessage = '';
    if(this.primaryNames.length == 0){
      this.isValid = false;
      this.isInfoMessage = false;
      this.validationMessage = this.isCandidate ? Messages.MSG_ERROR_VALIDATION_CAPABILITIES_REQUIRED_CANDIDATE : Messages.MSG_ERROR_VALIDATION_CAPABILITIES_REQUIRED_RECRUITER;
      return;
    }
      this.highlightedSection.name = 'Complexities';
    this.highlightedSection.isDisable = false;
    this.disableButton = true;
   /* var newselectedRoles:Role[]= new Array(0);
    for(let role of this.roles){
      let tempRole =Object.assign({}, role);
      newselectedRoles.push(tempRole);
      tempRole.capabilities= tempRole.capabilities.filter((cap : Capability)=> {
        return cap.isPrimary;
      });
    }
    this.onComplete.emit(newselectedRoles);*/
    this.complexityAnsweredService.change(true);

      window.scrollTo(0, 0);
  }

  onSave(){
    this.isValid = true;
    this.validationMessage = '';
    if(this.primaryNames.length == 0){
      this.isValid = false;
      this.isInfoMessage = false;
      this.validationMessage = this.isCandidate ? Messages.MSG_ERROR_VALIDATION_CAPABILITIES_REQUIRED_CANDIDATE : Messages.MSG_ERROR_VALIDATION_CAPABILITIES_REQUIRED_RECRUITER;
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

      window.scrollTo(0, 0);
  }

    onPrevious() {
        this.highlightedSection.name = 'Work-Area';
        window.scrollTo(0, 0);
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
        if (role.code === mainRole.code) {
          if (role.capabilities) {
            for (let cap of role.capabilities) {
              if (mainRole.capabilities) {
                for (let mainCap of mainRole.capabilities) {
                  if (cap.code === mainCap.code) {
                      cap.isPrimary ? this.primaryNames.push(cap.code) : (cap.isSecondary ? this.secondaryNames.push(cap.code) : console.log(''));
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
  getMessage() {
    return Messages;
  }

  saveOnSelect() {
    var newselectedRoles:Role[]= new Array(0);
    for(let role of this.roles){
      let tempRole =Object.assign({}, role);
      newselectedRoles.push(tempRole);
      tempRole.capabilities= tempRole.capabilities.filter((cap : Capability)=> {
        return cap.isPrimary;
      });
    }
    this.onComplete.emit(newselectedRoles);
    this.complexityAnsweredService.change(true);
  }

  navigateToWithId(nav:string) {
    var userId = LocalStorageService.getLocalValue(LocalStorage.USER_ID);
    if (nav !== undefined) {
      let x = nav+'/'+ userId + '/create';
      // this._router.navigate([nav, userId]);
      this._router.navigate([x]);
    }
  }

}
