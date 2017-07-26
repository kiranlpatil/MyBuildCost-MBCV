import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Candidate, Section} from "../model/candidate";
import {AppSettings, Messages} from "../../../framework/shared/constants";
import {CandidateDetail} from "../../../framework/registration/candidate/candidate";
import {ProfessionalDataService} from "../professional-data/professional-data.service";
import {Location} from "../../../framework/registration/location";
import {MyGoogleAddress} from "../../../framework/registration/candidate/google-our-place/my-google-address";
import {ProfileDetailsService} from "../profile-detail-service";

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
  private jobTitleValidationMessage = Messages.MSG_ERROR_VALIDATION_JOBTITLE_REQUIRED;
  private currentCompanyValidationMessage = Messages.MSG_ERROR_VALIDATION_CURRENTCOMPANY_REQUIRED;
  private educationValidationMessage= Messages.MSG_ERROR_VALIDATION_EDUCATION_REQUIRED;
  private experienceValidationMessage= Messages.MSG_ERROR_VALIDATION_EXPERIENCE_REQUIRED;
  private locationErrorMessage = Messages.MSG_ERROR_VALIDATION_LOCATION_REQUIRED;
  private storedLocation: Location = new Location();


  tooltipMessage: string =
    '<ul>' +
    '<li><p>1. Enter your current or latest job title. </p></li>' +
    '<li><p>2. A profile photo helps the recruiter to associate a face to the name.</p></li>' +
    '<li><p>3. Provide your current or latest company name.Freshers should enter "Fresher" as their company name.</p></li>' +
    '</ul>';

  constructor(private professionalDataService: ProfessionalDataService,
              private profileDetailService: ProfileDetailsService) {
    this.profileDetailService.makeCall$.subscribe(
      data => {
        if (data && this.educationList.length === 0 && this.experienceList.length === 0) {
          this.getprofileDetails();
        }
      }
    );
  }

  ngOnInit() {

  }


  ngOnChanges(changes: any) {
    if (changes.candidate !== undefined && changes.candidate.currentValue !== undefined) {
      this.candidate = changes.candidate.currentValue;
    }
    if (this.candidate.jobTitle !== undefined && this.candidate.jobTitle !== "") {
      this.savedJobTitle = this.candidate.jobTitle;
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
    /*if (this.storedLocation.city == undefined) {
      this.storedLocation.city = 'pune';
      this.storedLocation.state = 'maharashtra';
      this.storedLocation.country = 'india';
    }*/
    if((this.candidate.jobTitle == '' || this.candidate.jobTitle == undefined ) ||
      (this.candidate.professionalDetails.currentCompany == '' ||
      this.candidate.professionalDetails.currentCompany== undefined ) ||
      (this.candidate.professionalDetails.education == '' ||
      this.candidate.professionalDetails.education == undefined ) ||
      (this.candidate.professionalDetails.experience == '' ||
      this.candidate.professionalDetails.experience == undefined )|| this.storedLocation.city == undefined){
      this.isValid = false;
      return;
    }
    this.candidate.location = this.storedLocation;
    this.disableButton = false;
    this.highlightedSection.name = 'Industry';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit(this.candidate);
  }

  onSave() {
    if (this.storedLocation.city === undefined) {
      this.storedLocation.city = 'pune';
      this.storedLocation.state = 'maharashtra';
      this.storedLocation.country = 'india';
    }
    if((this.candidate.jobTitle === '' || this.candidate.jobTitle === undefined ) ||
      (this.candidate.professionalDetails.currentCompany === '' ||
      this.candidate.professionalDetails.currentCompany=== undefined ) ||
      (this.candidate.professionalDetails.education === '' ||
      this.candidate.professionalDetails.education === undefined ) ||
      (this.candidate.professionalDetails.experience === '' ||
      this.candidate.professionalDetails.experience === undefined ) || this.storedLocation.city === undefined ){
      this.isValid = false;
      return;
    }
    this.candidate.location = this.storedLocation;
    this.savedJobTitle = this.candidate.jobTitle ;
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit(this.candidate);
  }

  onJobTitleChange() {
    if (this.candidate && this.candidate.jobTitle === '') {
      this.disableButton = true;
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
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.candidate.jobTitle = this.savedJobTitle;
  }

  keyboardInput(event: KeyboardEvent) {
    if (event.keyCode === 39) {
      this.onNext();
    }
    if (event.keyCode === 37) {
      this.onCancel();
    }
  }

  getAddress(address: MyGoogleAddress) {
    this.storedLocation.city = address.city;
    this.storedLocation.state = address.state;
    this.storedLocation.country = address.country;
  }

  getprofileDetails() {
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



}


