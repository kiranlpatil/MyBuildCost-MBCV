let path = require('path');
let config = require('config');
let spawn = require('child_process').spawn;

let mongoExport = config.get('TplSeed.database.mongoExport');
let db = config.get('TplSeed.database.name');
let username = config.get('TplSeed.database.username');
let password = config.get('TplSeed.database.password');

class ExportService {

  constructor() {

  }

  exportCollection(collectionType: string, fields: string, downloadLocation: string, query: string,
                   callback: (err: any, res: any) => void) {
    console.log("inside " + collectionType + "collection");
    let stderr: any = '';
    let childProcess: any;

    if (username == "") {
      childProcess = spawn('mongoexport', ['--db', db, '--collection', collectionType, '--type','csv','--fields',fields,
        '--out', downloadLocation, '--query', query]);
    } else {
      childProcess = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection',
        collectionType, '--type', 'csv', '--fields', fields, '--out', downloadLocation, '--query', query]);
    }


    childProcess.on('exit', function (code: any) {
      if (code != 0) {
        childProcess.kill();
        callback(new Error(), null);
      } else {
        console.log(collectionType + ' process closed with code ' + code);
        childProcess.kill();
        callback(null, 'success');
      }
    });

    childProcess.stderr.on('data', function (buf: any) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });
  }

  exportCandidateCollection(callback: (err: any, res: any) => void) {
    let fields = '_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,' +
      'certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,' +
      'professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt,lockedOn,userFeedBack,roleType';

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.candidateProfilesCSV');

    this.exportCollection("candidates", fields, downloadLocation, '{}', (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.candidateProfilesCSV'));
      }
    });

  }

  exportCandidateCapabilities(callback: (err: any, res: any) => void) {
    let fields = 'userId,capability_matrix';

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.candidateCapabilitiesCSV');

    this.exportCollection("candidates", fields, downloadLocation, '{}', (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.candidateCapabilitiesCSV'));
      }
    });
  }

  exportUserCollection(userType: string, callback: (err: any, res: any) => void) {
    let fields: string;
    let query: string;
    let downloadLocation: string;

    if (userType == 'candidate') {
      downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
        + config.get('TplSeed.exportFileNames.candidateAccountDetailsCSV');
      fields = '_id,first_name,last_name,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,' +
        'isAdmin,otp,isActivated,temp_mobile,temp_email,picture'
      query = '{"isCandidate":true}';
    } else {
      downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
        + config.get('TplSeed.exportFileNames.companyAccountDetailsCSV');
      fields = '_id,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,isAdmin,otp,isActivated,' +
        'temp_mobile,location,picture,temp_email',
        query = '{"isCandidate":false}';
    }

    this.exportCollection("users", fields, downloadLocation, query, (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, 'success');
      }
    });


  }

  exportRecruiterCollection(callback: (err: any, res: any) => void) {
    let fields = '_id,userId,isRecruitingForself,company_name,company_size,company_website,setOfDocuments,' +
      'company_logo'

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.companyDetailsCSV');

    this.exportCollection("recruiters", fields, downloadLocation, '{}', (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.companyDetailsCSV'));
      }
    });

  }

  exportJobDetailsCollection(callback: (err: any, res: any) => void) {
    let fields = '_id,recruiterId,isJobPosted,daysRemainingForExpiring,isJobPostExpired,isJobPostClosed,isJobShared,' +
      'hideCompanyName,capability_matrix,complexity_musthave_matrix,jobCloseReason,candidate_list,location,' +
      'joiningPeriod,jobTitle,sharedLink,hiringManager,department,education,experienceMinValue,experienceMaxValue,' +
      'salaryMinValue,salaryMaxValue,proficiencies,additionalProficiencies,interestedIndustries,industry,' +
      'responsibility,postingDate,expiringDate,releventIndustries';

    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.jobDetailsCSV');

    this.exportCollection("jobprofiles", fields, downloadLocation, '{}', (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.jobDetailsCSV'));
      }
    });
  }


  exportUsageTrackingCollection(callback: (err: any, res: any) => void) {
    let fields = '_id,candidateId,jobProfileId,timestamp,action,__v';
    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.usageTrackingCSV');

    this.exportCollection("usestrackings", fields, downloadLocation, '{}', (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.usageTrackingCSV'));
      }
    });

  }

  exportKeySkillsCollection(callback: (err: any, res: any) => void) {
    let fields = '_id,proficiencies';
    let downloadLocation = path.resolve() + config.get('TplSeed.exportFilePathServer')
      + config.get('TplSeed.exportFileNames.masterKeySkillsCSV');

    this.exportCollection("proficiencies", fields, downloadLocation, '{}', (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, config.get('TplSeed.downloadFilePathClient')
          + config.get('TplSeed.exportFileNames.masterKeySkillsCSV'));
      }
    });

  }

}

Object.seal(ExportService);
export = ExportService;
