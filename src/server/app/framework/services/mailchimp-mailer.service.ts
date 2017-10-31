import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import UserRepository = require('../dataaccess/repository/user.repository');
import LoggerService = require('../shared/logger/LoggerService');
import {CandidateProfileUpdateTrackServerSide} from "../shared/sharedconstants";

let _loggerService: LoggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');
var CronJob = require('cron').CronJob;
var config = require('config');

let mailchimp = require('mailchimp-api-v3')
let mailchimpClient = new mailchimp(config.get('TplSeed.mail.MAIL_CHIMP_SERVICE_KEY'));
let md5 = require('md5');

export class MailChimpMailerService {
  private candidateRepository: CandidateRepository;
  private userRepository: UserRepository;

  onCandidateSignSuccess(user: any) {
    let listId = config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_SIGN_IN_SUCCESS_LISTID');
    this.triggerMailChimpService(user, listId);
  }
 /* onRecruiterSignUpSuccess(user: any) {
    let listId = config.get('TplSeed.mail.MAILCHIMP_RECRUITER_SIGN_IN_SUCCESS_LISTID');
    let md5String = md5(config.get('TplSeed.mail.ADMIN_MAIL'))
    mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
      email_address: config.get('TplSeed.mail.ADMIN_MAIL'),
      status: 'subscribed',
      merge_fields: {
        'CNAME': user.company_name,
        'CEMAIL':user.email
      }
    }).then(function (results: any) {
      _loggerService.logInfo(results);
    })
      .catch(function (err: any) {
        _loggerService.logError(err);
      })

    this.triggerMailChimpService(user, listId);
  }*/

  onCandidatePofileSubmitted(user: any, isSubmitted:boolean,isEditingProfile: boolean) {
    if (!isEditingProfile && isSubmitted) {
      let listId = config.get('TplSeed.mail.MAILCHIMP_CANDIDATE_PROFILE_SUBMIT_SUCCESS_LISTID');
      this.triggerMailChimpService(user, listId);
    }

  }
  onCronJobCandidateProfileTriggered(profile_update_track:number,listId:string) {
    this.candidateRepository = new CandidateRepository();
    this.userRepository = new UserRepository();

    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    var data;
    let trackNumber=CandidateProfileUpdateTrackServerSide.STEP_IS_ENTER_KEY_SKILLS;
    let trackNumberNotSubmitted=CandidateProfileUpdateTrackServerSide.STEP_IS_SUBMIT_DETAILS;
    if(profile_update_track===trackNumber) {
       data = {
        'profile_update_tracking': {$gte:trackNumber,$lt:trackNumberNotSubmitted},
        'lastUpdateAt': {$lt: new Date(), $gt: new Date(yesterday)}
      };
    }else {
      data = {
        'profile_update_tracking': profile_update_track,
        'lastUpdateAt': {$lt: new Date(), $gt: new Date(yesterday)}
      };
    }

    this.candidateRepository.retrieveWithIncluded(data, {'userId': 1}, (err:any, res:any) => {
      if (err) {
        _loggerService.logError(err);

      } else {
        for (let item of res) {
          this.userRepository.retrieveWithIncluded({'_id': item.userId}, {'email': 1,'first_name':1,'last_name':1}, (err:any, res:any) => {
            if(err) {
              _loggerService.logError(err);
            }else {
              this.triggerMailChimpService(res[0], listId);
            }

          });
        }
      }
    });
  }

  triggerMailChimpService(data:any,listId:any) {
    let md5String = md5(data.email)
    mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
      'FNAME': data.first_name,
        'LNAME':data.last_name
    }
    }).then(function (results: any) {
      _loggerService.logInfo(results);
    })
      .catch(function (err: any) {
        _loggerService.logError(err);
      })
  }
}
