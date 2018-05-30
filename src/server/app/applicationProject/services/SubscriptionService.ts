import SubscriptionRepository = require("../dataaccess/repository/SubscriptionRepository");

let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Subscription Service');
class SubscriptionService {
  private subscriptionRepository = new SubscriptionRepository();

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
  }
  addSubscriptionPackage(subscriptionPackage,  callback: (error: any, result: any) => void) {
    this.subscriptionRepository.create(subscriptionPackage, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        logger.info('Subscription service, create has been hit');
        let projectId = res._id;
        callback(null, res);
      }
    });
  }

  getSubscriptionPackageByName(basePackageName : string, callback:(error: any, result: any) => void) {
    let query = { 'basePackage.name': basePackageName};
    this.subscriptionRepository.retrieve(query, callback);
  }
}

export = SubscriptionService;
