
class ProjectSubscriptionDetails {
  projectName: string;
  projectId: string;
  expiryDate : Date;
  expiryMessage : string = null;
  warningMessage : string = null;
  numOfDaysToExpire : number;
  numOfBuildingsAllocated : number;
  numOfBuildingsRemaining : number;
  packageName:string;
  addBuildingDisable?:boolean;
  activeStatus:boolean;
}
export = ProjectSubscriptionDetails;
