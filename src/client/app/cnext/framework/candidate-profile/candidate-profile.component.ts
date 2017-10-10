import {Component, DoCheck, HostListener, KeyValueDiffers, OnDestroy, OnInit} from "@angular/core";
import {Button, ImagePath, Label, LocalStorage, Messages, NavigationRoutes, Tooltip} from "../../../shared/constants";
import {Router} from "@angular/router";
import {ComplexityService} from "../complexity.service";
import {Candidate, Section} from "../../../user/models/candidate";
import {CandidateProfileService} from "./candidate-profile.service";
import {Role} from "../model/role";
import {Industry} from "../../../user/models/industry";
import {Message} from "../../../shared/models/message";
import {MessageService} from "../../../shared/services/message.service";
import {ErrorService} from "../../../shared/services/error.service";
import {LocalStorageService} from "../../../shared/services/localstorage.service";

@Component({
  moduleId: module.id,
  selector: 'cn-profile-creator',
  templateUrl: 'candidate-profile.component.html',
  styleUrls: ['candidate-profile.component.css']
})

export class CandidateProfileComponent implements OnInit, DoCheck, OnDestroy {
  whichStepsVisible: boolean[] = new Array(7);
  jobSearchForFirstTimeMessage:string = Messages.MSG_READY_FOR_JOB_SEARCH_FOR_FIRST_TIME;
  jobSearchMessage:string = Messages.MSG_READY_FOR_JOB_SEARCH;
  rolesForMain: Role[] = new Array(0);
  rolesForCapability: Role[] = new Array(0);
  rolesForComplexity: Role[] = new Array(0);
  private roleList: string[] = [];
  private primaryCapability: string[] = [];
  private proficiencies: string[] = [];
  isComplexityPresent: boolean = false;
  private isShowNext: boolean = true;
  private isShowPrev: boolean = false;
  showCapability: boolean = false;
  showComplexity: boolean = false;
  showProficiency: boolean = false;
  private showIndustryExperience: boolean = false;
  showProfessionalData: boolean = false;
  showEmploymentHistory: boolean = false;
  private showAcademicsDetails: boolean = false;
  showCertificationDetails: boolean = false;
  showAwards: boolean = false;
  showAboutMySelf: boolean = false;
  isRolesShow: boolean = true;
  isIndustryShow: boolean = true;
  candidate: Candidate = new Candidate();
  candidateForRole: Role[];
  candidateForCapability: Role[];
  private candidateForComplexity: Role[];
  // private showTooltip: boolean = false;
  private setTimeoutId: any;
  private showModalStyle: boolean = false;
  private goto: boolean = false;
  private isPresentCapability: boolean = false;
  private isComplexityFilled: boolean = true;
  private isPresentDefaultcomplexity: boolean = false;
  highlightedSection: Section = new Section();
  private visiblitySetToYesMessage : string = Tooltip.PROFILE_INFO_VISIBILIT_SET_TO_YES;
  private visiblitySetToNoMessage : string = Tooltip.PROFILE_INFO_VISIBILIT_SET_TO_NO;
  differ: any;
  public navIsFixed: boolean = false;

  constructor(private _router: Router,
              private complexityService: ComplexityService,
              private differs: KeyValueDiffers,
              private messageService: MessageService,
              private errorService: ErrorService,
              private profileCreatorService: CandidateProfileService) {

    complexityService.showTest$.subscribe(
      data => {
        this.whichStepsVisible[3] = data;
        this.showComplexity = data;
      }
    );
    this.getCandidateProfile();
    this.differ = differs.find({}).create(null);

  }

