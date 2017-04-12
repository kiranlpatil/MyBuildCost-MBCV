import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {JobRequirement} from "../model/job-requirement";
import {MessageService} from "../../../framework/shared/message.service";
import {Message} from "../../../framework/shared/message";
import {ProfessionalDataService} from "../professional-data/professional-data.service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-requirement',
  templateUrl: 'job-requirement.component.html',
  styleUrls: ['job-requirement.component.css']
})

export class JobRequirementComponent implements OnInit {
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
        },
        error => {
          this.onError(error);
        });
    this.professionaldataservice.getExperienceList()
      .subscribe(
        data => {
          this.onExperienceListSuccess(data);
        },
        error => {
          this.onError(error);
        });
    this.professionaldataservice.getCurrentSalaryList()
      .subscribe(
        data=> {
          this.onCurrentSalaryListSuccess(data);
        },
        error => {
          this.onError(error);
        });
    this.professionaldataservice.getNoticePeriodList()
      .subscribe(
        data => {
          this.onGetNoticePeriodListSuccess(data);
        },
        error => {
          this.onError(error);
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

  selectexperienceModel(experience:any) {
    this.jobRequirement.experience = experience;
    this.selectJobRequirement.emit(this.jobRequirement);
  }
  selecteducationModel(education:any) {
    this.jobRequirement.education = education;
    this.selectJobRequirement.emit(this.jobRequirement);
  }


  onCurrentSalaryListSuccess(data:any) {
    for (let k of data.salary) {
      this.salarylist.push(k);
    }
  }

  selectsalaryModel(salary:any) {
    this.jobRequirement.salary = salary;
    this.selectJobRequirement.emit(this.jobRequirement);

  }

  onGetNoticePeriodListSuccess(data:any) {
    for (let k of data.noticeperiod) {
      this.noticeperiodlist.push(k);
    }
  }

  selectenoticeperiodModel(noticeperiod:any) {
    this.jobRequirement.noticeperiod = noticeperiod;
    this.selectJobRequirement.emit(this.jobRequirement);
  }


  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
}
