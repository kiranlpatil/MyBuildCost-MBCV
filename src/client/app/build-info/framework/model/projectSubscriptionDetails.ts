export class ProjectSubscriptionDetails {
  projectName: string;
  projectId: string;
  expiryDate : Date;
  expiryMessage : string;
  warningMessage : string;
  numOfDaysToExpire : number;
  numOfBuildingsAllocated : number;
  numOfBuildingsRemaining : number;
  packageName:string;
  addBuildingDisable?:boolean;
  activeStatus:boolean;

}

