import SubscriptionRepository = require('../dataaccess/repository/SubscriptionRepository');
import BaseSubscriptionPackage = require('../dataaccess/model/project/Subscription/BaseSubscriptionPackage');
import messages  = require('../../applicationProject/shared/messages');
import Constants = require('../shared/constants');

let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('subscription Service');
class SubscriptionService {
  private subscriptionRepository = new SubscriptionRepository();

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
  }
  addSubscriptionPackage(subscriptionPackage: any,  callback: (error: any, result: any) => void) {
    this.subscriptionRepository.create(subscriptionPackage, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        logger.info('subscription service, create has been hit');
        let projectId = res._id;
        callback(null, res);
      }
    });
  }

  getBaseSubscriptionPackageList(callback: (error: any, subscriptionPackageList: Array<BaseSubscriptionPackage>) => void) {
    let query = [
      {$unwind: '$basePackage'},
      {$project: {'basePackage': 1, _id:0}}
    ];

    this.subscriptionRepository.aggregate(query, (error, subscriptionPackageList) => {
      if (error) {
        callback(error, null);
      } else {
        if (subscriptionPackageList.length > 0) {
          callback(error, subscriptionPackageList);
        }else {
          let error = new Error();
          error.message = messages.MSG_ERROR_SUBSCRIPTION_PACKAGES_DETAILS_ARE_NOT_DEFINED;
          callback(error, null);
        }
      }
    });
  }

  getSubscriptionPackageByName(packageName : string, packageType:string, callback:(error: any, result: any) => void) {
    let query : any;
    if(packageType === 'BasePackage') {
      query = { 'basePackage.name': packageName};
    } else {
      query = { 'addOnPackage.name': packageName};
    }
    this.subscriptionRepository.retrieve(query, callback);
  }
}

export = SubscriptionService;
