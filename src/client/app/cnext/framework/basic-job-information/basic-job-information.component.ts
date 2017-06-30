import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { Industry } from '../model/industry';
import { Section } from '../model/candidate';
import { JobPosterModel } from '../model/jobPoster';
import { ProfessionalDataService } from '../professional-data/professional-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobLocation } from '../model/job-location';
import { MyGoogleAddress } from '../../../framework/registration/candidate/google-our-place/my-google-address';
import {FilterService} from "../filters/filter/filter.service";

@Component({
  moduleId: module.id,
  selector: 'cn-basic-job-information',
  templateUrl: 'basic-job-information.component.html',
  styleUrls: ['basic-job-information.component.css']
})

export class BasicJobInformationComponent implements OnInit,OnChanges {
  @Input() jobPosterModel: JobPosterModel = new JobPosterModel();
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();
  private savedjobPosterModel: JobPosterModel = new JobPosterModel();
  private jobPostForm: FormGroup;
  private educationList = new Array();
  private experienceRangeList: string[] = new Array(0);
  private fromYear:string = '';
  private toYear:string = '';
  private salaryRangeList: string[] = new Array(0);
  private fromValue:string = '';
  private toValue:string = '';
  private noticePeriodList = new Array();
  private address: string;
  private showButton: boolean = true;
  private storedIndustry: Industry;
  private storedLocation: JobLocation = new JobLocation();
  tooltipMessage: string =  '<ul>' +
      '<li><h5> Job description </h5></li>' +
      '<li><h5> Job Title </h5><p>This job name would be displayed in the posting.</p></li>' +
      '<li><h5> Hiring Manager </h5><p>Name of the manager who has given the requirement for this job.</p></li>' +
      '<li><h5> Hiring Department </h5><p>Name of the department for which the candidate is being hired.</p></li>' +
      '<li><h5> Educational Qualification, Experience Band </h5><p>Choose from dropdown.</p></li>' +
      '<li><h5> Salary band </h5><p>The target salary that you wish to offer for the job. </p></li>' +
      '<li><h5> Joining Period </h5><p>How much lead time are you willing to provide to the candidate for joining.</p></li>' +
      '<li><h5> Job Location </h5><p>Where the candidate will be required to work.</p></li>' +
      '<li><h5> Industry </h5><p>The industry for which you are hiring.</p></li>' +
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

  ngOnChanges(changes:any) {
    if(changes.jobPosterModel !== undefined && changes.jobPosterModel.currentValue !== undefined){
      this.jobPosterModel=changes.jobPosterModel.currentValue;
      this.savedjobPosterModel=Object.assign({},this.jobPosterModel);
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
    this.jobPosterModel = this.jobPostForm.value;
    if (this.storedIndustry) {
      this.jobPosterModel.industry = this.storedIndustry;
    }
    this.jobPosterModel.location = this.storedLocation;
    if (this.jobPosterModel.industry) {
      this.savedjobPosterModel=Object.assign({},this.jobPosterModel);
      this.onComplete.emit(this.jobPosterModel);
    } else {
      this.jobPosterModel.industry = new Industry();
    }
  }
  onCancel() {
    this.jobPosterModel=Object.assign({},this.savedjobPosterModel);
    this.highlightedSection.name='none';
    //this.highlightedSection.name='none';
  }

  selectExperiencesMaxModel(value: any) {
    this.toYear=value;

  }

  selectExperiencesMinModel(value: any) {
    this.fromYear=value;
  }

  selectSalaryMaxModel(value: any) {
    this.toValue=value;

  }

  selectSalaryMinModel(value: any) {
    this.fromValue=value;
  }
}


/*
 this.username = new FormControl(this.login.username, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);*/