  @HostListener('window:scroll', []) onWindowScroll() {
    let bodyOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (bodyOffset > 50) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && bodyOffset < 10) {
      this.navIsFixed = false;
    }
  }

  ngOnInit() {
    this.whichStepsVisible[0] = true;
  }

  ngDoCheck() {
    let changes: any = this.differ.diff(this.highlightedSection);

    if (changes) {
      if (this.highlightedSection.name === 'None' || this.highlightedSection.name === 'none') {
        document.body.className = document.body.className.replace('body-wrapper', '');
      } else {
        var bodyclass = document.createAttribute('class');
        bodyclass.value = 'body-wrapper';
        document.getElementsByTagName('body')[0].setAttributeNode(bodyclass);
      }
      if (this.highlightedSection.name === 'Work-Area') {
        this.getRoles();
        return;
      } else if (this.highlightedSection.name === 'Capabilities') {
        this.getCapability();
        return;
      } else if (this.highlightedSection.name === 'Complexities') {
        this.getComplexity();
        return;
      } else if (this.highlightedSection.name === 'Proficiencies') {
        if (this.candidate.proficiencies === undefined || this.candidate.proficiencies === null || this.candidate.proficiencies.length === 0) {
          this.candidate.proficiencies = [];
        }
        return;
      }
    }
  }

  ngOnDestroy() {
    document.body.className = document.body.className.replace('body-wrapper', '');
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

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
  onWorkAreaComplete(roles: Role[]) {
    this.candidate.industry.roles = roles;
    this.saveCandidateDetails();
    this.candidateForCapability = this.candidate.industry.roles;
    this.candidateForComplexity = this.candidate.industry.roles;
    this.rolesForCapability = new Array(0);
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
    this.whichStepsVisible[2] = true;
  }

  onComplextyAnswered(capability_matrix: any) {
    this.candidate.capability_matrix = capability_matrix;
    this.saveCandidateDetails();
  }

  onComplexityComplete(roles: Role[]) {
    var date = new Date();
    date.setDate(date.getDate() + 90);
    this.candidate.lockedOn = date;
    this.highlightedSection.date = date;
    this.saveCandidateDetails();
    this.showProficiency = true;
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
    this.saveCandidateDetails();
  }

  onExperienceIndustryComplete() {
    this.showProfessionalData = true;
  }

  onProfessionalDataComplete() {
    this.candidate.isCompleted = true;
    this.highlightedSection.iscompleted = true;
    this.whichStepsVisible[5] = true;
    this.showAboutMySelf = true;
    this.showAcademicsDetails = true;
    this.showAwards = true;
    this.showProficiency = true;
    this.showCertificationDetails = true;
    this.showEmploymentHistory = true;
  }

  onEmploymentHistoryComplete() {
    this.showAcademicsDetails = true;
    this.checkdataFilled();
  }

  onAcademicDetailsComplete() {
    this.showCertificationDetails = true;
    this.checkdataFilled();
  }

  onCertificationsComplete() {
    this.showAwards = true;
  }

  onAwardsComplete() {
  }

  checkdataFilled() {
    if (this.candidate.employmentHistory && this.candidate.employmentHistory.length > 0 && this.candidate.academics &&
        this.candidate.academics.length > 0 && this.candidate.aboutMyself && this.candidate.aboutMyself !== '') {
      this.whichStepsVisible[6]=true;
    }else {
      this.whichStepsVisible[6]=false;
    }
    }
  onMoreAboutMySelfComplete(data: string) {
    this.showEmploymentHistory = true;
    this.checkdataFilled();
  }

  getRoles() {
    this.profileCreatorService.getRoles(this.candidate.industry.code)
      .subscribe(
        rolelist => this.rolesForMain = rolelist.data,
        error => this.errorService.onError(error));
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
          },error => this.errorService.onError(error));
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
          },error => this.errorService.onError(error));
    }
  }

  getCandidateProfile() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.OnCandidateDataSuccess(candidateData);
        },
        error => this.errorService.onError(error));
  }

  getCandidateForCapability() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => this.candidateForCapability = candidateData.data[0].industry.roles,
        error => this.errorService.onError(error));
  }

  getCandidateForComplexity() {
    this.profileCreatorService.getCandidateDetails()
      .subscribe(
        candidateData => {
          this.candidate.capability_matrix = Object.assign({}, candidateData.data[0].capability_matrix);
          this.showComplexity = true;
        },
        error => this.errorService.onError(error));
  }

  OnCandidateDataSuccess(candidateData: any) {
    this.candidate = candidateData.data[0];
    this.candidate.basicInformation = candidateData.metadata;
    this.candidateForRole = candidateData.data[0].industry.roles;
    this.candidateForCapability = candidateData.data[0].industry.roles;
    this.candidateForComplexity = candidateData.data[0].industry.roles;
    if (this.candidate.jobTitle === undefined) {
      //TODO: Shrikant write logic which should be the active section
      this.highlightedSection.name = 'Profile';
    }
    if (this.candidate.isCompleted !== undefined) {
      this.highlightedSection.iscompleted = this.candidate.isCompleted;
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
              if (this.candidate.capability_matrix) {
                var capbilityMatrix: any = Object.keys(this.candidate.capability_matrix);
                for (let index of capbilityMatrix) {
                  if (this.candidate.capability_matrix[index] === -1) {
                    this.isComplexityFilled = false;
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
                      this.candidate.isCompleted = true;
                      this.highlightedSection.iscompleted = true;
                      this.checkdataFilled();
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
  }

  isContains(element: any) {
    return this.candidate.capability_matrix[element] === -1;
  }

  dateDifferenceInDays(currentDate: Date, storedDate: Date) {
    return Math.floor(( Date.UTC(storedDate.getFullYear(),
        storedDate.getMonth(),
        storedDate.getDate()) - Date.UTC(currentDate.getFullYear(),
        currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  showOrHide(type: string, event: any) {
    if (event.target.checked) {
      this.candidate.isVisible = true;
    } else {
      this.candidate.isVisible = false;
    }
    this.saveCandidateDetails();
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }

  saveCandidateDetails() {
    this.profileCreatorService.addProfileDetail(this.candidate).subscribe(
      user => console.log(user),
      error => this.errorService.onError(error));
  }

  onSubmit() {
    this.candidate.isSubmitted = true;
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE_SUBMITTED, true);
    this.saveCandidateDetails();
    this.showModalStyle = !this.showModalStyle;
    if (this.setTimeoutId !== undefined) {
      clearTimeout(this.setTimeoutId);
    }
    this.goToDashboard();
  }


  showHideModal() {
    LocalStorageService.setLocalValue(LocalStorage.IS_CANDIDATE_FILLED, true);
    this.onSubmit();
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

  getImagePath() {
    return ImagePath;
  }

  getMessages() {
    return Messages;
  }

  getLabel() {
    return Label;
  }

  getButton() {
    return Button;
  }
}
