import BaseSubscriptionPackage = require('./BaseSubscriptionPackage');

class UserSubscription {
  projectId: Array<string>;
  validity: number;
  numOfProjects: number;
  numOfBuildings: number;
  activationDate: Date;
  purchased: Array<BaseSubscriptionPackage>;
}

export = UserSubscription;
