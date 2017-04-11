import {Component, OnInit} from '@angular/core';
import {ValueConstant, LocalStorage} from '../../../framework/shared/constants';
import {TestService} from '../test.service';
import {ComplexityService} from '../complexity.service';
import {MyIndustryService} from '../industry-service';
import {MyRoleService} from '../role-service';
import {MessageService} from '../../../framework/shared/message.service';
import {CapabilityListService} from './capability-list.service';
import {MyCapabilityService} from '../capability-service';
import {LocalStorageService} from '../../../framework/shared/localstorage.service';
import {MyJobRequirementService} from '../jobrequirement-service';
import {Message} from '../../../framework/shared/message';
import {Industry} from "../model/industry";
import {IndustryListService} from "../industry-list/industry-list.service";
import {Role} from "../model/role";
import {Capability, SecondaryCapability} from "../model/capability";
import {ProfileCreatorService} from "../profile-creator/profile-creator.service";
import {Candidate} from "../model/candidate";

@Component({
  moduleId: module.id,
  selector: 'cn-capibility-list',
  templateUrl: 'capability-list.component.html',
  styleUrls: ['capability-list.component.css']
})

export class CapabilityListComponent implements OnInit {
  private capabilities:string[] = new Array();
  private primaryCapabilities:string[] = new Array();
  private secondaryCapabilities:string[] = new Array();
  private isShowCapability:boolean = false;
  private isPrimary:boolean[] = new Array();
  private isSecondary:boolean[] = new Array();
  private industry:string;
  private capabilityData:any;
  private roles:any;
  private disablebutton:boolean = true;
  private iscandidate:boolean = false;
  private showfield:boolean = false;
  private industryRoles:Industry = new Industry();
  private savedCapabilities:Capability[] = new Array();

  constructor(private testService:TestService,
              private industryService:IndustryListService,
              private complexityService:ComplexityService,
              private myIndustryService:MyIndustryService,
              private roleservice:MyRoleService,
              private capabilityListServive:CapabilityListService,
              private myCapabilityListService:MyCapabilityService,
              private myJobrequirementService:MyJobRequirementService,
              private messageService:MessageService,
              private profileCreatorService:ProfileCreatorService) {

    testService.showTest$.subscribe(
      data => {
        this.isShowCapability = data;
      }
    );


    myIndustryService.showTest$.subscribe(
      data => {
        this.industry = data;
        this.industryRoles.name = data;
      }
    );
    roleservice.showTest$.subscribe(
      data => {
        this.roles = data;
        this.capabilityListServive.getCapability(this.industry, this.roles)
          .subscribe(
            capabilitylist => this.onCapabilityListSuccess(capabilitylist.data),
            error => this.onError(error));
      }
    );
    myJobrequirementService.showTest$.subscribe(
      data => {
        this.isShowCapability = true;
        this.roles = data.role;
        this.industry = data.industry;
        this.capabilityListServive.getCapability(this.industry, this.roles)
          .subscribe(
            capabilitylist => this.onCapabilityListSuccess(capabilitylist.data),
            error => this.onError(error));
      }
    );
  }

