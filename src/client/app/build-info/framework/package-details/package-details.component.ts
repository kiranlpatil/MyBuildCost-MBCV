import { Component,OnInit } from '@angular/core';
import { Headings, Button, Label,Messages } from '../../../shared/constants';
import { Router } from '@angular/router';
import { Message, MessageService } from '../../../shared/index';
import { PackageDetailsService } from './package-details.service';
import { NavigationRoutes } from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-package-details',
  templateUrl: 'package-details.component.html',
  styleUrls: ['package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {
  packageDetailsList: any;
  packageName:any;

  constructor(private packageDetailsService : PackageDetailsService, private _router: Router, private messageService : MessageService) {
  }

  ngOnInit() {
    this.getBaseSubscriptionPackageList();
  }

  getBaseSubscriptionPackageList() {
    this.packageDetailsService.getBaseSubscriptionPackageList().subscribe(
      packageDetailsList => this.onGetBaseSubscriptionPackageListSuccess(packageDetailsList),
      error => this.onGetBaseSubscriptionPackageListFailure(error)
    );
  }

  onGetBaseSubscriptionPackageListSuccess(packageDetailsList : any) {
      this.packageDetailsList = packageDetailsList;
      this.packageName = packageDetailsList[1].basePackage.name;
      }

  onGetBaseSubscriptionPackageListFailure(error : any) {
    console.log(error);
    var message = new Message();
    message.isError = true;
    message.custom_message = error.err_msg;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
  }

  goToCreateTrialProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  goToCreatePremiumProject() {
    this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY,this.packageName,false]);
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
}



