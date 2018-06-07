import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes, Button, Animations } from '../../../shared/constants';
import { ProjectService } from '../project/project.service';
import { Project } from './../model/project';
import {PackageDetailsService} from "../package-details/package-details.service";
declare var $: any;

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
  trialProjectExist:boolean=false;
  premiumPackageDetails:any;


  constructor(private projectService: ProjectService, private _router: Router,private packageDetailsService : PackageDetailsService) {
  }

  ngOnInit() {
    this.getAllProjects();
  }

  createProject(isSubscriptionAvailable : boolean,trialProjectExist:boolean,premiumPackageExist:boolean) {
    if(isSubscriptionAvailable) {
      this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
    } else if(trialProjectExist) {
      $('#createProjectConfirmation').modal();
    }else if(trialProjectExist && !isSubscriptionAvailable) {
      $('#createProjectConfirmation').modal();
    }
      /* let packageName = 'Premium';
      this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY, packageName, premiumPackageExist]);*/
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
      //this.getSubscriptionPackageByName('Premium');

    }else if(this.projects.length === 1 && this.projects[0].projectName.includes('Trial')) {
       this.premiumPackageAvailable=false;
       this.trialProjectExist=true;
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