  ngOnInit() {
    if (LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE) === "true") {
      this.profileCreatorService.getCandidateDetails()
        .subscribe(
          candidateData => this.OnCandidateDataSuccess(candidateData.data[0]),
          error => this.onError(error));

    }
  }

  OnCandidateDataSuccess(candidateData:Candidate) {
    debugger

    setTimeout(()=> {
      if (candidateData.industry.roles.length > 0) {
        for (let role of candidateData.industry.roles) {
          if (role.capabilities.length > 0) {
            for (let capability of role.capabilities) {
              this.isPrimary[this.capabilities.length] = true;
              this.capabilities.push(secondary);
//              this.savedCapabilities.push(capability);
              this.primaryCapabilities.push(capability.name);
            }
            this.showfield = true;
            this.myCapabilityListService.change(this.primaryCapabilities);
            this.complexityService.change(true);
          }
        }
      }
      if (candidateData.secondaryCapability.length > 0) {
        for (let secondary of candidateData.secondaryCapability) {
          this.isSecondary[this.capabilities.length] = true;
          this.capabilities.push(secondary);
        }
      }
    }, 5000);
  }

  onCapabilityListSuccess(data:any) {
    debugger
    this.capabilityData = data;
    console.log(this.capabilityData);
    if (data !== undefined && data.length > 0) {
      for (let role of data) {
        for (let capability of role.capabilities) {
          this.capabilities.push(capability.name);
        }
      }
    }
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }

  selectedOption(selectedCapability:any) {
    this.disablebutton = false;
    if (selectedCapability.target.checked) {
      if (this.primaryCapabilities.length < ValueConstant.MAX_CAPABILITIES) {
        this.primaryCapabilities.push(selectedCapability.target.value);
        this.isPrimary[this.capabilities.indexOf(selectedCapability.target.value)] = true;
      } else {
        this.secondaryCapabilities.push(selectedCapability.target.value);
        this.isSecondary[this.capabilities.indexOf(selectedCapability.target.value)] = true;
      }
    } else {
      for (let capability of this.primaryCapabilities) {
        if (capability === selectedCapability.target.value) {
          this.isPrimary[this.capabilities.indexOf(selectedCapability.target.value)] = false;
          this.primaryCapabilities.splice(this.primaryCapabilities.indexOf(capability), 1);
        }
      }
      for (let capability of this.secondaryCapabilities) {
        if (capability === selectedCapability.target.value) {
          this.isSecondary[this.capabilities.indexOf(selectedCapability.target.value)] = false;
          this.secondaryCapabilities.splice(this.secondaryCapabilities.indexOf(capability), 1);
        }
      }
    }


  }


  searchCapabilityData(capabilityName:string, isPrimary:boolean) {
    if (isPrimary) {
      for (let item of this.capabilityData) {
        for (let subitem of item.capabilities) {
          if (capabilityName === subitem.name) {
            var roleNotFound = true;
            if (this.industryRoles.roles.length > 0) {
              for (let role of this.industryRoles.roles) {
                if (role.name === subitem.roleName) {
                  var capab:Capability = new Capability();
                  capab.name = subitem.name;
                  role.capabilities.push(capab);
                  roleNotFound = false;
                  break;
                }
              }
            }
            if (roleNotFound) {
              var role1:Role = new Role();
              role1.name = subitem.roleName;
              var capab1:Capability = new Capability();
              capab1.name = subitem.name;
              role1.capabilities.push(capab1);
              this.industryRoles.roles.push(role1);
            }
          }

        }
      }
    } else {
      for (let item of this.capabilityData) {
        for (let subitem of item.capabilities) {
          if (capabilityName === subitem.name) {
            var roleNotFound = true;
            if (this.industryRoles.roles.length > 0) {
              for (let role of this.industryRoles.roles) {
                if (role.name === subitem.roleName) {
                  var secondary:SecondaryCapability = new SecondaryCapability();
                  secondary.name = capabilityName;
                  role.secondaryCapabilities.push(secondary);
                  roleNotFound = false;
                  break;
                }
              }
            }
            if (roleNotFound) {
              var role1:Role = new Role();
              role1.name = subitem.roleName;
              var secondary:SecondaryCapability = new SecondaryCapability();
              secondary.name = capabilityName;
              role1.secondaryCapabilities.push(secondary);
              this.industryRoles.roles.push(role1);
            }
          }
        }
      }
    }
  }

  createAndSave() {
    for (let capability of this.primaryCapabilities) {
      this.searchCapabilityData(capability,true);
    }
    for (let capability of this.secondaryCapabilities) {
      this.searchCapabilityData(capability,false);
    }
    this.myCapabilityListService.change(this.primaryCapabilities);
    this.showfield = true;
    this.disablebutton = true;
    this.complexityService.change(true);
    this.industryService.addIndustryProfile(this.industryRoles).subscribe(
      user => {
        console.log(user);
      },
      error => {
        console.log(error);
      });

  }

}
