import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Candidate, Section} from "../model/candidate";
import {AppSettings, Messages, Tooltip} from "../../../framework/shared/constants";
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
   /*host: {
         '(document:keydown)': 'keyboardInput($event)'
       }*/
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
  private invalidLocationErrorMessage = Messages.MSG_ERROR_VALIDATION_INVALID_LOCATION;
  private storedLocation: Location = new Location();
  formatted_address : string = 'Aurangabad, Bihar, India';
  private isLocationInvalid : boolean=false;
  private isLocationEmpty: boolean = false;
  private containsWhiteSpace: boolean = false;
  private noWhiteSpaceAllowedMessage = Messages.MSG_ERROR_JOB_TITLE_INVALID_BLANK_SPACE;

  tooltipMessage: string =
    '<ul>' +
    '<li><p>1. '+ Tooltip.PROFILE_DESCRIPTION_TOOLTIP_1+'</p></li>' +
    '<li><p>2. '+ Tooltip.PROFILE_DESCRIPTION_TOOLTIP_2+'</p></li>' +
    '<li><p>3. '+ Tooltip.PROFILE_DESCRIPTION_TOOLTIP_3+'</p></li>' +
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
    if(this.candidate.location) {
      this.storedLocation=this.candidate.location;
      if (this.candidate.location.city == undefined) {
        this.storedLocation.formatted_address = '';
      } else {
        this.storedLocation.formatted_address = this.candidate.location.city + ', ' + this.candidate.location.state + ', ' + this.candidate.location.country;
      }

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
    this.containsWhiteSpace = false;
    this.isValid = true;
    this.isLocationInvalid = false;
    this.isLocationEmpty = false;
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
      this.candidate.professionalDetails.experience == undefined ) || this.storedLocation.city == undefined) {
      if (this.storedLocation.formatted_address == '') {
        this.isLocationEmpty = true;
      }
      this.isValid = false;
      return;
    }

    if ((this.candidate.jobTitle.trim() == '')) {
      this.containsWhiteSpace = true;
      return;
    }

    if(!(this.storedLocation.formatted_address.split(',').length > 2)){
      this.isValid = false;
      this.isLocationInvalid=true;
      return;
    }
    this.candidate.location = this.storedLocation;
    this.disableButton = false;
    this.highlightedSection.name = 'Industry';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit(this.candidate);
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  /*keyDownCheck(e: any) {
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.key == ',' || e.key == '13') {
      e.preventDefault();
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        this.storedLocation.formatted_address += e.key;
      }
    }
    else {
      return;
    }
  }*/

  onSave() {
    this.containsWhiteSpace = false;
    this.isValid = true;
    this.isLocationInvalid = false;
    this.isLocationEmpty = false;
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
      if (this.storedLocation.formatted_address == '') {
        this.isLocationEmpty = true;
      }
      this.isValid = false;
      return;
    }

    if (this.candidate.jobTitle.trim() == '') {
      this.containsWhiteSpace = true;
    }

    if(!(this.storedLocation.formatted_address.split(',').length > 2)){
      this.isValid = false;
      this.isLocationInvalid=true;
      return;
    }
    this.candidate.location = this.storedLocation;
    this.savedJobTitle = this.candidate.jobTitle ;
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onComplete.emit(this.candidate);
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
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
   this.isLocationInvalid=false;
   this.isValid=true;
    this.storedLocation.city = address.city;
    this.storedLocation.state = address.state;
    this.storedLocation.country = address.country;
    this.storedLocation.formatted_address=address.formatted_address;
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

  onEdit() {
    this.highlightedSection.name = 'Profile';
    this.disableButton = false;
    this.showButton = false;
    this.highlightedSection.isDisable = true;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}


