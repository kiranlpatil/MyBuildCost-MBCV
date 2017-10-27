import CandidateRepository = require('../dataaccess/repository/candidate.repository');
import UserRepository = require('../dataaccess/repository/user.repository');
import LoggerService = require('../shared/logger/LoggerService');

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
    let md5String = md5(user.email)
    let listId = config.get('TplSeed.mail.CANDIDATE_SIGN_IN_SUCCESS_LISTID');
    mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
      email_address: user.email,
      status: 'subscribed',
      merge_fields: {
        'FNAME': user.first_name,
        'LNAME': user.last_name
      }
    }).then(function (results: any) {
      _loggerService.logInfo(results);
    })
      .catch(function (err: any) {
        _loggerService.logError(err);
      })
  }

  onCandidatePofileSubmitted(user: any, isSubmitted:boolean,isEditingProfile: boolean) {
    if (!isEditingProfile && isSubmitted) {
      let md5String = md5(user.email)
      let listId = config.get('TplSeed.mail.CANDIDATE_PROFILE_SUBMIT_SUCCESS_LISTID');
      mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
        email_address: user.email,
        status: 'subscribed',
        merge_fields: {
          'FNAME': user.first_name,
          'LNAME': user.last_name
        }
      }).then(function (results: any) {
        _loggerService.logInfo(results);

      })
        .catch(function (err: any) {
          _loggerService.logError(err);

        })
    }

  }
  onCronJobCandidateProfileTriggered(profile_update_track:number,listId:string) {

    this.candidateRepository = new CandidateRepository();
    this.userRepository = new UserRepository();

    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);


    this.candidateRepository.retrieveWithIncluded({
      'profile_update_tracking': profile_update_track,
      'lastUpdateAt':{$lt:new Date(),$gt:new Date(yesterday)}
    }, {'userId': 1}, (err:any, res:any) => {
      if (err) {
        _loggerService.logError(err);

      } else {
        for (let item of res) {
          this.userRepository.retrieveWithIncluded({'_id': item.userId}, {'email': 1}, (err:any, res:any) => {
            if(err) {
              _loggerService.logError(err);
            }else {
              this.triggerMailChimpService(res[0].email, listId);
            }

          });
        }
      }
    });


}

  triggerMailChimpService(email:string,listId:any) {
    let md5String = md5(email)
    mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
      email_address: email,
      status: 'subscribed',
    }).then(function (results: any) {
      _loggerService.logInfo(results);
    })
      .catch(function (err: any) {
        _loggerService.logError(err);
      })
  }
}
