import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Industry} from '../model/industry';
import {Section} from '../model/candidate';
import {JobPosterModel} from '../model/jobPoster';
import {ProfessionalDataService} from '../professional-data/professional-data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JobLocation} from '../model/job-location';
import {MyGoogleAddress} from '../../../framework/registration/candidate/google-our-place/my-google-address';
import { FilterService} from '../filters/filter/filter.service';
import { Headings, Messages, Tooltip} from '../../../framework/shared/constants';
import { RecruiterDashboard} from '../model/recruiter-dashboard';
import {ValidationService} from '../../../framework/shared/customvalidations/validation.service';
import {ErrorService} from '../error.service';

@Component({
  moduleId: module.id,
  selector: 'cn-basic-job-information',
  templateUrl: 'basic-job-information.component.html',
  styleUrls: ['basic-job-information.component.css']
})

export class BasicJobInformationComponent implements OnInit, OnChanges {
  @Input() jobPosterModel: any;
  @Input() highlightedSection: Section;
  @Input() recruiter: RecruiterDashboard;

  @Output() onComplete = new EventEmitter();
  jobDiscriptionHeading:string = Headings.JOB_DISCRIPTION;
  hideCompanyNameHeading:string = Headings.HIDE_COMPANY_NAME;
  private savedjobPosterModel: JobPosterModel = new JobPosterModel();
  private jobPostForm: FormGroup;
  private educationList: any = [];
  private experienceRangeList: string[] = new Array(0);
  private fromYear: string = '';
  private toYear: string = '';
  private salaryRangeList: string[] = new Array(0);
  private fromValue: string = '';
  private toValue: string = '';
  private noticePeriodList: any = [];
  private showButton: boolean = true;
  private disableButton: boolean = true;
  private submitStatus: boolean;
  private storedIndustry: Industry;
  private storedLocation: JobLocation = new JobLocation();
  private isSalaryValid: boolean = true;
  private isExperienceValid: boolean = true;
  private isLocationInvalid : boolean= false;
  formatted_address: string = 'Aurangabad, Bihar, India';

  private locationValidationMessage = Messages.MSG_ERROR_VALIDATION_LOCATION_REQUIRED;
  private inValidLocationMessage = Messages.MSG_ERROR_VALIDATION_INVALID_LOCATION;
  private joiningPeriodValidationMessage = Messages.MSG_ERROR_VALIDATION_JOINING_PERIOD_REQUIRED;
  private maxSalaryValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_SALARY_REQUIRED;
  private minSalaryValidationMessage = Messages.MSG_ERROR_VALIDATION_MIN_SALARY_REQUIRED;
  private salaryValidationMessage = Messages.MSG_ERROR_VALIDATION_SALARY;
  private maxExperienceValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_EXPERIENCE_REQUIRED;
  private minExperienceValidationMessage = Messages.MSG_ERROR_VALIDATION_MIN_EXPERIENCE_REQUIRED;
  private experienceValidationMessage = Messages.MSG_ERROR_VALIDATION_EXPERIENCE;
  private educationalValidationMessage = Messages.MSG_ERROR_VALIDATION_EDUCATIONAL_QUALIFICATION_REQUIRED;
  private hiringDepartmentValidationMessage = Messages.MSG_ERROR_VALIDATION_HIRING_DEPARTMENT_REQUIRED;
  private hiringCompanyValidationMessage = Messages.MSG_ERROR_VALIDATION_HIRING_COMPANY_REQUIRED;
  private hiringManagerValidationMessage = Messages.MSG_ERROR_VALIDATION_HIRING_MANAGER_REQUIRED;
  private titleValidationMessage = Messages.MSG_ERROR_VALIDATION_JOB_TITLE_REQUIRED;
  private titleSpaceValidationMessage = Messages.MSG_ERROR_JOB_TITLE_INVALID_BLANK_SPACE;

  tooltipMessage: string = '<ul>' +
    '<li><p>1. '+Tooltip.BASIC_JOB_INFORMATION_TOOLTIP_1+'</p></li>' +
    '<li><p>2. '+Tooltip.BASIC_JOB_INFORMATION_TOOLTIP_2+'</p></li>' +
    '<li><p>3. '+Tooltip.BASIC_JOB_INFORMATION_TOOLTIP_3+'</p></li>' +
    '<li><p>4. '+Tooltip.BASIC_JOB_INFORMATION_TOOLTIP_4+'</p></li>' +
    '<li><p>5. '+Tooltip.BASIC_JOB_INFORMATION_TOOLTIP_5+'</p></li>' +
    '<li><p>6. '+Tooltip.BASIC_JOB_INFORMATION_TOOLTIP_6+'</p></li>' +
    '<li><p>7. '+Tooltip.BASIC_JOB_INFORMATION_TOOLTIP_7+'</p></li>' +
    '</ul>';

  constructor(private professionalDataService: ProfessionalDataService,private errorService:ErrorService,
              private formBuilder: FormBuilder, private _filterService: FilterService,) {

    this.jobPostForm = this.formBuilder.group({
      'jobTitle': ['', [Validators.required, ValidationService.noWhiteSpaceValidator]],
      'hiringManager': ['', Validators.required],
      'department': ['', Validators.required],
      'education': ['', Validators.required],
      'experienceMaxValue': ['', Validators.required],
      'experienceMinValue': ['', Validators.required],
      'salaryMaxValue': ['', Validators.required],
      'salaryMinValue': ['', Validators.required],
      'joiningPeriod': ['', Validators.required],
      'location': ['', Validators.required],
      'hideCompanyName': ['']
    });
  }

