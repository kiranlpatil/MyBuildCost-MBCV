import BaseSubscriptionPackage = require('./BaseSubscriptionPackage');

class SubscriptionPackage {
  _id?:string;
  basePackage: BaseSubscriptionPackage;
  addOnPackage: BaseSubscriptionPackage;
}
export = SubscriptionPackage;
