class UserSubscriptionForRA {
  activationDate: Date;
  expiryDate: Date;
  name: string;
  description: string;
  validity: number;
  cost: number;
  noOfDaysToExpiry : number;
  expiryMsgForPackage: string = null;
  warningMsgForPackage: string = null;
  isPackageExpired :boolean = false;
  testUser: boolean = false;
  constructor() {
  }
}

export = UserSubscriptionForRA;
