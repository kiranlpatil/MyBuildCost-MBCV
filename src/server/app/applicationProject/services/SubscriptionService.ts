import SubscriptionRepository = require('../dataaccess/repository/SubscriptionRepository');
import BaseSubscriptionPackage = require('../dataaccess/model/project/Subscription/BaseSubscriptionPackage');
import messages  = require('../../applicationProject/shared/messages');
import Constants = require('../shared/constants');
import { PayUMoneyModel } from '../../framework/dataaccess/model/PayUMoneyModel';
import UserService = require('../../framework/services/UserService');
import Messages = require('../shared/messages');
import SendMailService = require("../../framework/services/mailer.service");
import MailAttachments = require("../../framework/shared/sharedarray");


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
    payUMoneyModel.surl = config.get('application.mail.host') + 'api/subscription/payment/success';
    payUMoneyModel.furl = config.get('application.mail.host') + 'api/subscription/payment/failure';


    this.makePayUMoneyPaymentRequest(payUMoneyModel, function(error:any, response:any) {
      if (error) {
        logger.error('Error in making payment for Rate Analysis : '+JSON.stringify(error));
        callback(error, null);
      } else {
        logger.debug('payment successfull for Rate Analysis : '+JSON.stringify(response));
        callback(null, response);
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

  makeRAPayment(paymentBody : PayUMoneyModel, callback:(error: any, result: any) => void) {

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
    let deviceType = paymentBody.deviceType;
    let payUMoneyURL = config.get('application.backendAPI') + 'api/subscription/rapayment/user/';
    payUMoneyModel.surl = payUMoneyURL + paymentBody.userId +'/success/' + deviceType;
    payUMoneyModel.furl = payUMoneyURL + paymentBody.userId +'/failure/' + deviceType;

    this.makePayUMoneyPaymentRequest(payUMoneyModel, function(error:any, response:any) {
      if (error) {
        // Some error
        console.log(response);
        callback(error, null);
      } else {
        // Payment redirection link
        console.log(response);
        callback(null, response);
      }
    });
  }

  makePayUMoneyPaymentRequest(paymentBody: any, callback: (error: any, result:any)=> void) {
    payumoney.makePayment(paymentBody, function(error:any, response:any) {
      if (error) {
        logger.error('Error in making payment for Rate Analysis : '+JSON.stringify(error));
        callback(error, null);
      } else {
        logger.debug('payment successfull for Rate Analysis : '+JSON.stringify(response));
        callback(null, { 'data' : response });
      }
    });
  }

  updatePackageCost(packageName:string, packageCost:number, callback:(error:any,result:any)=>void) {
    logger.info('Subscription service, updatePackageCost has been hit');
    let query:any;
    let updateQuery:any;
    switch(packageName) {
      case "Trial":
      case "Premium":
      case "RAPremium":
      case "Free":
        query = {'basePackage.name': packageName};
        updateQuery = {$set: {'basePackage.cost': packageCost}};
        break;
      case "Add_building":
      case "RenewProject":
        query = {'addOnPackage.name': packageName};
        updateQuery = {$set: {'addOnPackage.cost': packageCost}};
        break;
      default:
        return callback(null,"No such package exists !");
    }
      this.subscriptionRepository.findOneAndUpdate(query, updateQuery, {new: true}, (error, Response) => {
        logger.info('Project service, findOneAndUpdate has been hit');
        let sendMailService = new SendMailService();
        if (error) {
          callback(error, null);
        } else {
          callback(null, Response);
          let htmlTemplate = 'changed-package-cost-mail.html';
          let data: Map<string, string> = new Map([['$applicationLink$', config.get('application.mail.host')],
            ['$name$', packageName], ['$cost$', packageCost], ['$link$', 'http://mybuildcost.co.in/']]);
          let attachment = MailAttachments.WelcomeAboardAttachmentArray;
          sendMailService.send(config.get('application.mail.TPLGROUP_MAIL'), Messages.CHANGED_SUBSCRIPTION_COST, htmlTemplate, data, attachment,
            (err: any, result: any) => {
              if (err) {
                logger.error(JSON.stringify(err));
              }
              logger.debug('Sending Mail : ' + JSON.stringify(result));
            }, config.get('application.mail.BUILDINFO_ADMIN_MAIL'));
          console.log(JSON.stringify(Response));
        }
      });
    }
}

export = SubscriptionService;
