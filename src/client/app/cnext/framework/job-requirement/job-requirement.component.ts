
import {Component} from '@angular/core';
import {LocalStorageService} from "../../../framework/shared/localstorage.service";
import {LocalStorage, NavigationRoutes} from "../../../framework/shared/constants";
import {Router} from "@angular/router";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {Http} from "@angular/http";
import {FormGroup} from "@angular/forms";
import {MessageService} from "../../../framework/shared/message.service";
import {IndustryService} from "../industryList/industryList.service";
import {Message} from "../../../framework/shared/message";


@Component({
  moduleId: module.id,
  selector: 'cn-job-requirement',
  templateUrl: 'job-requirement.component.html',
  styleUrls: ['job-requirement.component.css']
})

export class JobRequirementComponent {
  private fullName: string;
  private firstName: string;
  private lastName: string;
  private   newUser:number;


  storedIndustry:string;
  userForm: FormGroup;
  industries=new Array();
  roles =new Array();
  storedRoles=new Array();
  industryModel = "";
  roleModel = "";
  isIndustrySelected : boolean= false;
  isRoleSelected : boolean= false;
  temproles : string[];
  maxRoles : number =3;
  key:number;
  showModalStyle: boolean = false;
  disbleRole: boolean = false;


  private  realocationlist: string[];
  private educationlist: string[];
  private experiencelist:string[];
  private salarylist:string[];
  private  noticeperiodlist:string[];
  private realocationModel:string;
  private  educationModel:string;
  private experienceModel:string;
  private salaryModel:string;
  private  noticeperiodModel:string;



  constructor(private industryService: IndustryService,private _router:Router,private http: Http,private messageService:MessageService, private dashboardService:DashboardService) {
  }


  ngOnInit(){
    this.industryService.getIndustries()
      .subscribe(
        industrylist => this.onIndustryListSuccess(industrylist.data),
        error => this.onError(error));
    }
    /*

      this.http.get("education")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.educationlist = data.educated;
          },
          err => console.error(err),
          () => console.log()
        );


      this.http.get("experience")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.experiencelist= data.experiencelist;
          },
          err => console.error(err),
          () => console.log()
        );

      this.http.get("currentsalary")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.salarylist = data.salary;
          },
          err => console.error(err),
          () => console.log()
        );

      this.http.get("noticeperiod")
        .map((res: Response) => res.json())
        .subscribe(
          data => {
            this.noticeperiodlist = data.noticeperiod;
          },
          err => console.error(err),
          () => console.log()
        );
    */

    /*this.newUser = parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      this.getUserProfile();
    }*/
  onIndustryListSuccess(data:any){debugger
    for(let industry of data){
      this.industries.push(industry.name);
    }
  }
  onError(error:any){debugger
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }




  selectIndustryModel(newVal: any) {
    this.storedIndustry=newVal;
    this.industryModel = newVal;
    this.industryService.getRoles(newVal)
      .subscribe(
        rolelist => this.onRoleListSuccess(rolelist.data),
        error => this.onError(error));

  }

  onRoleListSuccess(data:any){
    for(let role of data){
      this.roles.push(role.name);
    }
  }
  selectRolesModel(newVal: any) {
    this.storedRoles.push(newVal);

    // this.http.get("education")
    //   .map((res: Response) => res.json())
    //   .subscribe(
    //     data => {
    //       this.educationlist = data.educated;
    //     },
    //     err => console.error(err),
    //     () => console.log()
    //   );
  }

  selecteducationModel(newVal: any) {
    /*this.educationModel = newVal;
    this.selectedProfessionalData. educationlevel=this.educationModel;*/

    // this.http.get("experience")
    //   .map((res: Response) => res.json())
    //   .subscribe(
    //     data => {
    //       this.experiencelist= data.experiencelist;
    //     },
    //     err => console.error(err),
    //     () => console.log()
    //   );

  }

  selectexperienceModel(newVal: any) {
    /*this.experienceModel = newVal;
    this.selectedProfessionalData.experiencelevel=this.experienceModel;*/

    // this.http.get("currentsalary")
    //   .map((res: Response) => res.json())
    //   .subscribe(
    //     data => {
    //       this.salarylist = data.salary;
    //     },
    //     err => console.error(err),
    //     () => console.log()
    //   );

  }

  selectsalaryModel(newVal: any) {
    /*this.salaryModel = newVal;

    this.selectedProfessionalData.Csalary=this.salaryModel;*/

    // this.http.get("noticeperiod")
    //   .map((res: Response) => res.json())
    //   .subscribe(
    //     data => {
    //       this.noticeperiodlist = data.noticeperiod;
    //     },
    //     err => console.error(err),
    //     () => console.log()
    //   );
  }

  selectenoticeperiodModel(newVal: any) {
   /* this.noticeperiodModel = newVal;
    this.selectedProfessionalData.notice=this.noticeperiodModel;*/

  }















  /*getUserProfile(){
    this.dashboardService.getUserProfile()
      .subscribe(
        userprofile => this.onUserProfileSuccess(userprofile),
        error => this.onUserProfileError(error));
  }


  onUserProfileSuccess(result:any) {
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, result.data.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, result.data.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.FIRST_NAME, result.data.first_name);
    LocalStorageService.setLocalValue(LocalStorage.LAST_NAME, result.data.last_name);
    this.fullName=result.data.first_name + result.data.last_name;
    this.firstName=result.data.first_name;
    this.lastName=result.data.last_name;
  }

  onUserProfileError(error:any) {
    console.log(error);
  }*/
}
