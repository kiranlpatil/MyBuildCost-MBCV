import {Component, DoCheck, KeyValueDiffers, OnInit} from '@angular/core';
import {NavigationRoutes} from '../../../framework/shared/constants';
import {Router} from '@angular/router';
import {ComplexityService} from '../complexity.service';
import {Candidate, Section} from '../model/candidate';
import {CandidateProfileService} from './candidate-profile.service';
import {Role} from '../model/role';
import {Industry} from '../model/industry';

@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'candidate-profile.component.html',
  styleUrls: ['candidate-profile.component.css']
})

export class CandidateProfileComponent implements OnInit, DoCheck {
  whichStepsVisible:boolean[] = new Array(7);
  private rolesForMain:Role[] = new Array(0);
  private rolesForCapability:Role[] = new Array(0);
  private rolesForComplexity:Role[] = new Array(0);
  private roleList:string[] = [];
  private primaryCapability:string[] = [];
  private proficiencies:string[] = [];
  private isComplexityPresent:boolean = false;
  private isShowNext:boolean = true;
  private isShowPrev:boolean = false;
  private showCapability:boolean = false;
  private showComplexity:boolean = false;
  private showProficiency:boolean = false;
  private showIndustryExperience:boolean = false;
  private showProfessionalData:boolean = false;
  private showEmploymentHistory:boolean = false;
  private showAcademicsDetails:boolean = false;
  private showCertificationDetails:boolean = false;
  private showAwards:boolean = false;
  private showAboutMySelf:boolean = false;
  private isRolesShow:boolean = true;
  private isIndustryShow: boolean = true;
  private candidate:Candidate = new Candidate();
  private candidateForRole:Role[];
  private candidateForCapability:Role[];
  private candidateForComplexity:Role[];
  // private showTooltip: boolean = false;
  private setTimeoutId:any;
  private showModalStyle:boolean = false;
  private goto:boolean = false;
  private isPresentCapability:boolean = false;
  private isComplexityFilled:boolean = true;
  private isPresentDefaultcomplexity:boolean = false;
  private highlightedSection:Section = new Section();
  differ: any;
  constructor(private _router:Router,
              private complexityService:ComplexityService,
              private differs: KeyValueDiffers,
              private profileCreatorService:CandidateProfileService) {

    complexityService.showTest$.subscribe(
      data => {
        this.whichStepsVisible[3] = data;
        this.showComplexity = data;
      }
    );
    this.getCandidateProfile();
    this.differ = differs.find({}).create(null);

  }

  ngOnInit() {
    this.whichStepsVisible[0] = true;
  }

  ngDoCheck() {
    let changes: any = this.differ.diff(this.highlightedSection);

    if (changes) {
      if (this.highlightedSection.name === 'Work-Area') {
        this.getRoles();
        return;
      } else if (this.highlightedSection.name === 'Capabilities') {
        this.getCapability();
        return;
      } else if (this.highlightedSection.name === 'Complexities') {
        this.getComplexity();
        return;
      }
    }
  }
  onSkip() {
    this.highlightedSection.name = 'Profile';
  }

  onProfileDescriptionComplete() {
    this.saveCandidateDetails();
    this.isIndustryShow = false;
  }

  onIndustryChange(newIndustry: Industry) {
    if (newIndustry !== undefined && newIndustry.name !== '') {
      this.candidate.industry = newIndustry;
      this.saveCandidateDetails();
      this.isRolesShow = false;
      this.candidateForRole = this.candidate.industry.roles;
      this.candidateForCapability = this.candidate.industry.roles;
    }
  }

  onWorkAreaComplete(roles:Role[]) {
    this.candidate.industry.roles = roles;
    this.saveCandidateDetails();
    this.candidateForCapability = this.candidate.industry.roles;
    this.candidateForComplexity = this.candidate.industry.roles;
    this.rolesForCapability = new Array(0);
    this.showCapability = true;
    this.whichStepsVisible[1] = true;
    this.whichStepsVisible[3] = false;
  }

  onCapabilityComplete(roles:Role[]) {
    this.candidate.industry.roles = roles;
    this.candidateForCapability = this.candidate.industry.roles;
    this.candidateForRole = this.candidate.industry.roles;
    this.candidateForComplexity = this.candidate.industry.roles;
    this.saveCandidateDetails();
    this.whichStepsVisible[2] = true;
  }

  onComplextyAnswered(capability_matrix:any) {
    this.candidate.capability_matrix = capability_matrix;
    this.saveCandidateDetails();
  }

  onComplexityComplete(roles:Role[]) {
    var date = new Date();
    date.setDate(date.getDate() + 90);
    this.candidate.lockedOn = date;
    this.highlightedSection.date = date;
    this.saveCandidateDetails();
    this.showProficiency = true;
  }

  onProficiencySelect(proficiency:string[]) {
    this.candidate.proficiencies = proficiency;
    this.highlightedSection.isProficiencyFilled = true;
    this.saveCandidateDetails();
    this.whichStepsVisible[4] = true;
  }

  onProficiencyComplete(event:any) {
    this.showIndustryExperience = true;
    this.candidate.isCompleted = true;
  }

