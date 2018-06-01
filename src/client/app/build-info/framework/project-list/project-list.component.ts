import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes, Button, Animations } from '../../../shared/constants';
import { ProjectService } from '../project/project.service';
import { Project } from './../model/project';
import {PackageDetailsService} from "../package-details/package-details.service";

@Component({
  moduleId: module.id,
  selector: 'bi-project-list',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css']
})

export class ProjectListComponent implements OnInit, AfterViewInit {
  isVisible: boolean = false;
  animateView: boolean = false;
  isSubscriptionExist: boolean = false;
  premiumPackageAvailable:boolean=false;
  projects : Array<any>;
  packageName:any;
  premiumPackageDetails:any;


  constructor(private projectService: ProjectService, private _router: Router,private packageDetailsService : PackageDetailsService) {
  }

  ngOnInit() {
    this.getAllProjects();
  }

  createProject(isSubscriptionAvailable : boolean,premiumPackageExist:boolean) {
    if(isSubscriptionAvailable) {
      this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
    } else {
      let packageName = 'Premium';
      this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY, packageName, premiumPackageExist]);
      }
    }


  getAllProjects() {
    this.projectService.getAllProjects().subscribe(
      projects => this.onGetAllProjectSuccess(projects),
      error => this.onGetAllProjectFailure(error)
    );
  }

  onGetAllProjectSuccess(projects : any) {
    this.projects = projects.data;
    if(this.projects && this.projects.length >1) {
      this.premiumPackageAvailable=true;
      this.getSubscriptionPackageByName(this.projects[1].projectName);
    }else {
      this.premiumPackageAvailable=false;
    }
    this.isSubscriptionExist = projects.isSubscriptionAvailable;
    this.isVisible = true;
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
  onGetSubscriptionPackageByNameFailure(error:any) {
    console.log(error);
  }

  onGetAllProjectFailure(error : any) {
    console.log(error);
  }

  getButton() {
    return Button;
  }

  getListItemAnimation(index : number) {
    return Animations.getListItemAnimationStyle(index, 0.1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('animated');
      this.animateView = true;
    },150);
  }
}
