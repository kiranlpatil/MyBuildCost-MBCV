import {ChildProcess} from "child_process";
import {Readable} from "stream";
import ExportModel = require("../dataaccess/model/export.model");
let path = require('path');
let config = require('config');
let spawn = require('child_process').spawn;

class ExportService {

  exportCollection(collectionType: string, fields: string, downloadLocation: string, query: string,
                   callback: (error: Error, status: string) => void) {
    console.log("inside " + collectionType + "collection");

    let db = config.get('TplSeed.database.name');
    let username = config.get('TplSeed.database.username');
    let stderr: string = '';
    let childProcess: ChildProcess;

    if (username == "") {
      childProcess = spawn('mongoexport', ['--db', db, '--collection', collectionType, '--type', 'csv', '--fields', fields,
        '--out', downloadLocation, '--query', query]);
    } else {
      childProcess = spawn('mongoexport', ['--username', username, '--password', config.get('TplSeed.database.password'), '--db', db, '--collection',
        collectionType, '--type', 'csv', '--fields', fields, '--out', downloadLocation, '--query', query]);
    }


    childProcess.on('exit', function (code: number) {
      if (code != 0) {
        childProcess.kill();
        callback(new Error(), null);
        return;
      } else {
        console.log(collectionType + ' process closed with code ' + code);
        childProcess.kill();
        callback(null, 'success');
      }
    });

    childProcess.stderr.on('data', function (buf: Readable) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });
  }

  exportCandidates(callback: (err: Error, fileLocation: string) => void) {
    let fields = '_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,' +
      'certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,' +
      'professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt,lockedOn,userFeedBack,roleType';

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.candidateProfilesCSV');

    this.exportCollection("candidates", fields, downloadLocation, '{}', (error: Error, result: string) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.candidateProfilesCSV'));
      }
    });

  }

  exportCandidateCapabilities(callback: (err: Error, res: string) => void) {
    let fields = 'userId,capability_matrix';

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.candidateCapabilitiesCSV');

    this.exportCollection("candidates", fields, downloadLocation, '{}', (error: Error, result: string) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.candidateCapabilitiesCSV'));
      }
    });
  }

  exportUsers(userType: string, callback: (err: Error, status: string) => void) {
    let fields: string;
    let query: string;
    let downloadLocation: string;

    if (userType == 'candidate') {
      downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
        + config.get('TplSeed.exportFileNames.candidateAccountDetailsCSV');
      fields = '_id,first_name,last_name,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,' +
        'isAdmin,otp,isActivated,temp_mobile,temp_email,picture';
      query = '{"isCandidate":true}';
    } else {
      downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
        + config.get('TplSeed.exportFileNames.companyAccountDetailsCSV');
      fields = '_id,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,isAdmin,otp,isActivated,' +
        'temp_mobile,location,picture,temp_email';
      query = '{"isCandidate":false}';
    }

    this.exportCollection("users", fields, downloadLocation, query, (error: Error, status: string) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        callback(null, 'success');
      }
    });

  }

  exportRecruiter(callback: (error: Error, filesPath: string) => void) {
    let fields = '_id,userId,isRecruitingForself,company_name,company_size,company_website,my_candidate_list,setOfDocuments,' +
      'company_logo';

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.companyDetailsCSV');

    this.exportCollection("recruiters", fields, downloadLocation, '{}', (error: Error, filePath: string) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.companyDetailsCSV'));
      }
    });

  }

  exportJobDetails(callback: (err: Error, filesPath: string) => void) {
    let fields = '_id,recruiterId,isJobPosted,daysRemainingForExpiring,isJobPostExpired,isJobPostClosed,isJobShared,' +
      'hideCompanyName,capability_matrix,complexity_musthave_matrix,jobCloseReason,candidate_list,location,' +
      'joiningPeriod,jobTitle,sharedLink,hiringManager,department,education,experienceMinValue,experienceMaxValue,' +
      'salaryMinValue,salaryMaxValue,proficiencies,additionalProficiencies,interestedIndustries,industry,' +
      'responsibility,postingDate,expiringDate,releventIndustries';

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.jobDetailsCSV');

    this.exportCollection("jobprofiles", fields, downloadLocation, '{}', (error: Error, filePath: string) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.jobDetailsCSV'));
      }
    });
  }

  exportUsageTracking(callback: (err: Error, filePath: string) => void) {
    let fields = '_id,candidateId,jobProfileId,timestamp,action,__v';
    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.usageTrackingCSV');

    this.exportCollection("usestrackings", fields, downloadLocation, '{}', (error: Error, filePath: string) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.usageTrackingCSV'));
      }
    });

  }

  exportKeySkills(callback: (err: Error, filePath: string) => void) {
    let fields = '_id,proficiencies';
    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.masterKeySkillsCSV');

    this.exportCollection("proficiencies", fields, downloadLocation, '{}', (error: Error, filePath: string) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.masterKeySkillsCSV'));
      }
    });

  }

  exportCandidateDetails(callback: (error: Error, exportModel: ExportModel) => void) {
    let exportService = new ExportService();
    exportService.exportCandidates((err, candidatesFilePath) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        let exportModel: ExportModel = new ExportModel();
        exportModel.candidateProfilesCSV = candidatesFilePath;
        exportService.exportCandidateCapabilities((capError, capabilitiesFilePath) => {
          if (capError) {
            callback(capError, null);
            return;
          } else {
            exportModel.candidateCapabilitiesCSV = capabilitiesFilePath;
            exportService.exportUsers('candidate', (userErr, usersFilePath) => {
              if (userErr) {
                callback(userErr, null);
                return;
              } else {
                exportModel.candidateAccountDetailsCSV = config.get('TplSeed.downloadFilePathClient')
                  + config.get('TplSeed.exportFileNames.candidateAccountDetailsCSV');
                callback(null, exportModel);
              }
            });
          }
        });
      }
    });
  }

  exportRecruiterDetails(callback: (error: Error, exportModel: ExportModel) => void) {
    let exportService = new ExportService();
    exportService.exportRecruiter((err, companyDetailsFilePath) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        let exportModel: ExportModel = new  ExportModel();
        exportModel.companyDetailsCSV = companyDetailsFilePath;
        exportService.exportJobDetails((exportJobsErr, jobDetailsFilePath) => {
          if (exportJobsErr) {
            callback(exportJobsErr, null);
            return;
          } else {
            exportModel.jobDetailsCSV = jobDetailsFilePath;
            exportService.exportUsers('recruiter', (jobDetailsErr, status) => {
              if (jobDetailsErr) {
                callback(jobDetailsErr, null);
                return;
              } else {
                exportModel.companyAccountDetailsCSV = config.get('TplSeed.downloadFilePathClient')
                  + config.get('TplSeed.exportFileNames.companyAccountDetailsCSV');
                callback(null, exportModel);
              }
            });
          }
        });
      }
    });
  }

}

Object.seal(ExportService);
export = ExportService;
