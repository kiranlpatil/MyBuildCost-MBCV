import {Component, OnInit, Output, EventEmitter,Input} from "@angular/core";
import {JobRequirement} from "../model/job-requirement";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";
import {ProfessionalDataService} from "../professional-data/professional-data.service";
import {JobPosterModel} from "../model/jobPoster";


@Component({
  moduleId: module.id,
  selector: 'cn-job-requirement',
  templateUrl: 'job-requirement.component.html',
  styleUrls: ['job-requirement.component.css']
})

export class JobRequirementComponent implements OnInit {
  @Input() jobPosterModel:JobPosterModel = new JobPosterModel();
  @Output() selectJobRequirement = new EventEmitter()
  private jobRequirement = new JobRequirement();

  private educationlist = new Array();
  private experiencelist = new Array();
  private salarylist = new Array();
  private noticeperiodlist = new Array();



  constructor(private professionaldataservice:ProfessionalDataService,
              private messageService:MessageService) {
  }


  ngOnInit() {
    this.professionaldataservice.getEducationList()
      .subscribe(
        data=> {
          this.onEducationListSuccess(data);
        });
    this.professionaldataservice.getExperienceList()
      .subscribe(
        data => {
          this.onExperienceListSuccess(data);
        });
    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> {
          this.onCurrentSalaryListSuccess(data);
        });
    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data => {
          this.onGetNoticePeriodListSuccess(data);
        });
  }


  onEducationListSuccess(data:any) {
    for (let k of data.educated) {
      this.educationlist.push(k);
    }
  }


  onExperienceListSuccess(data:any) {
    for (let k of data.experience) {
      this.experiencelist.push(k);
    }
  }

  selectexperienceModel(experience:any) {debugger
    this.jobRequirement.experience = this.jobPosterModel.experience;
    this.selectJobRequirement.emit(this.jobRequirement);
  }
  selecteducationModel(education:any) {
    this.jobRequirement.education = this.jobPosterModel.education;
    this.selectJobRequirement.emit(this.jobRequirement);
  }


  onCurrentSalaryListSuccess(data:any) {
    for (let k of data.salary) {
      this.salarylist.push(k);
    }
  }

  selectsalaryModel(salary:any) {
    this.jobRequirement.salary = this.jobPosterModel.salary;
    this.selectJobRequirement.emit(this.jobRequirement);

  }

  onGetNoticePeriodListSuccess(data:any) {
    for (let k of data.noticeperiod) {
      this.noticeperiodlist.push(k);
    }
  }

  selectenoticeperiodModel(noticeperiod:any) {
    this.jobRequirement.noticeperiod = this.jobPosterModel.joiningPeriod;
    this.selectJobRequirement.emit(this.jobRequirement);
  }


  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
}
