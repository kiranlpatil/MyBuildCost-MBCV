/**
 * Created by techprime002 on 8/28/2017.
 */
import UserRepository = require('../dataaccess/repository/user.repository');
import SendMailService = require('./sendmail.service');
import Messages = require('../shared/messages');
import MailAttachments = require('../shared/sharedarray');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import UsersClassModel = require('../dataaccess/model/users');
import CandidateService = require('./candidate.service');
import RecruiterService = require('./recruiter.service');
import IndustryModel = require('../dataaccess/model/industry.model');
import IndustryRepository = require('../dataaccess/repository/industry.repository');
import CandidateModelClass = require('../dataaccess/model/candidateClass.model');
import RecruiterClassModel = require('../dataaccess/model/recruiterClass.model');
import CandidateClassModel = require('../dataaccess/model/candidate-class.model');
import UserService = require("./user.service");
let config = require('config');
let fs = require('fs');
let usestracking = require('uses-tracking');
let spawn = require('child_process').spawn;

let mongoExport = '/usr/bin/mongoexport';
///let db = config.get('TplSeed.database.name');
let db = 'Jobmosis-staging';
let username = 'admin';
let password = 'jobmosisadmin123';

class AdminService {
  company_name: string;
  private userRepository: UserRepository;
  private industryRepositiry: IndustryRepository;
  private recruiterRepository: RecruiterRepository;
  private usesTrackingController: any;

  constructor() {
    this.userRepository = new UserRepository();
    this.industryRepositiry = new IndustryRepository();
    this.recruiterRepository = new RecruiterRepository();
    let obj: any = new usestracking.MyController();
    this.usesTrackingController = obj._controller;
  }

  getCountOfUsers(item: any, callback: (error: any, result: any) => void) {
    try {
      let candidateService = new CandidateService();
      let recruiterService = new RecruiterService();
      let users: UsersClassModel = new UsersClassModel();
      let findQuery = new Object();

      candidateService.getTotalCandidateCount((error, candidateCount) => {
        if (error) {
          callback(error, null);
        } else {
          users.totalNumberOfCandidates = candidateCount;
          recruiterService.getTotalRecruiterCount((error, recruiterCount) => {
            if (error) {
              callback(error, null);
            } else {
              users.totalNumberOfRecruiters = recruiterCount;
              callback(null, users);
            }
          });
        }
      });
    }
    catch
      (e) {
      callback(e, null);
    }
  };

  getRecruiterDetails(initial: string, callback: (error: any, result: any) => void) {
    try {
      let userService = new UserService();
      let users: UsersClassModel = new UsersClassModel();
      let usersMap: Map<any, any> = new Map();

      let recruiterService = new RecruiterService();
      let recruiters: RecruiterClassModel[] = new Array(0);

      let regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
      let findQuery = {
        'company_name': {
          $regex: regEx
        }
      }
      let sortingQuery = {'company_name': 1, 'company_size': 1};

      let recruiterFields = {
        'userId': 1,
        'company_name': 1,
        'company_size': 1,
        'postedJobs.isJobPosted': 1
      };

      recruiterService.retrieveBySortedOrder(findQuery, recruiterFields, sortingQuery, (error, recruiterResult) => {
        if (error) {
          callback(error, null);
        } else {
          users.totalNumberOfRecruiters = recruiterResult.length;
          if (recruiterResult.length == 0) {
            callback(null, users);
          }
          else {
            let userFields = {
              '_id': 1,
              'mobile_number': 1,
              'email': 1,
              'isActivated': 1
            };

            for (let recruiter of recruiterResult) {
              usersMap.set(recruiter.userId.toString(), recruiter);
            }
            userService.retrieveWithLean({'isCandidate': false}, (error, result) => {
              if (error) {
                callback(error, null);
              } else {
                console.log("Fetched all recruiters from users:" + recruiterResult.length);
                for (let user of result) {
                  if (usersMap.get(user._id.toString())) {
                    user.data = usersMap.get(user._id.toString());
                    recruiters.push(user);
                  }
                }

                users.recruiter = recruiters;
                callback(null, users);
              }

            });
          }
        }
      });
    }
    catch
      (e) {
      callback(e, null);
    }
  };

