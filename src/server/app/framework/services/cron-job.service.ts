import LoggerService = require('../shared/logger/LoggerService');
import { MailChimpMailerService } from './mailchimp-mailer.service';

var CronJob = require('cron').CronJob;
var config = require('config');
var  _loggerService: LoggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');



export class CronJobService {

  OnCronJobStart() {
    var mailChimpMailerService=new MailChimpMailerService();
    var sendingMailOnProfileUpdate = new CronJob('00 10 00 * * 0-6', function () {
      mailChimpMailerService. onCronJobCandidateProfileTriggered(2,config.get('TplSeed.mail.CANDIDATE_PROFILE_SUBMIT_25%_LISTID'));
      mailChimpMailerService. onCronJobCandidateProfileTriggered(3,config.get('TplSeed.mail.CANDIDATE_PROFILE_SUBMIT_50%_LISTID'));
      }, null, false,'Asia/Kolkata');
    sendingMailOnProfileUpdate.start();
  }
}
