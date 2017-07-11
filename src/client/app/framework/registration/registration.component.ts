import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {RegistrationService} from "./registration.service";
import {Registration} from "./registration";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CommonService, MessageService} from "../shared/index";
import {ImagePath} from "../shared/constants";
import {LoaderService} from "../shared/loader/loader.service";
import {RecruitingService} from "../shared/recruiting.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'tpl-registration',
  templateUrl: 'registration.component.html',
  styleUrls: ['registration.component.css'],
})

export class RegistrationComponent implements OnInit {
  model = new Registration();
  isPasswordConfirm: boolean;
  isFormSubmitted = false;
  userForm: FormGroup;
  error_msg: string;
  isCandidate: boolean;
  isRecruiter: boolean = true;
  isShowErrorMessage: boolean = true;
  isRecruitingForself: boolean = true;
  BODY_BACKGROUND: string;

  constructor(private activatedRoute: ActivatedRoute, private commonService: CommonService, private _router: Router,
              private registrationService: RegistrationService, private messageService: MessageService,
              private recruitingService: RecruitingService, private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.isCandidate = false;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit() {
   /* this.activatedRoute.queryParams.subscribe((params: Params) => {
      //let access_token = params['access_token'];
      var id = String(params['id']);
      //console.log('id',id);
     //alert(id);
      if(id == 'recruiter') {
        //alert(id);
        this.showHideRecruiter();
      }
    });
*/
  }

  /*
   onSubmit() {
   this.model = this.userForm.value;
   this.model.current_theme = AppSettings.LIGHT_THEM;
   if (!this.makePasswordConfirm()) {
   this.isFormSubmitted = true;
   this.registrationService.addRegistration(this.model)
   .subscribe(
   user => this.onRegistrationSuccess(user),
   error => this.onRegistrationError(error));
   }
   }

   onRegistrationSuccess(user: any) {
   LocalStorageService.setLocalValue(LocalStorage.USER_ID, user.data._id);
   LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID,this.userForm.value.email);
   LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, this.userForm.value.mobile_number);
   LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration'); //TODO use navigation routes(framework)
   this.userForm.reset();
   this._router.navigate([NavigationRoutes.VERIFY_USER]);
   }

   onRegistrationError(error: any) {
   if (error.err_code === 404 || error.err_code === 0) {
   var message = new Message();
   message.error_msg = error.err_msg;
   message.isError = true;
   this.messageService.message(message);
   } else {
   this.isShowErrorMessage = false;
   this.error_msg = error.err_msg;
   }
   }
   */
  /*

   goBack() {
   this.commonService.goBack();
   this._router.navigate(['/']);
   }

   navigateTo(navigateTo: string) {
   if (navigateTo !== undefined ) {
   this._router.navigate([navigateTo]);
   }
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

   closeErrorMessage() {
   this.isShowErrorMessage = true;
   }

   */

  showHideCandidate() { //TODO use single variable for all view.
    this.isCandidate = !this.isCandidate;
    //this.isRecruiter = true;
    //alert(this.isCandidate);
  }

  showHideRecruiter() {
    this.isCandidate = !this.isCandidate;
    //this.isCandidate = true;
    //alert(this.isCandidate);
  }

 /* recruitmentForSelf() {
    this.isRecruitingForself = true;
    this.recruitingService.change(this.isRecruitingForself);

  }

  recruitmentForOthers() {
    this.isRecruitingForself = false;
    this.recruitingService.change(this.isRecruitingForself);

  }*/

}
