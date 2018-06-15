import { Component,OnInit } from '@angular/core';
import { Headings, Button, Label, Messages, ValueConstant } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import {CommonService,Message, MessageService, SessionStorage, SessionStorageService} from '../../../../shared/index';
import { PackageDetailsService } from './../package-details.service';
import { NavigationRoutes } from '../../../../shared/index';
import {AddBuildingPackageDetails} from "../../model/add-building-package-details";

@Component({
  moduleId: module.id,
  selector: 'bi-package-summary',
  templateUrl: 'package-summary.component.html',
  styleUrls: ['package-summary.component.css']
})
export class PackageSummaryComponent implements OnInit {
  packageName: any;
  premiumPackageExist: any;
  premiumPackageAvailable: boolean = false;
  premiumPackageDetails: any;
  selectedBuildingValue: any=1;
  totalBilled: number=500;
  sum : number =0;
  projectId:any;
  noOfBuildingsValues: any[] = ValueConstant.NO_OF_BUILDINGS_VALUES;

  constructor(private activatedRoute: ActivatedRoute, private packageDetailsService: PackageDetailsService,
              private _router: Router, private commonService:CommonService,private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.packageName = params['packageName'];
      this.premiumPackageExist = params['premiumPackageExist'];
      this.premiumPackageAvailable = this.premiumPackageExist !== 'false' ? true : false;
      if (this.packageName === 'Premium' || this.packageName === 'Retain') {
          let body = {
            basePackageName: 'Premium'
          };
          this.getSubscriptionPackageByName(this.packageName, body);
        }
        });
    SessionStorageService.setSessionValue(SessionStorage.NO_OF_BUILDINGS_PURCHASED,this.selectedBuildingValue);
    SessionStorageService.setSessionValue(SessionStorage.TOTAL_BILLED,this.totalBilled);
    }

  getSubscriptionPackageByName(packageName: string, body: any) {
    this.packageDetailsService.getSubscriptionPackageByName(body).subscribe(
      packageDetails => this.onGetSubscriptionPackageByNameSuccess(packageDetails),
      error => this.onGetSubscriptionPackageByNameFailure(error)
    );
  }
  updateSubscription(body:any) {
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.packageDetailsService.getRetainOrRenewProject(this.projectId, body)
      .subscribe(success => this.onRetainOrRenewProjectSuccess(success),
        error => this.onRetainOrRenewProjectFailure(error));
  }


  onRetainOrRenewProjectSuccess(success: any) {
    let message = new Message();
      message.isError = false;
      message.custom_message = success.data;
      this.messageService.message(message);
      this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT, this.packageName, NavigationRoutes.SUCCESS]);

    //this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
      }

  onRetainOrRenewProjectFailure(error:any) {
    console.log(error);
    var message = new Message();
    message.isError = true;
    // message.custom_message = error.err_msg;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
    }

  onGetSubscriptionPackageByNameSuccess(packageDetails: any) {
    this.premiumPackageDetails = packageDetails[0];
  }

  onGetSubscriptionPackageByNameFailure(error: any) {
    console.log(error);
  }

  onChange(selectedValue: any) {
    this.selectedBuildingValue = parseInt(selectedValue);
    SessionStorageService.setSessionValue(SessionStorage.NO_OF_BUILDINGS_PURCHASED,this.selectedBuildingValue);
    this.totalBilled = this.selectedBuildingValue*500;
    SessionStorageService.setSessionValue(SessionStorage.TOTAL_BILLED,this.totalBilled);
    }

  onCancelClick() {
    sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
    window.history.back();
  }

   onCancel() {
     let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
     this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
   }
  onPay() {
    sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
    this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT, this.packageName, NavigationRoutes.SUCCESS]);
      }
  onProceedToPay() {
    if(this.packageName === 'Add_building') {
      let body = { packageName: 'Add_building',
        numOfPurchasedBuildings:this.selectedBuildingValue,
        totalBilled :this.totalBilled };
      this.updateSubscription(body);
    }
  }
  getHeadings() {
    return Headings;
  }

  getLabels() {
    return Label;
  }

  getMessages() {
    return Messages;
  }

  getButton() {
    return Button;
  }
}



