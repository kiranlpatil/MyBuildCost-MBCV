import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ChangeMobileService} from "./change-mobile.service";
import {ChangeMobile} from "./changemobile";
import {CommonService, ImagePath, Message, MessageService, NavigationRoutes} from "../../../shared/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../../shared/customvalidations/validation.service";
import {LocalStorageService} from "../../../shared/localstorage.service";
import {LocalStorage, Messages} from "../../../shared/constants";
import {LoaderService} from "../../../shared/loader/loader.service";


@Component({
  moduleId: module.id,
  selector: 'tpl-change-mobile',
  templateUrl: 'change-mobile.component.html',
  styleUrls: ['change-mobile.component.css'],
})

export class ChangeMobileComponent implements OnInit {
  isMobileNoConfirm: boolean;
  model = new ChangeMobile();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  showModalStyle: boolean = false;
  MOBILE_ICON: string;
  NEW_MOBILE_ICON: string;
  CONFIRM_MOBILE_ICON: string;
  mobileNumberNotMatch:string= Messages.MSG_MOBILE_NUMBER_NOT_MATCH;
  mobileNumberChangeSucess:string =Messages.MSG_MOBILE_NUMBER_Change_SUCCESS;

  constructor(private commonService: CommonService, private _router: Router,
              private MobileService: ChangeMobileService, private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.userForm = this.formBuilder.group({
      'new_mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]],
      'confirm_mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]],
      'current_mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]]
    });

    this.MOBILE_ICON = ImagePath.MOBILE_ICON_GREY;
    this.NEW_MOBILE_ICON = ImagePath.NEW_MOBILE_ICON_GREY;
    this.CONFIRM_MOBILE_ICON = ImagePath.CONFIRM_MOBILE_ICON_GREY;
  }

  makeMobileConfirm(): boolean {
    if (this.model.confirm_mobile_number !== this.model.new_mobile_number) {
      this.isMobileNoConfirm = true;
      return true;
    } else {
      this.isMobileNoConfirm = false;
      return false;
    }
  }

  ngOnInit() {
    this.model.current_mobile_number = LocalStorageService.getLocalValue(LocalStorage.MOBILE_NUMBER);
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (!this.makeMobileConfirm()) {
      LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, this.model.new_mobile_number);
      this._router.navigate([NavigationRoutes.VERIFY_PHONE]);
      this.MobileService.changeMobile(this.model)
        .subscribe(
          body => this.changeMobileSuccess(body),
          error => this.changeMobileFail(error));
    }
    document.body.scrollTop = 0;
  }

  changeMobileSuccess(body: ChangeMobile) {
    this.userForm.reset();
    LocalStorageService.setLocalValue(LocalStorage.VERIFY_PHONE_VALUE, 'from_settings');
    this._router.navigate([NavigationRoutes.VERIFY_PHONE]);
  }

  changeMobileFail(error: any) {
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

  goBack() {
    this.commonService.goBack();
  }

  showHideModal() {
    this.showModalStyle = !this.showModalStyle;
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }

  getStyle() {
    if (this.showModalStyle) {
      return 'block';
    } else {
      return 'none';
    }
  }
}
