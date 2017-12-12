import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import UserRepository = require('../dataaccess/repository/user.repository');
import LoggerService = require('../shared/logger/LoggerService');
import { CandidateProfileCompletionInPercentage } from '../shared/sharedconstants';
import { CandidateDetail } from '../../../../client/app/user/models/candidate-details';

let config = require('config');
let loggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');


export class MailChimpMailerService {

  onCandidateSignSuccess(user: CandidateDetail) {
    console.log(user);
    let listId = config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_SIGN_IN_SUCCESS_LISTID');
    this.triggerMailChimpService(user, listId);
  }

  onCandidatePofileSubmitted(user:CandidateDetail) {
      let listId = config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_PROFILE_SUBMIT_SUCCESS_LISTID');
      this.triggerMailChimpService(user, listId);
  }

  sendNotificationToCandidateForIncompleteProfile(profileComplettionInPercent: CandidateProfileCompletionInPercentage,
                                                  listId: string, fromDate:Date, toDate: Date) {
    let userRepository = new UserRepository();
    let candidateRepository = new CandidateRepository();
    candidateRepository.getLatestCandidatesWithIncompleteProfile(profileComplettionInPercent,
      fromDate, toDate,(err:any, result:any) => {
        if (err) {
          loggerService.logError(err);
          return;
        }
        let CandidateUserIds = result.map(({userId}:any) => userId);
        userRepository.getLatestCandidatesInfoForIncompleteProfile(CandidateUserIds,(err:any,res:any)=> {
          if (err) {
            loggerService.logError(err);
            return;
          }
          for (let candidateInfo of res) {
            this.triggerMailChimpService(candidateInfo, listId);
          }
        });
      });
  }

  triggerMailChimpService(data: CandidateDetail, listId: string) {
    if (data !== null && data !== undefined) {
      let mailchimp = require('mailchimp-api-v3');
      let mailchimpClient = new mailchimp(config.get('TplSeed.mail.MAIL_CHIMP_SERVICE_KEY'));
      let md5 = require('md5');
      let md5String = md5(data.email);
      mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
          'FNAME': data.first_name,
          'LNAME': data.last_name
        }
      }).then(function (results: any) {
        loggerService.logInfo('Mailchimp Triggered Successfully ' + ' emailId: ' + data.email + '  listId: ' + listId);
        loggerService.logDebug(results);
      }).catch(function (err: any) {
        loggerService.logError('Mailchimp Trigger failed ' + ' emailId: ' + data.email + '  listId: ' + listId);
        loggerService.logError(err);
      });
    }
  }
}