  ngOnInit() {
    this.professionalDataService.getEducationList()
      .subscribe(
        data => {
          this.educationList = data.educated;
        },error => this.errorService.onError(error));
    this._filterService.getListForFilter()
      .subscribe(
        (list: any) => {
          this.experienceRangeList = list.experienceRangeList;
          this.salaryRangeList = list.salaryRangeList;
        },error => this.errorService.onError(error));
    this.professionalDataService.getNoticePeriodList()
      .subscribe(
        data => {
          this.noticePeriodList = data.noticeperiod;
        },error => this.errorService.onError(error));
  }

  ngOnChanges(changes: any) {
    if (changes.jobPosterModel !== undefined && changes.jobPosterModel.currentValue !== undefined) {
      this.jobPosterModel = changes.jobPosterModel.currentValue;
      this.savedjobPosterModel = Object.assign({}, this.jobPosterModel);
      Object.keys(this.jobPosterModel).forEach(name => {
        if (this.jobPostForm.controls[name]) {
          let valueToSet: any = this.jobPosterModel[name];
          this.jobPostForm.controls[name].patchValue(valueToSet, {onlySelf: true});
        }
      });
      if (this.jobPosterModel && this.jobPosterModel.location) {
        if (this.jobPosterModel.location.city == undefined) {
          this.storedLocation.formatted_address = '';
        } else {
          this.storedLocation.formatted_address = this.jobPosterModel.location.city + ', ' + this.jobPosterModel.location.state + ', ' + this.jobPosterModel.location.country;
        }
      }
    }
  }

  keyDownCheck(e: any) {
    this.isLocationInvalid = false;
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.key == ',' || e.key == '13') {
      e.preventDefault();
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        this.storedLocation.formatted_address += e.key;
      }
    }
    else {
      return;
    }
  }

  getAddress(address: MyGoogleAddress) {
    this.isLocationInvalid=false;
    this.storedLocation.city = address.city;
    this.storedLocation.state = address.state;
    this.storedLocation.country = address.country;
    this.storedLocation.formatted_address=address.formatted_address;
  }

  selectIndustry(industry: Industry) {
    this.storedIndustry = industry;
  }

  onNext() {
    this.isExperienceValid = true;
    this.isSalaryValid = true;
    this.isLocationInvalid = false;
    this.jobPosterModel = this.jobPostForm.value;
    if (!this.jobPostForm.valid && this.storedIndustry == undefined) {
      this.submitStatus = true;
      return;
    }

    if (Number(this.jobPosterModel.experienceMaxValue) < Number(this.jobPosterModel.experienceMinValue)) {
      this.minExperienceValidationMessage = Messages.MSG_ERROR_VALIDATION_EXPERIENCE;
      this.isExperienceValid = false;
      return;
    }

    if (Number(this.jobPosterModel.salaryMaxValue) < Number(this.jobPosterModel.salaryMinValue)) {
      this.minSalaryValidationMessage = Messages.MSG_ERROR_VALIDATION_SALARY;
      this.isSalaryValid = false;
      return;
    }
    if(!(this.storedLocation.formatted_address.split(',').length > 2)) {
      this.isLocationInvalid=true;
      return;
    }


    if (this.storedIndustry) {
      this.jobPosterModel.industry = this.storedIndustry;
    }
    if(this.storedLocation.city) {
      this.jobPosterModel.location = this.storedLocation;
    }else {
      if(typeof this.jobPosterModel.location == 'string') {
        let address: string = this.jobPosterModel.location;
        this.jobPosterModel.location ={};
        this.jobPosterModel.location.city = address.split(',')[0];
        this.jobPosterModel.location.state = address.split(',')[1];
        this.jobPosterModel.location.country = address.split(',')[2];
      }
    }
    //if (this.jobPosterModel.industry) {
    this.savedjobPosterModel = Object.assign({}, this.jobPosterModel);
    if(this.showButton) {
      this.highlightedSection.name = 'Industry';
    } else {
      this.highlightedSection.name = 'None';
    }
    this.onComplete.emit(this.jobPosterModel);
    /* } else {
     this.jobPosterModel.industry = new Industry();
     }*/

    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onCancel() {
    this.jobPosterModel = Object.assign({}, this.savedjobPosterModel);
    this.highlightedSection.name = 'none';
    //this.highlightedSection.name='none';
  }

  selectExperiencesMaxModel(value: any) {
    this.toYear = value;

  }

  selectExperiencesMinModel(value: any) {
    this.fromYear = value;
  }

  selectSalaryMaxModel(value: any) {
    this.toValue = value;

  }

  selectSalaryMinModel(value: any) {
    this.fromValue = value;
  }

  onEdit() {
    this.highlightedSection.name = 'JobProfile';
    this.showButton = false;
    this.disableButton = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}


/*
 this.username = new FormControl(this.login.username, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);*/
