import SubscriptionRepository = require('../dataaccess/repository/SubscriptionRepository');
import BaseSubscriptionPackage = require('../dataaccess/model/project/Subscription/BaseSubscriptionPackage');
import messages  = require('../../applicationProject/shared/messages');
import Constants = require('../shared/constants');
import { PayUMoneyModel } from '../../framework/dataaccess/model/PayUMoneyModel';

let payumoney = require('payumoney-node');
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

  makePayUMoneyPayment(paymentBody : PayUMoneyModel, callback:(error: any, result: any) => void) {

    let MERCHANT_KEY = config.get('payUMoney.merchentKey');
    let MERCHANT_SALT = config.get('payUMoney.saltKey');
    let AUTHORIZATION_HEADER = config.get('payUMoney.authHeader');
    let IS_PROD_MODE = config.get('payUMoney.isProdMode');

    payumoney.setKeys(MERCHANT_KEY, MERCHANT_SALT, AUTHORIZATION_HEADER);
    payumoney.isProdMode(IS_PROD_MODE);

    let payUMoneyModel = new PayUMoneyModel();

    payUMoneyModel.firstname = paymentBody.firstname;
    payUMoneyModel.lastname = paymentBody.lastname;
    payUMoneyModel.email = paymentBody.email;
    payUMoneyModel.phone = paymentBody.phone;
    payUMoneyModel.productinfo = paymentBody.productinfo;
    payUMoneyModel.amount = paymentBody.amount;
    payUMoneyModel.txnid = this.generateTransactionId(30);
    payUMoneyModel.surl = 'http://9f79c8c5.ngrok.io/api/subscription/pay/success';
    payUMoneyModel.furl = 'http://9f79c8c5.ngrok.io/api/subscription/pay/failure';


    payumoney.makePayment(payUMoneyModel, function(error:any, response:any) {
      if (error) {
        // Some error
        console.log(response);
        callback(error, null);
      } else {
        // Payment redirection link
        console.log(response);
        callback(null, { 'data' : response });
      }
    });
  }

  generateTransactionId(length : number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}

export = SubscriptionService;
