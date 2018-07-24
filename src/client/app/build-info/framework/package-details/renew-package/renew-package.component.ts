import { Component,OnInit } from '@angular/core';
import {Button, Headings, Label, NavigationRoutes} from '../../../../shared/constants';
import { PackageDetailsService } from '../package-details.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoaderService, Message, MessageService} from '../../../../shared/index';
import { SessionStorage, SessionStorageService } from '../../../../shared/index';
import { SubscribedPackage } from '../../model/SubscribedPackage';
import { CommonService } from '../../../../shared/services/common.service';
@Component({
  moduleId: module.id,
  selector: 'bi-renew-package',
  templateUrl: 'renew-package.component.html',
  styleUrls: ['renew-package.component.css']
})
export class RenewPackageComponent implements OnInit {
  premiumPackageDetails:any;

  projectId : string;
  projectName : string;
  numOfDaysToExpire : string;
  body:any;
  public currentDate: Date = new Date();
  public expiryDate: Date = new Date();

  constructor(private packageDetailsService : PackageDetailsService, private _router: Router, private messageService : MessageService,
              private route: ActivatedRoute, private commonService : CommonService, private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.projectId = params['projectId'];
      this.projectName = params['projectName'];
      this.numOfDaysToExpire = params['numOfDaysToExpire'];
    });
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, this.projectId);
    this.getSubscriptionPackageByName();
  }

  getSubscriptionPackageByName() {
    if (this.projectName.includes(this.getLabels().PREFIX_TRIAL_PROJECT)) {
       this.body = { basePackageName: 'Premium'};
    } else {
       this.body = { addOnPackageName: 'RenewProject'};
    }
    this.loaderService.start();
    this.packageDetailsService.getSubscriptionPackageByName(this.body).subscribe(
      packageDetails=>this.onGetSubscriptionPackageByNameSuccess(packageDetails,this.body),
      error=>this.onGetSubscriptionPackageByNameFailure(error)
    );
  }
  onGetSubscriptionPackageByNameSuccess(packageDetails:any, body: any) {
    this.loaderService.stop();
    let subscribedPackage = new SubscribedPackage();
    if(body.basePackageName) {
      this.premiumPackageDetails=packageDetails[0].basePackage;
      subscribedPackage.name =  this.getLabels().PACKAGE_REATAIN_PROJECT;
      subscribedPackage.amount = this.premiumPackageDetails.cost;
    }else {
      this.premiumPackageDetails=packageDetails[0].addOnPackage;
      subscribedPackage.name = this.premiumPackageDetails.name;
      subscribedPackage.amount = this.premiumPackageDetails.cost;
    }
    this.commonService.updatePurchasepackageInfo(subscribedPackage);

   this.currentDate.setDate(this.currentDate.getDate() +  parseInt(this.numOfDaysToExpire));
   this.expiryDate.setDate(this.currentDate.getDate() + this.premiumPackageDetails.validity);
    SessionStorageService.setSessionValue(SessionStorage.TOTAL_BILLED,this.premiumPackageDetails.cost );
  }
  onGetSubscriptionPackageByNameFailure(error:any) {
    this.loaderService.stop();
    console.log(error);
    var message = new Message();
    message.isError = true;
    message.custom_message = error.err_msg;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
  }

  getHeadings() {
    return Headings;
  }

  getLabels() {
    return Label;
  }

  getButton() {
    return Button;
  }

  cancel() {
    window.history.go(-1);
  }

  proceedToPay() {
    if(this.body.basePackageName) {
      this._router.navigate(['project', NavigationRoutes.PAYMENT]);
    //this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT,this.getLabels().PACKAGE_REATAIN_PROJECT,NavigationRoutes.SUCCESS]);
  }else {
      this._router.navigate(['project', NavigationRoutes.PAYMENT]);
    //this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT,this.getLabels().PACKAGE_RENEW_PROJECT,NavigationRoutes.SUCCESS]);
    }
  }

}