  onExperienceIndustrySelect(experiencedindustry:string[]) {
    this.candidate.interestedIndustries = experiencedindustry;
    this.candidate.isCompleted = true;
    this.saveCandidateDetails();
  }

  onExperienceIndustryComplete() {
    this.showProfessionalData = true;
  }

  onProfessionalDataComplete() {
    this.whichStepsVisible[5] = true;
    this.showAboutMySelf = true;
  }

  onEmploymentHistoryComplete() {
    this.showAcademicsDetails = true;
  }

  onAcademicDetailsComplete() {
    this.showCertificationDetails = true;
  }

  onCertificationsComplete() {
    this.showAwards = true;
  }

  onAwardsComplete() {
  }

  onMoreAboutMySelfComplete(data:string) {
    this.showEmploymentHistory = true;
    if (data !== '') {
      this.whichStepsVisible[6] = true;
    } else {
      this.whichStepsVisible[6] = false;
    }
  }

  getRoles() {
    this.profileCreatorService.getRoles(this.candidate.industry.code)
      .subscribe(
        rolelist => this.rolesForMain = rolelist.data);
  }

  getCapability() {
    this.roleList = new Array(0);
    for (let role of this.candidate.industry.roles) {
      this.roleList.push(role.code);
    }
    if (this.candidate.industry.name !== undefined && this.roleList !== undefined) {
      this.profileCreatorService.getCapability(this.candidate.industry.code, this.roleList)
        .subscribe(
          rolelist => {
            this.rolesForCapability = rolelist.data;
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
            this.primaryCapability.push(capability.code);
          }
        }
      }
    }
    if (this.candidate.industry.name !== undefined && this.roleList !== undefined) {
      this.profileCreatorService.getComplexity(this.candidate.industry.code, this.roleList, this.primaryCapability)
        .subscribe(
          rolelist => {
            this.rolesForComplexity = rolelist.data;
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
          this.candidate.capability_matrix = Object.assign({}, candidateData.data[0].capability_matrix);
          this.showComplexity = true;
        });
  }
  OnCandidateDataSuccess(candidateData:any) {
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
      if (this.candidate.jobTitle !== undefined && this.candidate.jobTitle !== '') {
        this.isIndustryShow = false;
        if (this.candidate.industry.name !== undefined && this.candidate.industry.name !== '') {
        this.isRolesShow = false;
        //this.getRoles();
        if (this.candidate.industry.roles.length > 0) {
          this.showCapability = true;
          //this.getCapability();
          this.whichStepsVisible[1] = true;
          for (let role of this.candidate.industry.roles) {
            if (role.default_complexities[0] !== undefined && role.default_complexities[0].complexities.length > 0) {
              this.isPresentDefaultcomplexity = true;
            }
            if (role.capabilities !== undefined && role.capabilities.length > 0) {
              this.isPresentCapability = true;
            }
          }
          if (this.isPresentCapability || this.isPresentDefaultcomplexity) {
            //this.getComplexity();
            this.showComplexity = true;
            this.whichStepsVisible[2] = true;
            if(this.candidate.capability_matrix){
              var capbilityMatrix:any = Object.keys(this.candidate.capability_matrix);
              for(let index of capbilityMatrix){
                if(this.candidate.capability_matrix[index]===-1){
                  this.isComplexityFilled=false;
                }
              }
            }
            if (this.isComplexityFilled) {
              this.whichStepsVisible[3] = true;
              if (this.candidate.proficiencies !== undefined && this.candidate.proficiencies.length > 0) {
                this.highlightedSection.isProficiencyFilled = true;
                this.showProficiency = true;
                this.whichStepsVisible[4] = true;
                if (this.candidate.interestedIndustries !== undefined && this.candidate.interestedIndustries.length > 0) {
                  this.showIndustryExperience = true;
                  if (this.candidate.professionalDetails !== undefined && this.candidate.professionalDetails.noticePeriod !== '') {
                    this.showProfessionalData = true;
                    this.whichStepsVisible[5] = true;
                    this.candidate.isCompleted=true;
                    this.highlightedSection.name = 'None';
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
              }
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
        this.highlightedSection.name = 'Industry';
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
      this.showProficiency = true;
      this.showCertificationDetails = true;
      this.showEmploymentHistory = true;
    }
    if (this.candidate.aboutMyself !== undefined && this.candidate.aboutMyself !== '') {
      this.whichStepsVisible[6] = true;
    }
  }
  isContains(element:any) {
  return this.candidate.capability_matrix[element] === -1;
}
  dateDifferenceInDays(currentDate:Date, storedDate:Date) {
    return Math.floor(( Date.UTC(storedDate.getFullYear(),
        storedDate.getMonth(),
        storedDate.getDate()) - Date.UTC(currentDate.getFullYear(),
        currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  showOrHide(type:string, event:any) {
    if (type == 'show') {
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
    this.candidate.isSubmitted = true;
    this.saveCandidateDetails();
    this.showModalStyle = !this.showModalStyle;
    if (this.setTimeoutId !== undefined) {
      clearTimeout(this.setTimeoutId);
    }
    this.goToDashboard();
  }


  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
    this.setTimeoutId = setTimeout(() => {
      this.onSubmit();
    }, 1000 * 11);
  }

  goToDashboard() {
    this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
  }
  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
}
