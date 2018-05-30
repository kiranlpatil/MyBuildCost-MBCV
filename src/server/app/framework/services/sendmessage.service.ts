///<reference path="../shared/projectasset.ts"/>
import Messages=require('../shared/messages');
import ProjectAsset = require('../shared/projectasset');
import UserRepository = require('../dataaccess/repository/UserRepository');
let config = require('config');
let authKey = config.get('application.messaging.authKey');
let senderId = config.get('application.messaging.senderId');
let routerNumber = config.get('application.messaging.routerNumber');
let msg91 = require('msg91')(authKey, senderId, routerNumber);


class SendMessageService {
  app_name: string;
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.app_name = ProjectAsset.APP_NAME;
  }

  sendMessage(mobileNo: any, callback: any) {
    let otp = Math.floor((Math.random() * 99999) + 100000);
    let message = 'The One Time Password(OTP) for ' + ' ' + this.app_name + ' ' + 'account is' + ' ' + otp
    + ' ' + '.Use this OTP to verify your account.';
    msg91.send(mobileNo, message, function (err: any, response: any) {
      if (err) {
        callback(new Error(Messages.MSG_ERROR_MESSAGE_SENDING), null);
      } else {
        callback(null, response);
      }
    });
  }

  sendMessageDirect(Data: any, callback: any) {

    console.log('Send sms on', Data.mobileNo);

    let message = 'The One Time Password(OTP) for ' + ' ' + this.app_name + ' ' + 'account is' + ' ' + Data.otp + ' '
      + '.Use this OTP to verify your account.';
    console.log('msg sent to user :', message);
    msg91.send(Data.mobileNo, message, function (err: any, response: any) {
      if (err) {
        callback(new Error(Messages.MSG_ERROR_MESSAGE_SENDING), null);
      } else {
        callback(null, response);
      }
    });
  }

  sendChangeMobileMessage(Data: any, callback: any) {

    let message = 'The One Time Password(OTP) to change your number from '+ Data.current_mobile_number
      +' to '+ Data.mobileNo +' of your ' + this.app_name +' account is '+ Data.otp
      + '.Use this OTP to complete verification.';

    msg91.send(Data.mobileNo, message, function (err: any, response: any) {
      if (err) {
        callback(new Error(Messages.MSG_ERROR_MESSAGE_SENDING), null);
      } else {
        callback(null, response);
      }
    });
  }

}

Object.seal(SendMessageService);
export = SendMessageService;
