import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Industry} from "../model/industry";
import {Section} from "../model/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {ProfessionalDataService} from "../professional-data/professional-data.service";
import {BasicJobInformationService} from "./basic-job-information.service";
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import {JobLocation} from "../model/job-location";
import {MyGoogleAddress} from "../../../framework/registration/candidate/google-our-place/my-google-address";

@Component({
  moduleId: module.id,
  selector: 'cn-basic-job-information',
  templateUrl: 'basic-job-information.component.html',
  styleUrls: ['basic-job-information.component.css']
})

export class BasicJobInformationComponent {
  @Input() jobPosterModel:JobPosterModel = new JobPosterModel();
  @Input() highlightedSection:Section;
  @Output() onComplete = new EventEmitter();

  private jobPostForm : FormGroup;
  private educationlist = new Array();
  private experiencelist = new Array();
  private salarylist = new Array();
  private noticeperiodlist = new Array();
  private address : string;
  private storedIndustry:Industry;
  private storedLoaction:JobLocation=new JobLocation();
  tooltipMessage : string="<p class='info'>Enter all key words that describe your area of expertise or specialization.";

  constructor(private professionaldataservice:ProfessionalDataService,
              private formBuilder: FormBuilder) {

    this.jobPostForm=this.formBuilder.group({
      'jobTitle':['', Validators.required],
      'hiringManager':['', Validators.required],
      'department':['', Validators.required],
      'education':['', Validators.required],
      'experience':['', Validators.required],
      'salary':['', Validators.required],
      'joiningPeriod':['', Validators.required],
      'location': ['', Validators.required],
    });
  }

  ngOnInit() {
    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> {
          this.educationlist = data.educated;
        });
    this.professionaldataservice.getExperienceList()
      .subscribe(
        data => {
          this.experiencelist = data.experience;
        });
    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> {
          this.salarylist = data.salary;
        });
    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data => {
          this.noticeperiodlist = data.noticeperiod;
        });
  }

  getAddress(address :MyGoogleAddress){
    this.storedLoaction.city= address.city;
    this.storedLoaction.state= address.state;
    this.storedLoaction.country= address.country;
  }

  selectIndustry(industry:Industry) {
    this.storedIndustry = industry;
  }

  onNext() {
    this.jobPosterModel=this.jobPostForm.value;
    if(this.storedIndustry){
      this.jobPosterModel.industry=this.storedIndustry;
    }
    this.jobPosterModel.location=this.storedLoaction;
     if(this.jobPosterModel.industry){
       this.highlightedSection.name = "Work-Area";
       this.onComplete.emit(this.jobPosterModel);
    }else{
      this.jobPosterModel.industry = new Industry();
    }
  }
}


/*
this.username = new FormControl(this.login.username, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);*/
