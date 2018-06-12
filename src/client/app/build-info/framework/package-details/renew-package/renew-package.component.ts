import { Component,OnInit } from '@angular/core';
import {Button, Headings, Label, NavigationRoutes} from '../../../../shared/constants';
import { PackageDetailsService } from '../package-details.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Message, MessageService } from '../../../../shared/index';
@Component({
  moduleId: module.id,
  selector: 'bi-renew-package',
  templateUrl: 'renew-package.component.html',
})
export class RenewPackageComponent implements OnInit {
  premiumPackageDetails:any;

  projectId : string;
  projectName : string;
  numOfDaysToExpire : number;

  public currentDate: Date = new Date();
  public expiryDate: Date;

  constructor(private packageDetailsService : PackageDetailsService, private _router: Router, private messageService : MessageService, private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.projectId = params['projectId'];
      this.projectName = params['projectName'];
      this.numOfDaysToExpire = params['numOfDaysToExpire'];
    });
    this.getSubscriptionPackageByName();
  }

  getSubscriptionPackageByName() {
      let body = {
        addOnPackageName : 'RenewProject'
      };

    this.packageDetailsService.getSubscriptionPackageByName(body).subscribe(
      packageDetails=>this.onGetSubscriptionPackageByNameSuccess(packageDetails),
      error=>this.onGetSubscriptionPackageByNameFailure(error)
    );
  }
  onGetSubscriptionPackageByNameSuccess(packageDetails:any) {
    this.premiumPackageDetails=packageDetails[0].addOnPackage;
    this.expiryDate = new Date();
    this.expiryDate.setDate( this.currentDate.getDate() + this.numOfDaysToExpire + this.premiumPackageDetails.validity);
  }
  onGetSubscriptionPackageByNameFailure(error:any) {
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
    this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT,this.getLabels().PACKAGE_RENEW_PROJECT,NavigationRoutes.SUCCESS]);
  }

}
