import { Component, OnInit } from '@angular/core';
import { NavigationRoutes } from '../../../framework/shared/constants';
import { Router } from '@angular/router';
import { ComplexityService } from '../complexity.service';
import { Candidate, Section } from '../model/candidate';
import { CandidateProfileService } from './candidate-profile.service';
import { Role } from '../model/role';

@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'candidate-profile.component.html',
  styleUrls: ['candidate-profile.component.css']
})

export class CandidateProfileComponent implements OnInit {
  whichStepsVisible: boolean[] = new Array(7);
  private rolesForMain: Role[] = new Array(0);
  private rolesForCapability: Role[] = new Array(0);
  private rolesForComplexity: Role[] = new Array(0);
  private roleList: string[] = new Array();
  private primaryCapability: string[] = new Array();
  private proficiencies: string[] = new Array();
  private isComplexityPresent: boolean = false;
  private isShowNext: boolean = true;
  private isShowPrev: boolean = false;
  private showCapability: boolean = false;
  private showComplexity: boolean = false;
  private showProficiency: boolean = false;
  private showIndustryExperience: boolean = false;
  private showProfessionalData: boolean = false;
  private showEmploymentHistory: boolean = false;
  private showAcademicsDetails: boolean = false;
  private showCertificationDetails: boolean = false;
  private showAwards: boolean = false;
  private showAboutMySelf: boolean = false;
  private isRolesShow: boolean = true;
  private candidate: Candidate = new Candidate();
  private candidateForRole: Role[];
  private candidateForCapability: Role[];
  private candidateForComplexity: Role[];
 // private showTooltip: boolean = false;
  private setTimeoutId: any;
  private showModalStyle: boolean = false;
  private goto: boolean = false;
  private isPresentCapability: boolean = false;
  private isPresentDefaultcomplexity: boolean = false;
  private highlightedSection: Section = new Section();

  constructor(private _router: Router,
              private complexityService: ComplexityService,
              private profileCreatorService: CandidateProfileService) {

    complexityService.showTest$.subscribe(
      data => {
        this.whichStepsVisible[3] = data;
        this.showComplexity = data;
      }
    );
    this.getCandidateProfile();
  }
  ngOnInit() {
    this.whichStepsVisible[0] = true;
  }

  onSkip() {
    this.highlightedSection.name='Profile';
  }

  onProfileDescriptionComplete() {
    this.saveCandidateDetails();
    this.getRoles();
    this.isRolesShow = false;
    this.candidateForRole = this.candidate.industry.roles;
    this.candidateForCapability = this.candidate.industry.roles;
  }


  onWorkAreaComplete(roles: Role[]) {
    this.candidate.industry.roles = roles;
    this.saveCandidateDetails();
    this.candidateForCapability = this.candidate.industry.roles;
    this.candidateForComplexity = this.candidate.industry.roles;
    this.rolesForCapability = new Array(0);
    this.getCapability();
    this.showCapability = true;
    this.whichStepsVisible[1] = true;
    this.whichStepsVisible[3] = false;
  }

  onCapabilityComplete(roles: Role[]) {
    this.candidate.industry.roles = roles;
    this.candidateForCapability = this.candidate.industry.roles;
    this.candidateForRole = this.candidate.industry.roles;
    this.candidateForComplexity = this.candidate.industry.roles;
    this.saveCandidateDetails();
    this.getComplexity();
    this.showComplexity = true;
    this.whichStepsVisible[2] = true;
  }
  onComplextyAnswered(capability_matrix:any) {
    this.candidate.capability_matrix=capability_matrix;
    this.saveCandidateDetails();
  }
  onComplexityComplete(roles: Role[]) {
    this.candidate.industry.roles = roles;
    var date = new Date();
    date.setDate(date.getDate() + 90);
    this.candidate.lockedOn = date;
    this.highlightedSection.date = date;
    this.candidateForComplexity = this.candidate.industry.roles;
    this.candidateForCapability = this.candidate.industry.roles;
    this.saveCandidateDetails();
    this.showProficiency = true;
    this.getProficiency();
  }

  onProficiencySelect(proficiency: string[]) {
    this.candidate.proficiencies = proficiency;
    this.highlightedSection.isProficiencyFilled = true;
    this.saveCandidateDetails();
    this.whichStepsVisible[4] = true;
  }

  onProficiencyComplete(event: any) {
    this.showIndustryExperience = true;
  }

