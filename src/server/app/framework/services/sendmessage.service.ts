///<reference path="../shared/projectasset.ts"/>
import Messages=require("../shared/messages");
import ProjectAsset = require("../shared/projectasset");
import UserRepository = require("../dataaccess/repository/user.repository");
var config = require('config');
var authKey= config.get('TplSeed.messaging.authKey');
var senderId = config.get('TplSeed.messaging.senderId');
var routerNumber = config.get('TplSeed.messaging.routerNumber');
var msg91 = require("msg91")(authKey,senderId,routerNumber);


class SendMessageService {
    private userRepository:UserRepository;
    app_name: string;
    constructor()
    {
        this.app_name = ProjectAsset.APP_NAME;
        this.userRepository = new UserRepository();
    }
    sendMessage(mobileNo:any, callback:any) {

        console.log("Send sms on", mobileNo);
      var otp =Math.floor((Math.random() * 99999) + 100000);
        console.log("otp is", otp);


        var message = "The One Time Password(OTP) for "+" "+this.app_name+" "+"account is"+" "+otp+" "+".Use this OTP to verify your account. ";
        console.log("msg sent to user:", message);
        msg91.send(mobileNo, message, function (err:any, response:any) {
            if (err) {
                callback(new Error(Messages.MSG_ERROR_MESSAGE_SENDING), null);
            }
            else {
                callback(null, response);
            }
        });
    }

    sendMessageDirect(Data:any, callback:any) {

        console.log("Send sms on", Data.mobileNo);

      var message = "The One Time Password(OTP) for "+" "+this.app_name+" "+"account is"+" "+Data.otp+" "+".Use this OTP to verify your account. ";
        console.log("msg sent to user:", message);
        msg91.send(Data.mobileNo, message, function (err:any, response:any) {
            if (err) {
                callback(new Error(Messages.MSG_ERROR_MESSAGE_SENDING), null);
            }
            else {
                callback(null, response);
            }
        });
    }

  sendChangeMobileMessage(Data:any, callback:any) {

    console.log("Send sms on", Data.mobileNo);
    var message = "The One Time Password(OTP) to change your number from"+" "+Data.current_mobile_number+" "+"to"+" "+Data.mobileNo+" "+"of"+" "+this.app_name+" "+"account is"+" "+Data.otp+" "+".Use this OTP to complete verification.";
    console.log("msg sent to user:", message);
    msg91.send(Data.mobileNo, message, function (err:any, response:any) {
      if (err) {
        callback(new Error(Messages.MSG_ERROR_MESSAGE_SENDING), null);
      }
      else {
        callback(null, response);
      }
    });
  }

}

Object.seal(SendMessageService);
export = SendMessageService;