  getCandidateDetails(initial: string, callback: (error: any, result: any) => void) {
    try {
      let userService = new UserService();
      let users: UsersClassModel = new UsersClassModel();
      let usersMap: Map<any, any> = new Map();

      let candidates: CandidateModelClass[] = new Array(0);
      let candidateService = new CandidateService();

      let regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
      let findQuery = {
        'first_name': {
          $regex: regEx
        },
        'isAdmin': false,
        'isCandidate': true
      };
      let included_fields = {
        '_id': 1,
        'first_name': 1,
        'last_name': 1,
        'mobile_number': 1,
        'email': 1,
        'isActivated': 1
      };
      let sortingQuery = {'first_name': 1, 'last_name': 1};

      userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          users.totalNumberOfCandidates = result.length;
          if (result.length == 0) {
            callback(null, users);
          }
          else {
            let value = 0;
            let candidateFields = {
              'userId': 1,
              'jobTitle': 1,
              'isCompleted': 1,
              'isSubmitted': 1,
              'isVisible': 1,
              'location.city': 1
            };
            candidateService.retrieveWithLean({}, candidateFields, (error, candidatesResult) => {
              if (error) {
                callback(error, null);
              } else {
                console.log("Fetched all candidates:" + candidatesResult.length);
                for (let candidate of candidatesResult) {
                  usersMap.set(candidate.userId.toString(), candidate);
                }

                for (let user of result) {
                  user.data = usersMap.get(user._id.toString());
                  candidates.push(user);
                }

                users.candidate = candidates;
                callback(null, users);

              }
            });
          }

        }
      });
    } catch (e) {
      callback(e, null);
    }
  };

  sendAdminLoginInfoMail(field: any, callback: (error: any, result: any) => void) {
    let header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
    let content = fs.readFileSync('./src/server/app/framework/public/adminlogininfo.mail.html').toString();
    let footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
    let mid_content = content.replace('$email$', field.email).replace('$address$', (field.location === undefined) ? 'Not Found' : field.location)
      .replace('$ip$', field.ip).replace('$host$', config.get('TplSeed.mail.host'));


    let mailOptions = {
      from: config.get('TplSeed.mail.MAIL_SENDER'),
      to: config.get('TplSeed.mail.ADMIN_MAIL'),
      cc: config.get('TplSeed.mail.TPLGROUP_MAIL'),
      subject: Messages.EMAIL_SUBJECT_ADMIN_LOGGED_ON + " " + config.get('TplSeed.mail.host'),
      html: header1 + mid_content + footer1
      , attachments: MailAttachments.AttachmentArray
    }
    let sendMailService = new SendMailService();
    sendMailService.sendMail(mailOptions, callback);

  };

  updateUser(_id: string, item: any, callback: (error: any, result: any) => void) {
    this.userRepository.findById(_id, (err: any, res: any) => {
      if (err) {
        callback(err, res);
      } else {
        this.userRepository.update(res._id, item, callback);
      }
    });
  };

  exportCandidateCollection(callback: (err: any, res: any) => void) {
    console.log("inside exportCandidateCollection");
    let stderr: any = '';

    /*let candidateChild = spawn('mongoexport',['--db',db,'--collection','candidates','--type','csv','--fields','_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt','--out','/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates.csv']);*/

    let candidateChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'candidates', '--type', 'csv', '--fields', '_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates.csv']);

    candidateChild.on('exit', function (code: any) {
      if (code != 0) {
        candidateChild.kill();
        callback(new Error(), null);
      } else {
        console.log('candidateChild process closed with code ' + code);
        candidateChild.kill();
        callback(null, 'success');
      }
    });

    candidateChild.stderr.on('data', function (buf: any) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });

  }

  exportCandidateOtherDetailsCollection(callback: (err: any, res: any) => void) {
    console.log("inside exportCandidateDetailsCollection");
    let stderr: any = '';
    /*let candidateOtherDetailsChild = spawn('mongoexport',['--db',db,'--collection','candidates','--type','csv','--fields','userId,capability_matrix','--out','/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates-other-details.csv']);*/
    let candidateOtherDetailsChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'candidates', '--type', 'csv', '--fields', 'userId,capability_matrix', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates-other-details.csv']);

    candidateOtherDetailsChild.on('exit', function (code: any) {
      if (code != 0) {
        candidateOtherDetailsChild.kill();
        callback(new Error(), null);
      } else {
        console.log('candidateOtherDetailsChild process closed with code ' + code);
        candidateOtherDetailsChild.kill();
        callback(null, 'success');
      }
    });

    candidateOtherDetailsChild.stderr.on('data', function (buf: any) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });

  }

  exportUserCollection(userType: string, callback: (err: any, res: any) => void) {
    console.log("inside exportUserCollection");
    let userChild: any;
    let stderr: any = '';

    /*if (userType == 'candidate') {
     userChild = spawn('mongoexport', ['--db',db,'--collection','users','--type','csv','--fields','_id,first_name,last_name,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,complexityIsMustHave,isAdmin,otp,isActivated,temp_mobile','--out','/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/users.csv','--query','{"isCandidate":true}']);
     } else {
     userChild = spawn('mongoexport', ['--db',db,'--collection','users','--type','csv','--fields','_id,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,isAdmin,otp,isActivated,temp_mobile,location,picture','--out','/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/users.csv','--query','{"isCandidate":false}']);
     }*/

    if (userType == 'candidate') {
      userChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields', '_id,first_name,last_name,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,complexityIsMustHave,isAdmin,otp,isActivated,temp_mobile', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv', '--query', '{"isCandidate":true}']);
    } else {
      userChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields', '_id,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,isAdmin,otp,isActivated,temp_mobile,location,picture', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv', '--query', '{"isCandidate":false}']);
    }


    userChild.on('exit', function (code: any) {
      if (code != 0) {
        userChild.kill();
        callback(new Error(), null);
      } else {
        console.log('userChild process closed with code ' + code);
        userChild.kill();
        callback(null, 'success');
      }
    });

    userChild.stderr.on('data', function (buf: any) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });

  }

  exportRecruiterCollection(callback: (err: any, res: any) => void) {
    console.log("inside exportRecruiterCollection");
    let stderr: any = '';

    /*let recruiterChild = spawn('mongoexport', ['--db',db,'--collection','recruiters','--type','csv','--fields','_id,userId,isRecruitingForself,company_name,company_size,company_website,postedJobs,setOfDocuments,company_logo','--out','/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/recruiters.csv']);*/

    let recruiterChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'recruiters', '--type', 'csv', '--fields', '_id,userId,isRecruitingForself,company_name,company_size,company_website,postedJobs,setOfDocuments,company_logo', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiters.csv']);

    recruiterChild.on('exit', function (code: any) {
      if (code != 0) {
        recruiterChild.kill();
        callback(new Error(), null);
      } else {
        console.log('recruiterChild process closed with code ' + code);
        recruiterChild.kill();
        callback(null, 'success');
      }
    })

    recruiterChild.stderr.on('data', function (buf: any) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });


  }

  exportUsageDetailsCollection(callback: (err: any, res: any) => void) {
    console.log("inside exportUsageDetailsCollection");
    let stderr: any = '';
    /*let usageDetailsChild = spawn('mongoexport',['--db',db,'--collection','usestrackings','--type','csv','--fields','_id,candidateId,jobProfileId,timestamp,action,__v','--out','/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/usagedetail.csv']);*/

    let usageDetailsChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'usestrackings', '--type', 'csv', '--fields', '_id,candidateId,jobProfileId,timestamp,action,__v', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/usagedetail.csv']);

    usageDetailsChild.on('exit', function (code: any) {
      if (code != 0) {
        usageDetailsChild.kill();
        callback(new Error(), null);
      } else {
        console.log('usageDetailsChild process closed with code ' + code);
        usageDetailsChild.kill();
        callback(null, 'success');
      }
    });

    usageDetailsChild.stderr.on('data', function (buf: any) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });

  }

}

Object.seal(AdminService);
export = AdminService;
