import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {JobRequirement} from "../model/job-requirement";
import {FormGroup} from "@angular/forms";
import {MessageService} from "../../../framework/shared/message.service";
import {IndustryListService} from "../industry-list/industry-list.service";
import {Message} from "../../../framework/shared/message";
import {MyJobRequirementService} from "../jobrequirement-service";


@Component({
  moduleId: module.id,
  selector: 'cn-job-requirement',
  templateUrl: 'job-requirement.component.html',
  styleUrls: ['job-requirement.component.css']
})

export class JobRequirementComponent {
  private jobRequirement = new JobRequirement();
  storedIndustry: string;
  userForm: FormGroup;
  industries = new Array();
  roles = new Array();
  storedRoles = new Array();
  industryModel = "";
  roleModel = "";
  isIndustrySelected: boolean = false;
  isRoleSelected: boolean = false;
  temproles: string[];
  maxRoles: number = 3;
  key: number;
  showModalStyle: boolean = false;
  disbleRole: boolean = false;
  
  private educationlist: string[];
  private experiencelist: string[];
  private salarylist: string[];
  private noticeperiodlist: string[];
  private educationModel: string;
  private experienceModel: string;
  private salaryModel: string;
  private noticeperiodModel: string;


  constructor(private industryService: IndustryListService,
              private http: Http,
              private messageService: MessageService,
              private myJobrequirementService :MyJobRequirementService) {
  }


  ngOnInit() {
    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));
  }


  selectIndustryModel(newVal: any) {
    this.storedIndustry = newVal;
    this.industryModel = newVal;
    this.jobRequirement.industryModel = this.industryModel;


    this.industryService.getRoles(newVal)
      .subscribe(
        rolelist => this.onRoleListSuccess(rolelist.data),
        error => this.onError(error));
    
  }

  onError(error:any){
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  onRoleListSuccess(data:any){
    //this.rolesData=data;
    for(let role of data){
      this.roles.push(role.name);
    }
  }
  selectRolesModel(newVal: any) {
    this.roleModel =newVal;
    this.storedRoles.push(newVal);
    this.jobRequirement.roleModel = this.roleModel;

    this.myJobrequirementService.change(this.jobRequirement);

    this.http.get("education")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.educationlist = data.educated;
        },
        err => console.error(err),
        () => console.log()
      );
  }

  selecteducationModel(newVal: any) {debugger
    this.educationModel = newVal;

    this.jobRequirement.educationModel = this.educationModel;

    this.http.get("experience")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.experiencelist = data.experience;
        },
        err => console.error(err),
        () => console.log()
      );

  }

  selectexperienceModel(newVal: any) {debugger
    this.experienceModel = newVal;

    this.jobRequirement.experienceModel = this.experienceModel;

    this.http.get("currentsalary")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.salarylist = data.salary;
        },
        err => console.error(err),
        () => console.log()
      );

  }

  selectsalaryModel(newVal: any) {
    this.salaryModel = newVal;
    this.jobRequirement.salaryModel = this.salaryModel;
    this.http.get("noticeperiod")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.noticeperiodlist = data.noticeperiod;
        },
        err => console.error(err),
        () => console.log()
      );
  }

  selectenoticeperiodModel(newVal: any) {
     this.noticeperiodModel = newVal;
    this.jobRequirement.noticeperiodModel = this.noticeperiodModel;
  }

  onRoleListSuccess(data: any) {
    for (let role of data) {
      this.roles.push(role.name);
    }
  }


  onIndustryListSuccess(data: any) {

    for (let industry of data) {
      this.industries.push(industry.name);
    }
  }

  onError(error: any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
  
}
