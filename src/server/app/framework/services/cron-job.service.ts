import LoggerService = require('../shared/logger/LoggerService');
import { MailChimpMailerService } from './mailchimp-mailer.service';
import {CandidateProfileUpdateTrackServerSide} from '../shared/sharedconstants';

let CronJob = require('cron').CronJob;
let config = require('config');
let  _loggerService: LoggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');



export class CronJobService {

  OnCronJobStart() {
    let mailChimpMailerService=new MailChimpMailerService();
    let sendingMailOnProfileUpdate = new CronJob('00 30 23 * * 0-6', function () {
      mailChimpMailerService. onCronJobCandidateProfileTriggered(CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_AREA_OF_WORK,config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_PROFILE_SUBMIT_25%_LISTID'));
      mailChimpMailerService. onCronJobCandidateProfileTriggered(CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_CAPABILITIES,config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_PROFILE_SUBMIT_50%_LISTID'));
      mailChimpMailerService. onCronJobCandidateProfileTriggered(CandidateProfileUpdateTrackServerSide.STEP_IS_COMPLETED_COMPLEXITIES,config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_PROFILE_SUBMIT_75%_LISTID'));
      mailChimpMailerService. onCronJobCandidateProfileTriggered(CandidateProfileUpdateTrackServerSide.STEP_IS_ENTER_KEY_SKILLS,config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_PROFILE_SUBMIT_95%_LISTID'));
      }, null, false,'Asia/Kolkata');
    sendingMailOnProfileUpdate.start();
  }
}
