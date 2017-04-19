
import {   Component ,OnInit } from '@angular/core';
import {  Router  } from '@angular/router';
import {  RecruiterService  } from './recruiter.service';
import {  Recruiter  } from './recruiter';
import {  FormBuilder, FormGroup, Validators  } from '@angular/forms';
import {  ValidationService  } from '../../shared/customvalidations/validation.service';
import {
  Message,
  MessageService,
  CommonService,
  NavigationRoutes,
  AppSettings
 } from '../../shared/index';
import {  ImagePath, LocalStorage  } from '../../shared/constants';
import {  LocalStorageService  } from '../../shared/localstorage.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { Http,Response } from '@angular/http';
import { RecruitingService } from '../../shared/recruiting.service';


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-registration',
  templateUrl: 'recruiter.component.html',
  styleUrls: ['recruiter.component.css'],
})

export class RecruiterComponent implements OnInit {
  private model = new Recruiter();
  private storedcountry:string;
  private storedstate:string;
  private storedcity:string;
  private storedcompanySize:any;
  private locationDetails : any;
  private companySize :any;
  private companyHeadquarter:any;
  private countries:string[]=new Array(0);
  private states:string[]=new Array(0);
  private cities:string[]=new Array(0);
  private isPasswordConfirm: boolean;
  private isFormSubmitted = false;
  private recruiterForm: FormGroup;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND:string;
  private image_path: string;
  private isRecruitingForself:boolean = true;
  private isShowMessage:boolean=false;
  private myPassword:string='';
  private isStateSelected:boolean=false;
  private isCountrySelected:boolean=false;

  constructor(private commanService: CommonService, private _router: Router, private http: Http,
              private recruiterService: RecruiterService, private recruitmentForService: RecruitingService,
              private messageService: MessageService, private formBuilder: FormBuilder, private loaderService:LoaderService) {

    recruitmentForService.showRecruitmentFor$.subscribe(
      data=> {
        this.isRecruitingForself=data;
      }
    );

    this.recruiterForm = this.formBuilder.group({
      'company_name': ['', ValidationService.requireCompanyNameValidator],
      'company_size': [''],
      'mobile_number': ['',[ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator]],
      'email': ['',[ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      'password': ['', [ValidationService.requirePasswordValidator, ValidationService.passwordValidator]],
      'conform_password': ['', [ ValidationService.requireConfirmPasswordValidator]],
      'location':[
        {
          'country':['',Validators.required],
          'state':['',Validators.required],
          'city':['',Validators.required],
          'pin':[''],
        },
        Validators.required],
      'pin':['',[ValidationService.requirePinValidator,ValidationService.pinValidator]],
      'company_headquarter_country':[''],
      'captcha':['',Validators.required]

    });
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.image_path = ImagePath.PROFILE_IMG_ICON;
  }

  ngOnInit() {
    this.model = this.recruiterForm.value;

    this.http.get('address')
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.locationDetails=data.address;
          for(var  i = 0; i <data.address.length; i++) {
            this.countries.push(data.address[i].country);
            console.log(data.address[0].country);

          }
        },
        err => console.error(err),
        () => console.log()
      );

    this.http.get('companysize')
      .map((res: Response) => res.json())
      .subscribe(
        data => {

          this.companySize=data.companysize;
        },
        err => console.error(err),
        () => console.log()
      );

  }

  selectCompanySizeModel(newval:string) {

    this.storedcompanySize=newval;
    this.recruiterForm.value.company_size=this.storedcompanySize;
    this.model.company_size=this.recruiterForm.value.company_size;
  }

  selectCountryModel(newval:string) {
    this.states = new Array();
    this.cities = new Array();
    for(let item of this.locationDetails) {
      if(item.country===newval) {
        let tempStates: string[]= new Array(0);
        for(let state of item.states) {
          tempStates.push(state.name);
        }
        this.states=tempStates;
      }
    }
    this.storedcountry=newval;
    this.isCountrySelected=false;
    document.getElementById("allstates").value ='';
    document.getElementById("allcities").value ='';
  }

  selectCompanyHeadquarterModel(newval : string) {

    this.companyHeadquarter=newval;
    this.recruiterForm.value.company_headquarter_country=this.companyHeadquarter;
  }

  selectStateModel(newval:string) {
    this.cities = new Array();
    for(let item of this.locationDetails) {
      if(item.country===this.storedcountry) {
        for(let state of item.states) {
          if(state.name===newval) {
            let tempCities: string[]= new Array(0);
            for(let city of state.cities) {
              tempCities.push(city);
            }
            this.cities=tempCities;
          }
        }
      }
    }
    this.storedstate=newval;
    this.isStateSelected=false;
    document.getElementById("allcities").value='';
  }

  selectCityModel(newval : string) {
    this.storedcity=newval;

  }

  onSubmit() {
    this.model = this.recruiterForm.value;
    this.model.current_theme = AppSettings.LIGHT_THEM;

    this.model.location.country =this.storedcountry;
    this.model.location.state = this.storedstate;
    this.model.location.city = this.storedcity;
    this.model.location.pin = this.model.pin;
    this.model.isCandidate =false;
    this.model.company_size=this.storedcompanySize;
    this.model.company_headquarter_country =this.companyHeadquarter;
    this.model.isRecruitingForself =this.isRecruitingForself;
    if (!this.makePasswordConfirm()) {
      this.isFormSubmitted = true;
      this.recruiterService.addRecruiter(this.model)
        .subscribe(
          user => this.onRegistrationSuccess(user),
          error => this.onRegistrationError(error));
    }
  }

  onRegistrationSuccess(user: any) {
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, user.data._id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID,this.recruiterForm.value.email);
    LocalStorageService.setLocalValue(LocalStorage.COMPANY_NAME, this.recruiterForm.value.company_name);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    LocalStorageService.setLocalValue(LocalStorage.FROM_CANDIDATE_REGISTRATION, 'false');
   // this.recruiterForm.reset();
    this._router.navigate([NavigationRoutes.VERIFY_USER]);
  }

  onRegistrationError(error: any) {
    // this.loaderService.stop();
    if (error.err_code === 404 || error.err_code === 0) {
      var message = new Message();
      message.error_msg = error.message;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
    }
  }

  selectStateMessage() {

    if (this.storedstate) {
    } else {
      this.isStateSelected = true;

    }
  }

  selectCountryMessage() {

    if (this.storedcountry) {
      console.log("stord state is:", this.storedstate);
    } else {
      this.isCountrySelected = true;

    }
  }

  goBack() {
    this.commanService.goBack();
    this._router.navigate(['/']);
  }

  makePasswordConfirm(): boolean {
    if (this.model.conform_password !== this.model.password) {
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }

  showMessage() {
    this.isShowMessage =false;
  }

  selectPassword(newval:any) {
    if (this.myPassword.match(/(?=.*\d)(?=.*[a-z])(?=.*[$@#_!%*?&])(?=.*[A-Z]).{8,}/)) {

      this.isShowMessage=false;
    }
  }
}