  onExperienceIndustrySelect(experiencedindustry: string[]) {
    this.candidate.interestedIndustries = experiencedindustry;
    this.candidate.isCompleted = true;
    this.saveCandidateDetails();
  }

  onExperienceIndustryComplete() {
    this.showProfessionalData = true;
  }

  onProfessionalDataComplete() {
    this.whichStepsVisible[5] = true;
    this.showEmploymentHistory = true;
    this.showAcademicsDetails = true;
    this.showCertificationDetails = true;
    this.showAwards = true;
    this.showAboutMySelf = true;
  }

  onEmploymentHistoryComplete() {

  }

  onAcademicDetailsComplete() {

  }

  onCertificationsComplete() {

  }

  onAwardsComplete() {

  }
  onMoreAboutMySelfComplete(data: string) {
    if (data !== '') {
      this.whichStepsVisible[6] = true;
    } else {
      this.whichStepsVisible[6] = false;
    }
  }

  getRoles() {
    this.profileCreatorService.getRoles(this.candidate.industry.name)
      .subscribe(
        rolelist => this.rolesForMain = rolelist.data);
  }

  getCapability() {
    this.roleList = new Array(0);
    for (let role of this.candidate.industry.roles) {
      this.roleList.push(role.name);
    }
    if (this.candidate.industry.name !== undefined && this.roleList !== undefined) {
      this.profileCreatorService.getCapability(this.candidate.industry.name, this.roleList)
        .subscribe(
          rolelist => {
            this.rolesForCapability = rolelist.data
            for (let item of this.rolesForCapability) {
              if (item.capabilities.length > 0) {
                this.goto = true;
              }
            }
            if (this.goto === false) {
              if (this.whichStepsVisible[3] !== true) {
                this.highlightedSection.name = 'Complexities';
                this.highlightedSection.isDisable = false;
              }
              this.getComplexity();
              this.showComplexity = true;
              this.whichStepsVisible[2] = true;
            }
            this.goto = false;
            this.getCandidateForCapability();
          });
    }
  }

  getComplexity() {
    this.primaryCapability = new Array(0);
    for (let role of this.candidate.industry.roles) {
      if (role.capabilities && role.capabilities.length > 0) {
        for (let capability of role.capabilities) {
          if (capability.isPrimary) {
            this.primaryCapability.push(capability.name);
          }
        }
      }
    }
    if (this.candidate.industry.name !== undefined && this.roleList !== undefined) {
      this.profileCreatorService.getComplexity(this.candidate.industry.name, this.roleList, this.primaryCapability)
        .subscribe(
          rolelist => {
            this.rolesForComplexity = rolelist.data;
            this.showComplexity = true;
            this.getCandidateForComplexity();
          });
    }
  }

