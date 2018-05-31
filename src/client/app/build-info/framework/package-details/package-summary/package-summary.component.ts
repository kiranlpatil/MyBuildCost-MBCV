import { Component,OnInit } from '@angular/core';
import { Headings, Button, Label,Messages } from '../../../../shared/constants';
import {ActivatedRoute, Router} from '@angular/router';
import { Message, MessageService } from '../../../../shared/index';
import { PackageDetailsService } from './../package-details.service';
import { NavigationRoutes } from '../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-package-summary',
  templateUrl: 'package-summary.component.html',
  styleUrls: ['package-summary.component.scss']
})
export class PackageSummaryComponent implements OnInit {
  packageName: any;
  premiumPackageDetails:any;

  constructor(private activatedRoute:ActivatedRoute,private packageDetailsService : PackageDetailsService, private _router: Router, private messageService : MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.packageName = params['packageName'];
      if(this.packageName) {
        this.getSubscriptionPackageByName(this.packageName);
      }
    });
    console.log('Init');
    }

    getSubscriptionPackageByName(packageName : string) {
    this.packageDetailsService.getSubscriptionPackageByName(packageName).subscribe(
      packageDetails=>this.onGetSubscriptionPackageByNameSuccess(packageDetails),
      error=>this.onGetSubscriptionPackageByNameFailure(error)
    );
  }
  onGetSubscriptionPackageByNameSuccess(packageDetails:any) {
    this.premiumPackageDetails=packageDetails[0];
  }
  onGetSubscriptionPackageByNameFailure(error:any){
    console.log(error);
 }
  onCancelClick(){

   }
  onPay(){

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



