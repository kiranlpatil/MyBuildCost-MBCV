import * as express from "express";
import * as userController from "./app/framework/controllers/user.controller";
import * as roleController from "./app/framework/controllers/role.controller";
import * as candidateController from "./app/framework/controllers/candidate.controller";
import * as capabilityController from "./app/framework/controllers/capability.controller";
import * as complexityController from "./app/framework/controllers/complexity.controller";
import * as proficienciesController from "./app/framework/controllers/proficiency.controller";
import * as industryController from "./app/framework/controllers/industry.controller";
import * as recruiterController from "./app/framework/controllers/recruiter.controller";
import * as jobProfileController from "./app/framework/controllers/job-profile.controller";
import {UsageTrackingController} from "./app/framework/controllers/usage-tracking-controller";
import * as userInterceptor from "./app/framework/interceptor/user.interceptor";
import {SearchController} from "./app/framework/search/controller/search.controller";
import * as adminController from "./app/framework/controllers/admin.controller";
import * as sharedService from "./app/framework/shared/logger/shared.service";
import * as loggerInterceptor from "./app/framework/interceptor/logger.interceptor";
import {SearchEngineController} from "./app/framework/search-engine/controllers/search-engine.controller";
let AuthInterceptor = require('./app/framework/interceptor/auth.interceptor');
import ShareController = require('./app/framework/share/controller/share.controller');
import {RecruiterCandidatesController} from "./app/framework/controllers/recruiter-candidates.controller";
this.authInterceptor = new AuthInterceptor();


