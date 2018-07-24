import { Component,OnInit } from '@angular/core';
import { Headings, Button, Label, Messages, ValueConstant } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CommonService, LoaderService, Message, MessageService, SessionStorage,
  SessionStorageService
} from '../../../../shared/index';
import { PackageDetailsService } from './../package-details.service';
import { NavigationRoutes } from '../../../../shared/index';
import { SubscribedPackage } from '../../model/SubscribedPackage';
import {CostSummaryService} from "../../project/cost-summary-report/cost-summary.service";

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
  projectName:string;
  numOfBuildingsForProject : number;
  numOfBuildingsAllocated : number;
  noOfBuildingsValues: any[] = ValueConstant.NO_OF_BUILDINGS_VALUES;

  constructor(private activatedRoute: ActivatedRoute, private packageDetailsService: PackageDetailsService,
              private costSummaryService :CostSummaryService,private _router: Router, private commonService:CommonService,
              private messageService: MessageService, private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.packageName = params['packageName'];
      this.premiumPackageExist = params['premiumPackageExist'];
      this.premiumPackageAvailable = this.premiumPackageExist !== 'false' ? true : false;
      if (this.packageName === 'Premium' || this.packageName === 'Retain' || this.packageName === 'Free' ) {
          let body = {
            basePackageName: 'Premium'
          };
          this.getSubscriptionPackageByName(this.packageName, body);
        }
        });
    SessionStorageService.setSessionValue(SessionStorage.NO_OF_BUILDINGS_PURCHASED,this.selectedBuildingValue);
    SessionStorageService.setSessionValue(SessionStorage.TOTAL_BILLED,this.totalBilled);
    }


  getProjectSubscriptionDetails () {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.costSummaryService.checkLimitationOfBuilding(userId, projectId).subscribe(
      status=>this.checkLimitationOfBuildingSuccess(status),
      error=>this.checkLimitationOfBuildingFailure(error)
    );
  }

  checkLimitationOfBuildingSuccess(projectSubscriptionDetails:any) {
    this.numOfBuildingsAllocated = projectSubscriptionDetails.numOfBuildingsAllocated;
    let noOfBuildingsPurchased = SessionStorageService.getSessionValue(SessionStorage.NO_OF_BUILDINGS_PURCHASED);
    this.numOfBuildingsForProject = this.numOfBuildingsAllocated + parseInt(noOfBuildingsPurchased);
    if(this.numOfBuildingsForProject <=10) {
      this._router.navigate(['project', NavigationRoutes.PAYMENT]);
    }else {
      let message = new Message();
      message.isError = true;
      message.error_msg = Messages.BUILDING_PURCHASED_ERROR;
      this.messageService.message(message);
    }
   }

  checkLimitationOfBuildingFailure(error:any) {
    console.log(error);
  }
  getSubscriptionPackageByName(packageName: string, body: any) {
    this.loaderService.start();
    this.packageDetailsService.getSubscriptionPackageByName(body).subscribe(
      packageDetails => this.onGetSubscriptionPackageByNameSuccess(packageDetails),
      error => this.onGetSubscriptionPackageByNameFailure(error)
    );
  }
  onGetSubscriptionPackageByNameSuccess(packageDetails: any) {
    this.loaderService.stop();
    this.premiumPackageDetails = packageDetails[0];
    let subscribedPackage = new SubscribedPackage();
    if(this.premiumPackageAvailable) {
      subscribedPackage.amount = (this.premiumPackageDetails.basePackage.cost - this.premiumPackageDetails.basePackage.iterativeDiscount);
      subscribedPackage.name = this.packageName;
    } else {
      subscribedPackage.amount = this.premiumPackageDetails.basePackage.cost;
      subscribedPackage.name = this.packageName;
    }
    SessionStorageService.setSessionValue(SessionStorage.TOTAL_BILLED, subscribedPackage.amount);
    this.commonService.updatePurchasepackageInfo(subscribedPackage);
  }

  onGetSubscriptionPackageByNameFailure(error: any) {
    this.loaderService.stop();
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
    sessionStorage.removeItem(SessionStorage.CREATE_NEW_PROJECT);
    //this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT, this.packageName, NavigationRoutes.SUCCESS]);
    this._router.navigate(['project', NavigationRoutes.PAYMENT]);
  }

  onProceedToPay() {
    if(this.packageName === 'Add_building') {
      let body = {
        packageName: 'Add_building',
        numOfPurchasedBuildings:this.selectedBuildingValue,
        totalBilled :this.totalBilled
      };
      let subscribedPackage = new SubscribedPackage();
      subscribedPackage.name = body.packageName;
      subscribedPackage.amount = body.totalBilled;
      this.commonService.updatePurchasepackageInfo(subscribedPackage);
      this.getProjectSubscriptionDetails();

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



