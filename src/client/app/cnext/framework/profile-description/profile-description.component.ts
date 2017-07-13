import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Industry} from "../model/industry";
import {Candidate, Section} from "../model/candidate";
import {AppSettings} from "../../../framework/shared/constants";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";
import {ProfessionalDataService} from "../professional-data/professional-data.service";

@Component({
  moduleId: module.id,
  selector: 'cn-profile-description',
  templateUrl: 'profile-description.component.html',
  styleUrls: ['profile-description.component.css'],
   host: {
         '(document:keydown)': 'keyboardInput($event)'
       }
})

export class ProfileDescriptionComponent implements OnInit {
  @Input() candidate: Candidate = new Candidate();
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  // private compactView:boolean=true;
  private savedIndustry: string = '';
  private changedIndustry: Industry = new Industry();
  private disableButton: boolean = true;
  private showButton: boolean = true;
  private experienceList: any = [];
  private savedJobTitle: string;
  private candidateDetails: CandidateDetail = new CandidateDetail();
  private showModalStyle: boolean = false;
  private educationList:any = [];
  private isValid: boolean = true;
  private islocationValid: boolean = true;
  private image_path: string = 'assets/framework/images/dashboard/profile.png';
  tooltipMessage: string =
    '<ul>' +
    '<li><p>1. Enter your current or latest job title. </p></li>' +
    '<li><p>2. A profile photo helps the recruiter to associate a face to the name.</p></li>' +
    '<li><p>3. Provide your current or latest company name.Freshers should enter "Fresher" as their company name.</p></li>' +
    '</ul>';

  constructor(private userProfileService: DashboardService, private professionalDataService: ProfessionalDataService) {
  }

  ngOnInit() {
    this.userProfileService.getUserProfile()
      .subscribe(
        userprofile => {
          this.candidateDetails = userprofile.data;
          if (this.candidateDetails.picture != undefined) {
            this.image_path = AppSettings.IP + this.candidateDetails.picture.substring(4).replace('"', '');
          }
        });

    this.professionalDataService.getExperienceList()
      .subscribe(
        data => {
          this.onExperienceListSuccess(data);
        });

    this.professionalDataService.getEducationList()
      .subscribe(
        data => {
          this.onEducationListSuccess(data);
        });
  }


  ngOnChanges(changes: any) {
    if (changes.candidate !== undefined && changes.candidate.currentValue !== undefined) {
      this.candidate = changes.candidate.currentValue;
    }
    if (this.candidate.jobTitle !== undefined && this.candidate.jobTitle !== ""
      && this.candidate.industry.name !== undefined && this.candidate.industry.name !== "") {
      this.savedIndustry = this.candidate.industry.name;
      this.savedJobTitle = this.candidate.jobTitle;
      this.changedIndustry = new Industry();
      this.changedIndustry.name = this.savedIndustry;
      console.log(this.savedIndustry);
    }
  }

  onPictureUpload(imagePath: string) {
    this.candidate.basicInformation.picture = imagePath;
    this.image_path = AppSettings.IP + imagePath.substring(4).replace('"', '');
  }

  onExperienceListSuccess(data: any) {
    for (let k of data.experience) {
      this.experienceList.push(k);
    }
  }

  onEducationListSuccess(data: any) {
    for (let k of data.educated) {
      this.educationList.push(k);
    }
  }
  onNext() {
    if((this.candidate.jobTitle == '' || this.candidate.jobTitle == undefined ) ||
      (this.candidate.professionalDetails.currentCompany == '' ||
      this.candidate.professionalDetails.currentCompany== undefined ) ||
      (this.candidate.professionalDetails.education == '' ||
      this.candidate.professionalDetails.education == undefined ) ||
      (this.candidate.professionalDetails.experience == '' ||
      this.candidate.professionalDetails.experience == undefined ) ){
      this.isValid = false;
      return;
    }
    console.log("from next");
    this.candidate.industry = this.changedIndustry;
    this.candidate.industry.roles = [];
    this.disableButton = false;
    this.savedIndustry = this.candidate.industry.name;
//    this.compactView = true;
    this.highlightedSection.name = 'Industry';
    this.highlightedSection.isDisable = false;

    this.onComplete.emit(this.candidate);
    let height = screen.height;
    var p = document.getElementById('work-area');
    var top = p.offsetTop;
    window.scrollBy(0, -(top - 50));
  }

  onSave() {
    if((this.candidate.jobTitle == '' || this.candidate.jobTitle == undefined ) ||
      (this.candidate.professionalDetails.currentCompany == '' ||
      this.candidate.professionalDetails.currentCompany== undefined ) ||
      (this.candidate.professionalDetails.education == '' ||
      this.candidate.professionalDetails.education == undefined ) ||
      (this.candidate.professionalDetails.experience == '' ||
      this.candidate.professionalDetails.experience == undefined ) ){
      this.isValid = false;
      return;
    }
    console.log("from save");
//    this.compactView = true;
    if (this.changedIndustry.name !== this.savedIndustry || this.candidate.jobTitle !== this.savedJobTitle) {
      if(this.changedIndustry.name !== this.savedIndustry) {
        this.showModalStyle = !this.showModalStyle;
      }
      else {
        this.savedJobTitle = this.candidate.jobTitle ;
        this.highlightedSection.name = 'none';
        this.highlightedSection.isDisable = false;
        this.onComplete.emit(this.candidate);
      }
    } else {
      this.onCancel();
    }
  }

  onJobTitleChange() {
    if (this.candidate && this.candidate.jobTitle === '') {
      this.disableButton = true;
    } else {
      if ((this.candidate.industry && this.candidate.industry.name !== '') || (this.changedIndustry && this.changedIndustry.name !== '')) {
        this.disableButton = false;
      }
      console.log("hello");
    }
  }

  getStyleModal() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  onCancel() {
    console.log("from cancel");
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.candidate.jobTitle = this.savedJobTitle;
    this.changedIndustry = new Industry();
    this.changedIndustry.name = this.savedIndustry;
  }

  keyboardInput(event: KeyboardEvent) {
    if (event.keyCode === 39) {
      this.onNext();
    }
    if (event.keyCode === 37) {
      this.onCancel();
    }
  }
}


