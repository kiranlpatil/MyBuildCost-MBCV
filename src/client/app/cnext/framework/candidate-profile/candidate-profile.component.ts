import {Component, OnInit} from "@angular/core";
import {NavigationRoutes} from "../../../framework/shared/constants";
import {Router} from "@angular/router";
import {ComplexityService} from "../complexity.service";
import {ProficiencyService} from "../proficience.service";
import {ProfessionalService} from "../professional-service";
import {EducationalService} from "../educational-service";
import {MyRoleListTestService} from "../myRolelist.service";
import {DisableTestService} from "../disable-service";
import {Candidate, Section} from "../model/candidate";
import {CandidateProfileService} from "./candidate-profile.service";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";
import {Role} from "../model/role";


@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'candidate-profile.component.html',
  styleUrls: ['candidate-profile.component.css']
})

export class CandidateProfileComponent implements OnInit {

  private rolesForMain:Role[] = new Array(0);
  private rolesForCapability:Role[] = new Array(0);
  private rolesForComplexity:Role[] = new Array(0);
  private roleList:string[] = new Array()
  private primaryCapability:string[] = new Array();
  private proficiencies:string[] = new Array();
  private isComplexityPresent:boolean = false;

  whichStepsVisible:boolean[] = new Array(7);
  private chkEmployeeHistory:boolean = false;
  private valueOFshowOrHide:string;
  private chkCertification:boolean = false;
  private chkAboutMyself:boolean = false;
  private chkAwards:boolean = false;
  private showCapability:boolean = false;
  private showComplexity:boolean = false;
  private showProfeciency:boolean = false;
  private showIndustryExperience:boolean = false;
  private showProfessionalData:boolean = false;
  private showemploymentHistory:boolean = false;
  private showAcademicsDetails:boolean = false;
  private showCertificationDetails:boolean = false;
  private showAwards:boolean = false;
  private showAboutMySelf:boolean = false;
  private isRolesShow:boolean = true;
  private showfield:boolean = false;
  private disableTitle:boolean = false;
  private candidate:Candidate = new Candidate();
  private candidateForRole:Role[];
  private candidateForCapability:Role[];
  private candidateForComplexity:Role[];
  private isHiddenAboutMyself:boolean = false;
  private isHiddenAwrard:boolean = false;
  private isHiddenCertificate:boolean = false;
  private isHiddenEmployeehistory:boolean = false;
  private isTitleFilled:boolean = false;
  private showTooltip:boolean = false;
  private highlightedSection:Section = new Section();

