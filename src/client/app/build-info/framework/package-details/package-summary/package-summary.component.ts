import { Component,OnInit } from '@angular/core';
import { Headings, Button, Label, Messages, ValueConstant } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import {CommonService, MessageService, SessionStorage, SessionStorageService} from '../../../../shared/index';
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
  values = new AddBuildingPackageDetails();
  totalBilled: number=500;
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
     /*this.values.numOfBuildingsPurchased = this.selectedBuildingValue;
     this.values.totalBilled = this.totalBilled ;
     this.commonService.change(this.values);*/
  }

  onCancelClick() {
    sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }

   onCancel() {
     let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
     this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
   }
  onPay() {
    sessionStorage.removeItem(SessionStorage.CURRENT_VIEW);
    this._router.navigate([NavigationRoutes.APP_PACKAGE_DETAILS, NavigationRoutes.PAYMENT,this.packageName,NavigationRoutes.SUCCESS]);
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



