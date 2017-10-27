/**
 * Created by techprime002 on 8/28/2017.
 */
import UserRepository = require('../dataaccess/repository/user.repository');
import SendMailService = require('./sendmail.service');
import {ConstVariables} from "../shared/sharedconstants";
let config = require('config');
let json2csv = require('json2csv');
let fs = require('fs');
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

let usestracking = require('uses-tracking');
let spawn = require('child_process').spawn;

let mongoExport = '/usr/bin/mongoexport';
//let db = config.get('TplSeed.database.name');
let username = 'admin';
let password = 'jobmosisadmin123';

let db = 'Jobmosis-staging';
//let db = 'c-next-backend';
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

  getUserDetails(userType: string, callback: (error: any, result: UsersClassModel) => void) {
    try {
      let userService = new UserService();
      let users: UsersClassModel = new UsersClassModel();
      let usersMap: Map<any, any> = new Map();
      let findQuery = new Object();

      if (userType == 'candidate') {
        findQuery = {'isCandidate': true, 'isAdmin': false};
      } else {
        findQuery = {'isCandidate': false, 'isAdmin': false};
      }

      let included_fields = {
        '_id': 1,
        'first_name': 1,
        'last_name': 1,
        'mobile_number': 1,
        'email': 1,
        'isActivated': 1
      };

      //let sortingQuery = {'first_name': 1, 'last_name': 1};
      let sortingQuery = {};
      console.log("before users fetch call");
      userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, (error, result) => {
          if (error) {
            callback(error, null);
          } else {
            console.log("after users fetch call");
            if (result.length == 0) {
              callback(null, users);
            }
            else {
              if (userType == 'candidate') {
                let candidateService = new CandidateService();
                let candidates: CandidateModelClass[] = new Array(0);
                let candidateIds: string[] = [];
                for (let candidate of result) {
                  candidateIds.push(candidate._id);
                }


                let candidateFields = {
                  'userId': 1,
                  'jobTitle': 1,
                  'isCompleted': 1,
                  'isSubmitted': 1,
                  'location.city': 1,
                  'proficiencies': 1,
                  'professionalDetails': 1,
                  'capability_matrix': 1,
                  'isVisible': 1,
                  'industry.name': 1,
                  'industry.roles.name': 1
                };
                console.log("before candiates fetch call");
                candidateService.retrieveWithLean({}, candidateFields, (error, candidatesResult) => {
                  //candidateService.retrieveWithLean({'userId': {$in: candidateIds}}, {}, (error, candidatesResult) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    console.log("Fetched all candidates:" + candidatesResult.length);
                    /*                  for (let candidate of candidatesResult) {
                     if (candidate.proficiencies.length > 0) {
                     candidate.keySkills = candidate.proficiencies.toString().replace(/,/g, ' $');
                     }

                     if (candidate.industry) {
                     candidate.roles = candidateService.loadRoles(candidate.industry.roles);
                     }

                     if (candidate.capability_matrix) {
                     candidate.capabilityMatrix = candidateService.loadCapabilitiDetails(candidate.capability_matrix);
                     }
                     usersMap.set(candidate.userId.toString(), candidate);
                     }

                     for (let user of result) {
                     user.data = usersMap.get(user._id.toString());
                     candidates.push(user);
                     }*/

                    users.candidate = candidates;

                    callback(null, users);
                  }
                });
              }
              else {
                console.log("inside recruiter fetch");
                let recruiterService = new RecruiterService();
                let recruiters: RecruiterClassModel[] = new Array(0);
                let recruiterFields = {
                  'userId': 1,
                  'company_name': 1,
                  'company_size': 1,
                  'isRecruitingForself': 1,
                  'postedJobs.isJobPosted': 1,
                  'postedJobs.capability_matrix': 1,
                  'postedJobs.expiringDate': 1,
                  'postedJobs.postingDate': 1,
                  'postedJobs.jobTitle': 1,
                  'postedJobs.hiringManager': 1,
                  'postedJobs.department': 1,
                  'postedJobs.education': 1,
                  'postedJobs.experienceMinValue': 1,
                  'postedJobs.experienceMaxValue': 1,
                  'postedJobs.salaryMinValue': 1,
                  'postedJobs.salaryMaxValue': 1,
                  'postedJobs.joiningPeriod': 1,
                  'postedJobs.proficiencies': 1,
                  'postedJobs.additionalProficiencies': 1,
                  'postedJobs.industry.name': 1,
                  'postedJobs.industry.roles.name': 1,
                };

                recruiterService.retrieveWithLean({}, recruiterFields, (error, recruiterResult) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    console.log("Fetched all recruiters:" + recruiterResult.length);
                    for (let recruiter of recruiterResult) {
                      recruiter.numberOfJobsPosted = recruiter.postedJobs.length;
                      recruiterService.loadCapbilityAndKeySkills(recruiter.postedJobs);
                      usersMap.set(recruiter.userId.toString(), recruiter);
                    }

                    for (let user of result) {
                      user.data = usersMap.get(user._id.toString());
                      recruiters.push(user);
                    }

                    users.recruiter = recruiters;
                    callback(null, users);

                  }
                });
              }
            }

          }
        }
      );
    }
    catch
      (e) {
      callback(e, null);
    }
  };

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

  addUsageDetailsValue(item: any, callback: (error: any, result: any) => void) {
    try {
      let value: number = 0;
      for (let i = 0; i < item.length; i++) {
        value++;
        item[i].action = ConstVariables.ActionsArray[item[i].action];
        if (item.length === value) {
          callback(null, item);
        }
      }
    } catch (e) {
      callback(e, null);
    }
  };

  generateUsageDetailFile(result: any, callback: (err: any, res: any) => void) {
    if (result && result.length > 0) {
      let fields = ['candidateId', 'recruiterId', 'jobProfileId', 'action', 'timestamp'];
      let fieldNames = ['Candidate Id', 'RecruiterId', 'Job Profile Id', 'Action', 'TimeStamp'];
      let csv = json2csv({data: result, fields: fields, fieldNames: fieldNames});
      //fs.writeFile('./src/server/public/usagedetail.csv', csv, function (err: any) {
      fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/usagedetail.csv', csv, function (err: any) {
        if (err) throw err;
        callback(null, result);
      });
    } else {
      callback(null, result);
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

  getUsageDetails(field: any, callback: (error: any, result: any) => void) {
    this.usesTrackingController.retrieveAll((err: any, res: any) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res);
      }
    });

  }

  exportCandidateCollection(callback: (err: any, res: any) => void) {
    console.log("inside exportCandidateCollection");
    /*let candidateChild = spawn('mongoexport', ['--db', db, '--collection', 'candidates', '--type', 'csv', '--fields',
      'userId,jobTitle,isCompleted,isSubmitted,location.city,proficiencies,professionalDetails,isVisible',
      '--out', '/home/shrikant/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates.csv']);*/

    let candidateChild = spawn('mongoexport', ['--username', username, '--password', password,'--db', db, '--collection',
      'candidates', '--type', 'csv', '--fields',
      'userId,jobTitle,isCompleted,isSubmitted,location.city,proficiencies,professionalDetails,isVisible',
      '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates.csv']);

    candidateChild.on('exit', function (code: any) {
      console.log('candidateChild process closed with code ' + code);
      candidateChild.kill();
      callback(null, 'success');
    });
  }

  exportCandidateOtherDetailsCollection(callback: (err: any, res: any) => void) {
    console.log("inside exportCandidateDetailsCollection");
    /*let candidateOtherDetailsChild = spawn('mongoexport', ['--db', db, '--collection', 'candidates',
      '--type', 'csv', '--fields', 'userId,capability_matrix', '--out',
      '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates-other-details.csv']);
*/
    let candidateOtherDetailsChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'candidates',
      '--type', 'csv', '--fields', 'userId,capability_matrix', '--out',
      '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates-other-details.csv']);

    candidateOtherDetailsChild.on('exit', function (code: any) {
      console.log('candidateOtherDetailsChild process closed with code ' + code);
      candidateOtherDetailsChild.kill();
      callback(null, 'success');
    });

  }

  exportUserCollection(userType: string, callback: (err: any, res: any) => void) {
    console.log("inside exportUserCollection");
    let userChild: any;

/*
    if (userType == 'candidate') {
      userChild = spawn('mongoexport', ['--db', db, '--collection', 'users', '--type', 'csv', '--fields',
        '_id,first_name,last_name,email,location.city,isActivated',
        '--out', '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/users.csv', '--query',
        '{"isCandidate": true}']);
    } else {
      userChild = spawn('mongoexport', ['--db', db, '--collection', 'users', '--type', 'csv', '--fields',
        '_id,mobile_number,email,location.city,isActivated', '--out',
        '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/users.csv',
        '--query', '{"isCandidate": false}']);
    }
*/

    if (userType == 'candidate') {
      userChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields',
        '_id,first_name,last_name,email,location.city,isActivated',
        '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv', '--query',
        '{"isCandidate": true}']);
    } else {
      userChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields',
        '_id,mobile_number,email,location.city,isActivated', '--out',
        '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv',
        '--query', '{"isCandidate": false}']);
    }

    userChild.on('close', function (code: any) {
      console.log('userChild process closed with code ' + code);
      userChild.kill();
      callback(null, 'success');
    });
  }

  exportRecruiterCollection(callback: (err: any, res: any) => void) {
    console.log("inside exportRecruiterCollection");
/*
    let recruiterChild = spawn('mongoexport', ['--db', db, '--collection', 'recruiters', '--type', 'csv',
      '--fields','userId,isRecruitingForself,company_name,company_size,company_website,postedJobs', '--out',
      '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/recruiters.csv']);
*/

    let recruiterChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'recruiters', '--type', 'csv',
      '--fields','userId,isRecruitingForself,company_name,company_size,company_website,postedJobs', '--out',
      '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiters.csv']);

    recruiterChild.on('exit', function (code: any) {
      console.log('recruiterChild process closed with code ' + code);
      callback(null, 'success');
    });
  }


}

Object.seal(AdminService);
export = AdminService;
