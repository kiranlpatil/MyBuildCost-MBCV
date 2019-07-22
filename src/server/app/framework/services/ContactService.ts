import * as express from 'express';
import IAddPoolCar = require('../dataaccess/mongoose/ContactUs');
import AddPoolCarRepository = require('../dataaccess/repository/ContactRepository');
import UserService = require('./UserService');
import MailAttachments = require('../shared/sharedarray');
import SendMailService = require('./mailer.service');
import Messages = require('../shared/messages');
import { SentMessageInfo } from 'nodemailer';

let config = require('config');
class ContactService {

    private addpoolCarRepository: AddPoolCarRepository;
    private user : SendMailService;

    constructor() {
        this.addpoolCarRepository = new AddPoolCarRepository();
    }

    public createAddPoolCarData(addcarpool: IAddPoolCar, callback: (error: any, response: any) => void) {
        this.addpoolCarRepository.create(addcarpool, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }

    public getAllAddPoolCarData(callback: (error: any, response: any) => void) {
        this.addpoolCarRepository.retrieve({}, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }

    public getAddPoolCarDataById(carId: any, callback: (error: any, response: any) => void) {
        this.addpoolCarRepository.findById(carId, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }

    public updateAddPoolCarData(carId: any, updatedUser: IAddPoolCar, callback: (error: any, response: any) => void) {
        this.addpoolCarRepository.update(carId, updatedUser, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }

 public sendMail1(field: any, callback: (error: any, result: SentMessageInfo) => void) {
    let sendMailService = new SendMailService();
    let data: Map<string, string> = new Map([['$applicationLink$', config.get('application.mail.host')],
  ['$email$', field.emailId], ['$first_name$', field.companyName], ['$message$', field.type], ['$contact_number$', field.contactNumber]]);
    let attachment = MailAttachments.AttachmentArray;
    let subject = '';
    let mailto = 'bigslicetechnologies@gmail.com';
    if (field.type === 'Support Team') {
      subject = Messages.EMAIL_SUBJECT_SUPPORT;
    } else if (field.type === 'Sales') {
      subject = Messages.EMAIL_SUBJECT_SALES;
    } else {
      subject = Messages.EMAIL_SUBJECT_ESTIMATION;
    }
    sendMailService.send(mailto, subject, 'mbccontactus.mail.html', data, attachment, callback);
  }
}

Object.seal(ContactService);
export = ContactService;
