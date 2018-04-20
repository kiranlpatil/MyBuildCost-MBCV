import BaseSubscriptionPackage = require('./BaseSubscriptionPackage');

class SubscriptionPackage {
  _id?:string;
  basePackage: BaseSubscriptionPackage;
  addBuilding: BaseSubscriptionPackage;
  renewal: BaseSubscriptionPackage;
}
export = SubscriptionPackage;
