import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from "@angular/core";
import {Industry} from "../model/industry";
import {Section} from "../model/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {ProfessionalDataService} from "../professional-data/professional-data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JobLocation} from "../model/job-location";
import {MyGoogleAddress} from "../../../framework/registration/candidate/google-our-place/my-google-address";
import {FilterService} from "../filters/filter/filter.service";
import {Messages} from "../../../framework/shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-basic-job-information',
  templateUrl: 'basic-job-information.component.html',
  styleUrls: ['basic-job-information.component.css']
})

export class BasicJobInformationComponent implements OnInit, OnChanges {
  @Input() jobPosterModel: any;
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
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
  private address: string;
  private showButton: boolean = true;
  private submitStatus: boolean;
  private storedIndustry: Industry;
  private storedLocation: JobLocation = new JobLocation();
  private isSalaryValid: boolean = true;
  private isExperienceValid: boolean = true;

  private locationValidationMessage = Messages.MSG_ERROR_VALIDATION_LOCATION_REQUIRED;
  private joiningPeriodValidationMessage = Messages.MSG_ERROR_VALIDATION_JOINING_PERIOD_REQUIRED;
  private maxSalaryValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_SALARY_REQUIRED;
  private minSalaryValidationMessage = Messages.MSG_ERROR_VALIDATION_MIN_SALARY_REQUIRED;
  private salaryValidationMessage = Messages.MSG_ERROR_VALIDATION_SALARY;
  private maxExperienceValidationMessage = Messages.MSG_ERROR_VALIDATION_MAX_EXPERIENCE_REQUIRED;
  private minExperienceValidationMessage = Messages.MSG_ERROR_VALIDATION_MIN_EXPERIENCE_REQUIRED;
  private experienceValidationMessage = Messages.MSG_ERROR_VALIDATION_EXPERIENCE;
  private educationalValidationMessage = Messages.MSG_ERROR_VALIDATION_EDUCATIONAL_QUALIFICATION_REQUIRED;
  private hiringDepartmentValidationMessage = Messages.MSG_ERROR_VALIDATION_HIRING_DEPARTMENT_REQUIRED;
  private hiringManagerValidationMessage = Messages.MSG_ERROR_VALIDATION_HIRING_MANAGER_REQUIRED;
  private titleValidationMessage = Messages.MSG_ERROR_VALIDATION_JOB_TITLE_REQUIRED;

  tooltipMessage: string =  '<ul>' +
    '<li><p>1. This job name would be displayed in the posting.</p></li>' +
    '<li><p>2. Name of the manager who has given the requirement for this job.</p></li>' +
    '<li><p>3. Name of the department for which the candidate is being hired.</p></li>' +
    '<li><p>4. Choose from dropdown.</p></li>' +
    '<li><p>5. The target salary that you wish to offer for the job. </p></li>' +
    '<li><p>6. How much lead time are you willing to provide to the candidate for joining.</p></li>' +
    '<li><p>7. Where the candidate will be required to work.</p></li>' +
    '<li><p>8. The industry for which you are hiring.</p></li>' +
    '</ul>';

  constructor(private professionalDataService: ProfessionalDataService,
              private formBuilder: FormBuilder, private _filterService: FilterService,) {

    this.jobPostForm = this.formBuilder.group({
      'jobTitle': ['', Validators.required],
      'hiringManager': ['', Validators.required],
      'department': ['', Validators.required],
      'education': ['', Validators.required],
      'experienceMaxValue': ['', Validators.required],
      'experienceMinValue': ['', Validators.required],
      'salaryMaxValue': ['', Validators.required],
      'salaryMinValue': ['', Validators.required],
      'joiningPeriod': ['', Validators.required],
      'location': ['', Validators.required],
    });
  }
  ngOnInit() {
    this.professionalDataService.getEducationList()
      .subscribe(
        data => {
          this.educationList = data.educated;
        });
    this._filterService.getListForFilter()
      .subscribe(
        (list: any) => {
          this.experienceRangeList = list.experienceRangeList;
          this.salaryRangeList = list.salaryRangeList;
        });
    this.professionalDataService.getNoticePeriodList()
      .subscribe(
        data => {
          this.noticePeriodList = data.noticeperiod;
        });
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
    }
  }

  getAddress(address: MyGoogleAddress) {
    this.storedLocation.city = address.city;
    this.storedLocation.state = address.state;
    this.storedLocation.country = address.country;
  }

  selectIndustry(industry: Industry) {
    this.storedIndustry = industry;
  }

  onNext() {
    this.isExperienceValid = true;
    this.isSalaryValid = true;
    this.jobPosterModel = this.jobPostForm.value;
    if (!this.jobPostForm.valid && this.storedIndustry == undefined) {
      this.submitStatus = true;
      return;
    }

    if(Number(this.jobPosterModel.experienceMaxValue) <= Number(this.jobPosterModel.experienceMinValue)){
      this.minExperienceValidationMessage = Messages.MSG_ERROR_VALIDATION_EXPERIENCE;
      this.isExperienceValid = false;
      return;
    }

    if(Number(this.jobPosterModel.salaryMaxValue) <= Number(this.jobPosterModel.salaryMinValue)){
      this.minSalaryValidationMessage = Messages.MSG_ERROR_VALIDATION_SALARY;
      this.isSalaryValid = false;
      return;
    }


    if (this.storedIndustry) {
      this.jobPosterModel.industry = this.storedIndustry;
    }
    this.jobPosterModel.location = this.storedLocation;
    //if (this.jobPosterModel.industry) {
    this.savedjobPosterModel = Object.assign({}, this.jobPosterModel);
    this.highlightedSection.name = 'Industry';
    this.onComplete.emit(this.jobPosterModel);
    /* } else {
     this.jobPosterModel.industry = new Industry();
     }*/
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
}


/*
 this.username = new FormControl(this.login.username, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);*/
