
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
import { Http,Response } from '@angular/http';
import { RecruitingService } from '../../shared/recruiting.service';
import {  Location  } from '../location';
import {MyGoogleAddress} from "../candidate/google-our-place/my-google-address";


@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-registration',
  templateUrl: 'recruiter.component.html',
  styleUrls: ['recruiter.component.css'],
})

export class RecruiterComponent implements OnInit {
  private model = new Recruiter();
  private storedcompanySize:any;
  private companySize :any;
  private companyHeadquarter:any;
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
  private storedLoaction:Location=new Location();
  private address: any;

  constructor(private commonService: CommonService, private _router: Router, private http: Http,
              private recruiterService: RecruiterService, private recruitmentForService: RecruitingService,
              private messageService: MessageService, private formBuilder: FormBuilder) {

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
      'confirm_password': ['', [ ValidationService.requireConfirmPasswordValidator]],
      'location':['',Validators.required],
      'company_headquarter_country':[''],
      'captcha':['',Validators.required]

    });
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.image_path = ImagePath.PROFILE_IMG_ICON;
  }

  ngOnInit() {
    this.model = this.recruiterForm.value;



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


  selectCompanyHeadquarterModel(address :MyGoogleAddress) {
    this.companyHeadquarter=address.country;
    this.recruiterForm.value.company_headquarter_country=this.companyHeadquarter;
  }

  getAddress(address :MyGoogleAddress){
    this.storedLoaction.city= address.city;
    this.storedLoaction.state= address.state;
    this.storedLoaction.country= address.country;
  }

  onSubmit() {
    this.model = this.recruiterForm.value;
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.location=this.storedLoaction;
    this.model.isCandidate =false;
    this.model.company_size=this.storedcompanySize;
    this.model.company_headquarter_country =this.companyHeadquarter;
    this.model.isRecruitingForself =this.isRecruitingForself;
    this.model.email = this.model.email.toLowerCase();
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
    this._router.navigate([NavigationRoutes.VERIFY_USER]);
  }

  onRegistrationError(error: any) {
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



  goBack() {
    this.commonService.goBack();
    this._router.navigate(['/']);
  }

  makePasswordConfirm(): boolean {
    if (this.model.confirm_password !== this.model.password) {
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
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