  getCandidateProfile() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.OnCandidateDataSuccess(candidateData);
        });
  }

  getCandidateForCapability() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.candidateForCapability = candidateData.data[0].industry.roles);
  }

  getCandidateForComplexity() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.candidate.capability_matrix = candidateData.data[0].capability_matrix;
        });
  }

  getProficiency() {
    this.profileCreatorService.getProficiency()
      .subscribe(
        data => {
          this.proficiencies = data.data[0].proficiencies;
        });
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidateForRole = candidateData.data[0].industry.roles;
    this.candidateForCapability = candidateData.data[0].industry.roles;
    this.candidateForComplexity = candidateData.data[0].industry.roles;
    if (this.candidate.jobTitle === undefined || this.candidate.industry.name == undefined) {
      //TODO: Shrikant write logic which should be the active section
      this.highlightedSection.name = 'GuideTour';
    }


    if (this.candidate.isVisible === undefined) {
      this.candidate.isVisible = true;
    }
    if (this.candidate.lockedOn !== undefined) {
      if (this.dateDifferenceInDays(new Date(), new Date(this.candidate.lockedOn)) <= 90) {
        this.highlightedSection.date = this.candidate.lockedOn;
        this.highlightedSection.isLocked = true;
      } else {
        this.highlightedSection.isLocked = false;
      }
    }

    if (this.highlightedSection.name !== 'GuideTour') {
      if (this.candidate.industry.name !== undefined) {
        this.isRolesShow = false;
        this.getRoles();
        if (this.candidate.industry.roles.length > 0) {
          this.showCapability = true;
          this.getCapability();
          this.whichStepsVisible[1] = true;
          this.getProficiency();

          for(let role of this.candidate.industry.roles)
          {
            if(role.default_complexities[0]!==undefined && role.default_complexities[0].complexities.length>0) {
              this.isPresentDefaultcomplexity=true;
            }
            if(role.capabilities !== undefined && role.capabilities.length>0) {
              this.isPresentCapability=true;
            }
          }
          //if (( this.candidate.industry.roles[0].capabilities && this.candidate.industry.roles[0].capabilities.length >= 1 )
          // || (this.candidate.industry.roles[0].default_complexities && this.candidate.industry.roles[0].default_complexities.length >= 1)) {
          if ( this.isPresentCapability|| this.isPresentDefaultcomplexity){
            this.getComplexity();
            this.whichStepsVisible[2] = true;
//              if ((this.candidate.industry.roles[0].capabilities[0] != undefined && this.candidate.industry.roles[0].capabilities[0].complexities.length > 0)||
//              ( this.candidate.industry.roles[0].default_complexities[0] != undefined  && this.candidate.industry.roles[0].default_complexities[0].complexities.length > 0)) {

              if (this.isPresentCapability|| this.isPresentDefaultcomplexity) {
                this.whichStepsVisible[3] = true;
                this.highlightedSection.name = 'None';
              } else {
                this.highlightedSection.name = 'Complexities';
              }
          } else {
            this.highlightedSection.name = 'Capabilities';
          }
        } else {
          this.highlightedSection.name = 'Work-Area';
        }
      } else {
        this.highlightedSection.name = 'Profile';
      }
    }

    if (this.candidate.proficiencies !== undefined && this.candidate.proficiencies.length > 0) {
      this.highlightedSection.isProficiencyFilled = true;
      this.showProficiency = true;
      this.whichStepsVisible[4] = true;
    }

    if (this.candidate.interestedIndustries !== undefined && this.candidate.interestedIndustries.length > 0) {
      this.showIndustryExperience = true;
    }

    if (this.candidate.professionalDetails !== undefined && this.candidate.professionalDetails.education !== '') {
      this.showProfessionalData = true;
      this.whichStepsVisible[5] = true;
    }

    if (candidateData.data[0].isCompleted === true) {
      this.showIndustryExperience = true;
      this.showProfessionalData = true;
      this.showAboutMySelf = true;
      this.showAcademicsDetails = true;
      this.showAwards = true;
      this.showProficiency=true;
      this.showCertificationDetails = true;
      this.showEmploymentHistory = true;
    }
    if (this.candidate.aboutMyself !== undefined && this.candidate.aboutMyself !== '') {
      this.whichStepsVisible[6] = true;
    }
    /*
     Do not remove this code it will in use after capability bug
     if (this.candidate.proficiencies !== undefined && this.candidate.proficiencies.length > 0) {
     this.highlightedSection.isProficiencyFilled = true;
     this.showProficiency = true;
     this.whichStepsVisible[4] = true;
     if (this.candidate.interestedIndustries !== undefined && this.candidate.interestedIndustries.length > 0) {
     this.showIndustryExperience = true;
     if (this.candidate.professionalDetails !== undefined && this.candidate.professionalDetails.education !== '') {
     this.showProfessionalData = true;
     this.whichStepsVisible[5] = true;
     } else {
     this.showProfessionalData = true;
     this.whichStepsVisible[5] = true;
     this.highlightedSection.name = 'Professional-Details';
     }
     } else {
     this.showIndustryExperience = true;
     this.highlightedSection.name = 'IndustryExposure';
     }
     } else {
     this.showProficiency = true;
     this.whichStepsVisible[4] = true;
     this.highlightedSection.name = 'Proficiencies';
     }*/
  }

  dateDifferenceInDays(currentDate: Date, storedDate: Date) {
    return Math.floor(( Date.UTC(storedDate.getFullYear(),
            storedDate.getMonth(),
            storedDate.getDate()) - Date.UTC(currentDate.getFullYear(),
            currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  showOrHide(type: string, event: any) {
    if (type == "show") {
      if (event.target.checked) {
        this.candidate.isVisible = true;
      }
    } else {
      if (type === 'hide') {
        if (event.target.checked) {
          this.candidate.isVisible = false;
        }
      }
    }
    this.saveCandidateDetails();
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }

  saveCandidateDetails() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
      });
  }

  onSubmit() {
    this.showModalStyle = !this.showModalStyle;
    if (this.setTimeoutId !== undefined) {
      clearTimeout(this.setTimeoutId);
    }
    this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
  }


  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
    this.setTimeoutId = setTimeout(() => {
      this.onSubmit();
    }, 1000 * 11);
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

}
