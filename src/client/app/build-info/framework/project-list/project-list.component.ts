import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes, Button, Animations } from '../../../shared/constants';
import { ProjectService } from '../project/project.service';
import { Project } from './../model/project';
import { PackageDetailsService } from '../package-details/package-details.service';
import { SessionStorage, SessionStorageService } from '../../../shared/index';
declare var $: any;
import { ErrorService } from '../../../shared/services/error.service';

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
  sampleProject : any;
  packageName:any;
  isSamplePrjUser:boolean=false;
  isRetainModalActive:boolean=false;
  isProjectModalActive:boolean=false;
  premiumPackageDetails:any;

  constructor(private projectService: ProjectService, private _router: Router,
  private packageDetailsService : PackageDetailsService, private errorService:ErrorService) {
  }

  ngOnInit() {
    this.getAllProjects();
  }

  createProject(isSubscriptionAvailable : boolean,isRetainModalActive:boolean,isProjectModalActive:boolean,premiumPackageExist:boolean) {
    if(isSubscriptionAvailable) {
      this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
    } else if(isRetainModalActive) {
      $('#createProjectConfirmation').modal();
    }else if(isProjectModalActive) {
      $('#createProjectConfirmation').modal();
    }
     /*  let packageName = 'Premium';
      this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY, packageName, premiumPackageExist]);
  */}



  getAllProjects() {
    this.projectService.getAllProjects().subscribe(
      projects => this.onGetAllProjectSuccess(projects),
      error => this.onGetAllProjectFailure(error)
    );
  }

  onGetAllProjectSuccess(projects : any) {
   this.projects = projects.data;
   this.sampleProject = projects.sampleProject;
   for(let project of this.projects) {
     if(project.projectId === this.sampleProject[0].projectId) {
       this.isSamplePrjUser = true;
     }
   }
   if(this.projects.length !== 0) {
     SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_NAME, this.projects[0].projectName);
     SessionStorageService.setSessionValue(SessionStorage.CURRENT_PROJECT_ID, this.projects[0].projectId);
   }
    if(this.projects.length === 1 && this.projects[0].packageName==='Free') {
       this.premiumPackageAvailable=false;
       this.packageName='Free';
       this.isRetainModalActive=true;
    } else if(this.projects.length!==0) {
       if(this.projects.length >= 1 || this.projects[0].packageName==='Premium') {
        this.packageName='Premium';
        this.premiumPackageAvailable=true;
        this.isProjectModalActive=true;
      }
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
    if(error.err_code === 404 || error.err_code === 401 ||error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
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
