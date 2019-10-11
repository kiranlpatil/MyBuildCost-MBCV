import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PayUMoneyModel } from '../model/PayUMoneyModel';
import { PayUMoneyService } from './payUMoney.service';
import {NavigationRoutes, SessionStorage} from '../../../shared/constants';
import { CommonService } from '../../../shared/services/common.service';
import { ValidationService } from '../../../shared/customvalidations/validation.service';
import { Message } from '../../../shared/index';
import { Messages } from '../../../shared/constants';
import { MessageService } from '../../../shared/services/message.service';
import {SessionStorageService} from "../../../shared/services/session.service";
import {ProjectHeaderVisibilityService} from "../../../shared/services/project-header-visibility.service";

@Component ({
  moduleId:module.id,
  selector:'pay-u-money-integration',
  templateUrl:'payUMoney.component.html',
  styleUrls: ['payUMoney.component.css'],
})

export class PayUMoneyComponent implements OnInit {

  payUMoney : PayUMoneyModel = new PayUMoneyModel();
  payUMoneyForm: FormGroup;
  subscription : any;
  public isShowErrorMessage: boolean = false;

  constructor(private payUMoneyService : PayUMoneyService,  private _router : Router, private commonService : CommonService,
              private formBuilder : FormBuilder, private messageService :  MessageService,
              private projectHeaderVisibilityService:ProjectHeaderVisibilityService) {

    this.payUMoneyForm = this.formBuilder.group({
      firstname: ['', ValidationService.requireFirstNameValidator],
      lastname: ['', ValidationService.requireLastNameValidator],
      email: ['', ValidationService.requireEmailValidator],
      phone: ['', ValidationService.requireMobileNumberValidator],
      productinfo: [''],
      amount: ['']
    });
  }

  ngOnInit() {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW,'paymentForm');
    this.projectHeaderVisibilityService.change(false);
    this.subscription = this.commonService.updatepackageInfo$
      .subscribe(item => {
        if(item !== undefined || item !== null) {
          this.payUMoney.amount = item.amount;
          this.payUMoney.productinfo = item.name;
        }
      }
    );
  }


  submitPaymentForm() {
    if(this.checkValidations(this.payUMoney)) {
      this.payUMoneyService.goToPayment(this.payUMoney).subscribe(
        PayUMoneyModel => this.onGetHashSuccess(PayUMoneyModel),
        error => this.onGetHashFailure(error)
      );
    } else {
      let message = new Message();
      message.isError = true;
      message.error_msg = Messages.PAYMENT_FORM_FILED_MISSING;
      this.messageService.message(message);
    }
  }

  checkValidations(payUMoneyModel : PayUMoneyModel) {
    if(payUMoneyModel.firstname === null || payUMoneyModel.firstname === undefined) {
      return false;
    } else if(payUMoneyModel.firstname === null || payUMoneyModel.firstname === undefined) {
      return false;
    } else if(payUMoneyModel.lastname === null || payUMoneyModel.lastname === undefined) {
      return false;
    } else if(payUMoneyModel.email === null || payUMoneyModel.email === undefined) {
      return false;
    } else if(payUMoneyModel.phone === null || payUMoneyModel.phone === undefined) {
      return false;
    } else if(payUMoneyModel.productinfo === null || payUMoneyModel.productinfo === undefined) {
      return false;
    } else if(payUMoneyModel.amount === null || payUMoneyModel.amount === undefined) {
      return false;
    } else {
      return true;
    }
  }

  onGetHashSuccess(PayUMoneyModel : any) {
    console.log('calling payment : '+JSON.stringify(PayUMoneyModel.data));
    window.location.href = PayUMoneyModel.data;
    //this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT, this.packageName, NavigationRoutes.SUCCESS]);

  }

  onGetHashFailure(error : Error) {
    console.log('PayUMoneyModel error : ' + JSON.stringify(error));
  }

  goToDashboard()  {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }
}