  constructor(private _router:Router,
              private proficiencyService:ProficiencyService,
              private professionalService:ProfessionalService,
              private educationalService:EducationalService,
              private complexityService:ComplexityService,
              private messageService:MessageService,
              private myRolelist:MyRoleListTestService,
              private disableService:DisableTestService,
              private profileCreatorService:CandidateProfileService) {

    this.myRolelist.showTestRolelist$.subscribe(
      data => {
        this.isRolesShow = data;
      }
    );


    disableService.showTestDisable$.subscribe(
      data=> {
        this.showfield = data;
      }
    );


    complexityService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[3] = data;
        this.showComplexity = data;
      }
    );
    proficiencyService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[3] = data;
        this.showProfeciency = data;
      }
    );
    professionalService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[5] = data;
      }
    );
    educationalService.showTest$.subscribe(
      data=> {
        this.whichStepsVisible[5] = data;
      }
    );
    this.getCandidateProfile();
  }


  ngOnInit() {
    this.whichStepsVisible[0] = true;

  }

  onProfileDescriptionComplete() {
    this.saveCandidateDetails();
    this.getRoles();
    this.isRolesShow = false;
    this.candidateForRole = this.candidate.industry.roles;
    this.candidateForCapability = this.candidate.industry.roles;
    this.rolesForCapability = new Array(0);
  }


  onWorkAreaComplete(roles:Role[]) {
    this.candidate.industry.roles = roles;
    this.saveCandidateDetails();
    this.candidateForCapability = this.candidate.industry.roles;
    this.rolesForCapability = new Array(0);
    this.getCapability();
    this.showCapability = true;
    this.whichStepsVisible[1] = true;

    if (this.candidate.industry.roles) {
      if (this.candidate.industry.roles[0].capabilities) {
        if (this.candidate.industry.roles[0].capabilities.length > 0) {
          this.getComplexity();
          this.showComplexity = true;
          this.whichStepsVisible[2] = true;
          if (this.candidate.industry.roles[0].capabilities[0].complexities) {
            if (this.candidate.industry.roles[0].capabilities[0].complexities.length > 0) {
              this.showProfeciency = true;
              this.getProficiency();
            }
          }
        }
      }
    }
  }

  onCapabilityComplete(roles:Role[]) {
    this.candidate.industry.roles = roles;
    this.candidateForCapability = this.candidate.industry.roles;
    this.saveCandidateDetails();
    this.getComplexity();
    this.showComplexity = true;
    this.whichStepsVisible[2] = true;
  }

  onComplexitytyComplete(roles:Role[]) {
    this.candidate.industry.roles = roles;
    var date = new Date();
    date.setDate(date.getDate() + 90);
    this.candidate.lockedOn = date;
    this.highlightedSection.date = date;
    this.candidateForComplexity = this.candidate.industry.roles;
    this.saveCandidateDetails();
    this.showProfeciency = true;
    this.getProficiency();
  }

  onProficiencySelect(proficiency:string[]) {
    this.candidate.proficiencies = proficiency;
    this.highlightedSection.isProficiencyFilled = true;
    this.saveCandidateDetails();
    this.whichStepsVisible[4] = true;
  }

  onProficiencyComplete(event:any) {
    this.showIndustryExperience = true;
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
    this.showemploymentHistory = true;
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

  onMoreAboutMySelfComplete(data:string) {
    console.log(data);
    if (data != '') {
      this.whichStepsVisible[6] = true;
    } else {
      this.whichStepsVisible[6] = false;
    }
  }

  getRoles() {
    this.profileCreatorService.getRoles(this.candidate.industry.name)
      .subscribe(
        rolelist => this.rolesForMain = rolelist.data,
        error => this.onError(error));
  }

  getCapability() {
    this.roleList = new Array(0);
    for (let role of this.candidate.industry.roles) {
      this.roleList.push(role.name);
    }
    if (this.candidate.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getCapability(this.candidate.industry.name, this.roleList)
        .subscribe(
          rolelist => {
            this.rolesForCapability = rolelist.data
            this.getCandidateForCapability();
          },
          error => this.onError(error));
    }
  }

  getComplexity() {
    this.primaryCapability = new Array(0);
    for (let role of this.candidate.industry.roles) {
      for (let capability of role.capabilities) {
        if (capability.isPrimary) {
          this.primaryCapability.push(capability.name);
        }
      }
    }
    if (this.candidate.industry.name != undefined && this.roleList != undefined) {
      this.profileCreatorService.getComplexity(this.candidate.industry.name, this.roleList, this.primaryCapability)
        .subscribe(
          rolelist => {
            this.rolesForComplexity = rolelist.data;
            this.getCandidateForComplexity();

          },
          error => this.onError(error));
    }
  }

  getCandidateProfile() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.OnCandidateDataSuccess(candidateData);
          console.log(candidateData)
        },
        error => this.onError(error));
  }

  getCandidateForCapability() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.candidateForCapability = candidateData.data[0].industry.roles,
        error => this.onError(error));
  }

  getCandidateForComplexity() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.candidateForComplexity = candidateData.data[0].industry.roles;
          if (this.candidateForComplexity && this.candidateForComplexity[0].capabilities && this.candidateForComplexity[0].capabilities[0] && this.candidateForComplexity[0].capabilities[0].complexities.length > 0) {
            this.isComplexityPresent = true;
          }
        },
        error => this.onError(error));
  }

  getProficiency() {
    this.profileCreatorService.getProficiency()
      .subscribe(
        data => {
          this.proficiencies = data.data[0].proficiencies;
          console.log(this.proficiencies);
        },
        error => this.onError(error));
  }

  OnCandidateDataSuccess(candidateData:any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidateForRole = candidateData.data[0].industry.roles;

    if (candidateData.data[0].isCompleted == true) {
      this.showIndustryExperience = true;
      this.showProfessionalData = true;
      this.showAboutMySelf = true;
      this.showAcademicsDetails = true;
      this.showAwards = true;
      this.showCertificationDetails = true;
      this.showemploymentHistory = true;
    }
    if (this.candidate.jobTitle === undefined || this.candidate.industry.name == undefined) {
      //TODO: Shrikant write logic which should be the active section
      this.highlightedSection.name = "Profile";
    }
    if (this.candidate.isVisible == undefined) {
      this.candidate.isVisible = true;
    }
    if (this.candidate.lockedOn != undefined) {
      if (this.dateDifferenceInDays(new Date(), new Date(this.candidate.lockedOn)) <= 90) {
        this.highlightedSection.date = this.candidate.lockedOn;
        this.highlightedSection.isLocked = true;
      }
      else {
        this.highlightedSection.isLocked = false;
      }
    }

    if (this.candidate.jobTitle !== undefined && this.candidate.jobTitle !== "") {
      this.isTitleFilled = false;
      this.highlightedSection.name = "None";
      this.disableTitle = true;
    }
    if (this.candidate.industry.name !== undefined) {
      this.isRolesShow = false;
      this.getRoles();
      if (this.candidate.industry.roles.length > 0) {
        this.showCapability = true;
        this.getCapability();
        this.whichStepsVisible[1] = true;
        this.getProficiency();
        if (this.candidate.industry.roles[0].capabilities.length >= 1) {
          this.getComplexity();
          this.showComplexity = true;
          this.whichStepsVisible[2] = true;
          if (this.candidate.industry.roles[0].capabilities[0].complexities.length > 0) {
            this.whichStepsVisible[3] = true;
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

    if (this.candidate.proficiencies !== undefined && this.candidate.proficiencies.length > 0) {
      this.highlightedSection.isProficiencyFilled=true;
      this.showProfeciency = true;
      this.whichStepsVisible[4] = true;
    }

    if (this.candidate.interestedIndustries !== undefined && this.candidate.interestedIndustries.length > 0) {
      this.showIndustryExperience = true;
    }

    if (this.candidate.professionalDetails !== undefined && this.candidate.professionalDetails.education !== '') {
      this.showProfessionalData = true;
      this.whichStepsVisible[5] = true;
    }


    /*
    Do not remove this code it will in use after capability bug
    if (this.candidate.proficiencies !== undefined && this.candidate.proficiencies.length > 0) {
      this.highlightedSection.isProficiencyFilled = true;
      this.showProfeciency = true;
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
      this.showProfeciency = true;
      this.whichStepsVisible[4] = true;
      this.highlightedSection.name = 'Proficiencies';
    }*/

    if (this.candidate.academics.length > 0 && this.candidate.academics[0].schoolName !== '') {
      this.showAcademicsDetails = true;
    }

    if (this.candidate.certifications.length > 0 && this.candidate.certifications[0].name !== '') {
      this.showCertificationDetails = true;
      this.isHiddenCertificate = true;
    }
    if (this.candidate.aboutMyself !== undefined && this.candidate.aboutMyself !== '') {
      this.whichStepsVisible[6] = true;
      this.showAboutMySelf = true;
      this.isHiddenAboutMyself = true;
    }
    if (this.candidate.employmentHistory.length > 0 && this.candidate.employmentHistory[0].companyName !== '') {
      this.showemploymentHistory = true;
      this.isHiddenEmployeehistory = true;
    }
    if (this.candidate.awards.length > 0 && this.candidate.awards[0].name !== '') {
      this.showAwards = true;
      this.isHiddenAwrard = true;
    }
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  dateDifferenceInDays(currentDate:Date, storedDate:Date) {
    return Math.floor(( Date.UTC(storedDate.getFullYear(), storedDate.getMonth(), storedDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  showorhide(type:string, event:any) {
    if (type == "show") {
      if (event.target.checked) {
        this.candidate.isVisible = true;
      }
    } else {
      if (type == "hide") {
        if (event.target.checked) {
          this.candidate.isVisible = false;
        }
      }
    }
    this.saveCandidateDetails();
  }

  hideEmployeeHistory() {
    this.chkEmployeeHistory = !this.chkEmployeeHistory;
  }

  hideCertification() {
    this.chkCertification = !this.chkCertification;
  }

  hideAboutMyself() {
    this.chkAboutMyself = !this.chkAboutMyself;
  }

  hideAwards() {
    this.chkAwards = !this.chkAwards;
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }

  saveCandidateDetails() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => {
        console.log(user);
      },
      error => {
        this.onError(error)
      });
  }

  onSubmit() {
    this._router.navigate([NavigationRoutes.APP_CANDIDATE_DASHBOARD]);
  }
}
