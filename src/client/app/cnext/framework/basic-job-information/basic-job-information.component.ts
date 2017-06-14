import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Industry} from "../model/industry";
import {Section} from "../model/candidate";
import {JobPosterModel} from "../model/jobPoster";
import {ProfessionalDataService} from "../professional-data/professional-data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JobLocation} from "../model/job-location";
import {MyGoogleAddress} from "../../../framework/registration/candidate/google-our-place/my-google-address";

@Component({
  moduleId: module.id,
  selector: 'cn-basic-job-information',
  templateUrl: 'basic-job-information.component.html',
  styleUrls: ['basic-job-information.component.css']
})

export class BasicJobInformationComponent {
  @Input() jobPosterModel: JobPosterModel = new JobPosterModel();
  @Input() highlightedSection: Section;
  @Output() onComplete = new EventEmitter();

  private jobPostForm: FormGroup;
  private educationList = new Array();
  private experienceList = new Array();
  private salaryList = new Array();
  private noticePeriodList = new Array();
  private address: string;
  private storedIndustry: Industry;
  private storedLoaction: JobLocation = new JobLocation();
  tooltipMessage: string = "<ul>" +
    "<li><h5>Job description</h5>" +
    "<p class='info'>Enter all key words that describe the required area of expertise or specialization.</p>" +
    "</li>" +
    "</ul>";

  constructor(private professionaldataService: ProfessionalDataService,
              private formBuilder: FormBuilder) {

    this.jobPostForm = this.formBuilder.group({
      'jobTitle': ['', Validators.required],
      'hiringManager': ['', Validators.required],
      'department': ['', Validators.required],
      'education': ['', Validators.required],
      'experience': ['', Validators.required],
      'salary': ['', Validators.required],
      'joiningPeriod': ['', Validators.required],
      'location': ['', Validators.required],
    });
  }

  ngOnInit() {
    this.professionaldataService.getEducationList()
      .subscribe(
        data => {
          this.educationList = data.educated;
        });
    this.professionaldataService.getExperienceList()
      .subscribe(
        data => {
          this.experienceList = data.experience;
        });
    this.professionaldataService.getCurrentSalaryList()
      .subscribe(
        data => {
          this.salaryList = data.salary;
        });
    this.professionaldataService.getNoticePeriodList()
      .subscribe(
        data => {
          this.noticePeriodList = data.noticeperiod;
        });
  }

  getAddress(address: MyGoogleAddress) {
    this.storedLoaction.city = address.city;
    this.storedLoaction.state = address.state;
    this.storedLoaction.country = address.country;
  }

  selectIndustry(industry: Industry) {
    this.storedIndustry = industry;
  }

  onNext() {
    this.jobPosterModel = this.jobPostForm.value;
    if (this.storedIndustry) {
      this.jobPosterModel.industry = this.storedIndustry;
    }
    this.jobPosterModel.location = this.storedLoaction;
    if (this.jobPosterModel.industry) {
      this.highlightedSection.name = "Work-Area";
      this.onComplete.emit(this.jobPosterModel);
    } else {
      this.jobPosterModel.industry = new Industry();
    }
  }
}


/*
 this.username = new FormControl(this.login.username, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]);*/