export function cnextInit(app: express.Application) {
  try {
    //todo add interceptor to authenticate
    let searchController = new SearchController();
    let shareController = new ShareController();
    let usageTrackingController = new UsageTrackingController();
    let searchEngineController = new SearchEngineController();
    let recruiterCandidatesController = new RecruiterCandidatesController();

    app.get('/api/industry', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, industryController.retrieve);

    app.post('/api/proficiency', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, proficienciesController.create);
    app.get('/api/proficiency', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, proficienciesController.retrieve);
    app.put('/api/proficiency', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, proficienciesController.update);
    app.post('/api/industry', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, industryController.create);
    app.put('/api/recruiter/:id/job', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, recruiterController.postJob);
    app.get('/api/industry/:id/role', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, roleController.retrieve);
    app.post('/api/candidate', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth, userInterceptor.create,
      this.authInterceptor.secureApiCheck, candidateController.create);
    app.put('/api/candidate/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, candidateController.updateDetails);
    app.get('/api/candidate/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, candidateController.retrieve);
    app.get('/api/industry/:id/roles/capability', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, capabilityController.retrieve);
    app.get('/api/industry/:id/roles/capability/complexity', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, complexityController.retrieve);
    app.get('/api/companysize', loggerInterceptor.logDetail, userController.getCompanySize);
    app.get('/api/function', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, userController.getFunction);
    app.put('/api/recruiter/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, recruiterController.updateDetails);
    app.get('/api/recruiter/:id/jobs', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, recruiterController.retrieve);
    app.get('/api/recruiter/:id/details', recruiterController.getRecruiterDetails);
    app.get('/api/capabilitymatrix/candidate/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, candidateController.getCapabilityMatrix);
    app.get('/api/capabilitymatrix/recruiter/jobProfile/:id/', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.getCapabilityMatrix);
    app.get('/api/recruiter/jobProfile/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, jobProfileController.retrieve);
    app.get('/api/jobs/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, searchController.getJobsInIndustry);
    app.get('/api/candidate/:id/:candidateId', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, candidateController.retrieve);
    app.get('/api/candidateDetails/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      candidateController.get);
    app.get('/api/candidate/:candidateId/matchresult/:jobId', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, candidateController.metchResult);
    app.get('/api/recruiter/jobProfile/:jobId/matchresult/:candidateId', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.metchResultForJob);
    app.put('/api/candidate/:id/jobProfile/:profileId/:listName/:action', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.apply);

    app.put('/api/recruiter/:recruiterId/jobProfile/:profileId/:listName/:candidateId/:action',
      loggerInterceptor.logDetail, this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck,
      jobProfileController.update);
    app.get('/api/filterlist', loggerInterceptor.logDetail, recruiterController.getFilterList);
    app.get('/api/releventindustries', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, industryController.getReleventIndustryList);
    app.get('/api/recruiter/:id/jobprofile/:jobId', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, recruiterController.getCompareDetailsOfCandidate);
    app.get('/api/recruiter/:id/candidatesearch/:searchvalue', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterController.getCandidatesByName);
    app.get('/api/candidate/:candidateId/recruiter/:recruiterId/jobprofile', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck,
      searchController.searchCandidateJobProfiles);
    //app.post('/api/notify_recruiter', loggerInterceptor.logDetail, recruiterController.notifyRecruiter);
    app.post('/api/response_to_recruiter/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      recruiterController.responseToRecruiter);
    app.put('/api/job/:id/clone', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      jobProfileController.cloneJob);
    app.get('/api/userData', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, userController.getUserDetails);

    //search-engine api
    app.post('/api/recruiter/jobProfile/:id/candidates', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, searchEngineController.getMatchingCandidates);
    app.post('/api/recruiter/jobProfile/:id/list/:listName', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck,
      searchEngineController.getMatchingCandidates);
    app.post('/api/candidate/:candidateId/jobProfile', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, searchEngineController.getMatchingJobs);
    app.post('/api/candidate/:candidateId/list/:listName', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck,
      searchEngineController.getMatchingJobs);
    app.post('/api/jobs/candidate/:candidateId', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, searchEngineController.getMatchingJobsForCandidate);
    app.post('/api/filter/masterData/:jobId', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, searchEngineController.getMasterDataForRecruiterFilter);

    //Share api
    app.get('/api/buildValuePortraitUrl', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      shareController.buildValuePortraitUrl);
    app.get('/api/buildShareJobUrl/:jobId', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      shareController.buildShareJobUrl);
    app.get('/api/share/:shortUrl', loggerInterceptor.logDetail, shareController.getActualUrlForShare);
    app.put('/api/share/:shortUrl', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      shareController.resetActualUrlForShare);
    app.get('/api/closeJob', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, userController.getCloseJobReasons);
    app.get('/api/userFeedback', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, userController.getUserFeedback);

    // API for Uses Tracking
    app.put('/api/usageTracking', loggerInterceptor.logDetail, usageTrackingController.create);

    //Admin APIs
    app.put('/api/updateUser/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin, adminController.updateDetailOfUser);
    app.get('/api/getCandidateDetails/:initial', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin,
      adminController.getCandidateDetailsByInitial);
    app.get('/api/getRecruiterDetails/:initial', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin,
      adminController.getRecruiterDetailsByInitial);
    app.get('/api/exportCandidateDetails', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin, adminController.exportCandidateDetails);
    app.get('/api/exportRecruiterDetails', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin, adminController.exportRecruiterDetails);
    app.get('/api/keySkills', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin, adminController.exportKeySkills);
    app.get('/api/usageDetails', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin, adminController.exportUsageDetails);
    app.get('/api/userDetails/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, this.authInterceptor.validateAdmin, adminController.getUserDetails);


    //Api for update candidate field
    app.put('/api/candidate/fieldUpdate/:id', loggerInterceptor.logDetail, this.authInterceptor.requiresAuth,
      this.authInterceptor.secureApiCheck, candidateController.updateField);
    //Api to checck is user register with this mobile number or not,if yes get email id.
    app.get('/api/registrationstatus/:mobileNo', loggerInterceptor.logDetail, userInterceptor.validateRegistrationStatus,
      userController.getUserRegistrationStatus);

    app.get('/api/recruiter/:id/recruiterCandidatesSummary', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterCandidatesController.getSummary);

    app.get('/api/recruiter/:id/exportRecruiterCandidatesSummary', loggerInterceptor.logDetail,
      this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterCandidatesController.exportSummary);

    app.use(sharedService.errorHandler);
  } catch (e) {
    console.log('exception', e);
    //sharedService.errorHandler(e);
  }
}
