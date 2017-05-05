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
  private primaryCapability:string[] = new Array()
  private proficiencies:string[] = new Array()
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

  onCapabilityComplete(roles:Role[]){
    this.candidate.industry.roles = roles;
    this.candidateForCapability=this.candidate.industry.roles;
    this.saveCandidateDetails();
    this.getComplexity();
    this.showComplexity = true;
    this.whichStepsVisible[2] = true;
  }

  onComplexitytyComplete(roles:Role[]){

    this.candidate.industry.roles = roles;
    this.candidateForComplexity=this.candidate.industry.roles;
    this.saveCandidateDetails();
    this.showProfeciency = true;
    this.getProficiency();
  }

  onProficiencyComplete(proficiency:string[]) {
    this.showIndustryExperience=true;
    this.candidate.proficiencies = proficiency;
    this.saveCandidateDetails();
    this.whichStepsVisible[4] = true;
  }

  onExperienceIndustryComplete(experiencedindustry:string[]) {
    this.showProfessionalData=true;
    this.candidate.intrestedIndustries = experiencedindustry;
    this.saveCandidateDetails();
  }

  onProfessionalDataComplete(){
    this.showemploymentHistory=true
  }
  
  onEmploymentHistoryComplete(){
    this.showAcademicsDetails=true;
  }
  onAcademicDetailsComplete(){
    this.showCertificationDetails=true;
  }

  onCertificationsComplete(){
    this.showAwards=true;
  }
  onAwardsComplete(){
    this.showAboutMySelf=true;
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
    this.primaryCapability=new Array(0);
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
        candidateData => {this.OnCandidateDataSuccess(candidateData);
        console.log(candidateData)},
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
          if (this.candidateForComplexity[0].capabilities[0].complexities.length > 0) {
            this.isComplexityPresent = true;
          }
        },
        error => this.onError(error));
  }

  getProficiency() {
    this.profileCreatorService.getProficiency(this.candidate.industry.name)
      .subscribe(
        data => this.proficiencies = data.data,
        error => this.onError(error));
  }

  OnCandidateDataSuccess(candidateData:any) {
    this.candidate = candidateData.data[0];
    this.candidateForRole = candidateData.data[0].industry.roles;
    console.log(this.candidate);
    if (this.candidate.jobTitle === undefined || this.candidate.industry.name !== undefined) {
      //TODO: Shrikant write logic which should be the active section
      console.log(this.candidate);
      this.highlightedSection.name = "Profile";
    }

    if (this.candidate.jobTitle !== undefined && this.candidate.jobTitle !== "") {
      this.isTitleFilled = false;
      this.highlightedSection.name = "None";
      this.disableTitle = true;
    }
    if (this.candidate.industry.name !== undefined) {
      this.isRolesShow = false;
      this.getRoles();
    }

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
          this.showProfeciency = true;
          if (this.candidate.proficiencies.length > 0) {
            this.whichStepsVisible[4] = true;
          }
        }
      }
    }
    if(this.candidate.intrestedIndustries.length>0){
      this.showIndustryExperience=true;
    }

    if (this.candidate.professionalDetails !== undefined && this.candidate.professionalDetails.education !== '') {
      this.showProfessionalData=true;
      this.whichStepsVisible[5] = true;
    }

    if (this.candidate.academics.length > 0 && this.candidate.academics[0].schoolName !== '') {
      this.showAcademicsDetails=true;
    }

    if (this.candidate.certifications.length > 0 && this.candidate.certifications[0].name !== '') {
      this.showCertificationDetails=true;
      this.isHiddenCertificate = true;
    }
    if (this.candidate.aboutMyself !== undefined && this.candidate.aboutMyself !== '') {
      this.whichStepsVisible[6] = true;
      this.showAboutMySelf=true;
      this.isHiddenAboutMyself = true;
    }
    if (this.candidate.employmentHistory.length > 0 && this.candidate.employmentHistory[0].companyName !== '') {
      this.showemploymentHistory=true;
      this.isHiddenEmployeehistory = true;
    }
    if (this.candidate.awards.length > 0 && this.candidate.awards[0].name !== '') {
      this.showAwards=true;
      this.isHiddenAwrard = true;
    }
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  showorhide(event:string) {
    this.valueOFshowOrHide = event;
    if (event == "true") {
      this.candidate.isVisible = true;
    } else {
      this.candidate.isVisible = false;
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
    this._router.navigate([NavigationRoutes.APP_PROFILESUMMURY]);
  }
}
