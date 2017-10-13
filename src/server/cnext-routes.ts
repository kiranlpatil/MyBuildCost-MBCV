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
import * as userInterceptor from "./app/framework/interceptor/user.interceptor";
import {SearchController} from "./app/framework/search/controller/search.controller";
import * as adminController from "./app/framework/controllers/admin.controller";
let AuthInterceptor = require('./app/framework/interceptor/auth.interceptor');
import ShareController = require("./app/framework/share/controller/share.controller");
//import * as shareController from "./app/framework/share/controller/share.controller";
import * as sharedService from "./app/framework/shared/shared.service";

this.authInterceptor = new AuthInterceptor();


export function cnextInit(app: express.Application) { //todo add interceptor to authenticate
  let searchController = new SearchController();
  let shareController = new ShareController();
  app.get('/api/industry', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, industryController.retrieve);
  app.put('/api/updateUser/:id', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.updateDetailOfUser);
  app.post('/api/proficiency', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, proficienciesController.create);
  app.get('/api/proficiency', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, proficienciesController.retrieve);
  app.put('/api/proficiency', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, proficienciesController.update);
  app.post('/api/industry', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, industryController.create);
  app.put('/api/recruiter/:id/job', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterController.postJob);
  app.get('/api/industry/:id/role', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, roleController.retrieve);
  app.post('/api/candidate', this.authInterceptor.requiresAuth, userInterceptor.create, this.authInterceptor.secureApiCheck, candidateController.create);
  app.put('/api/candidate/:id', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, candidateController.updateDetails);
  app.get('/api/candidate/:id', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, candidateController.retrieve);
  app.get('/api/industry/:id/roles/capability', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, capabilityController.retrieve);
  app.get('/api/industry/:id/roles/capability/complexity', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, complexityController.retrieve);
  app.get('/api/companysize', userController.getCompanySize);
  app.get('/api/function', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.getFunction);
  app.put('/api/recruiter/:id', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterController.updateDetails);
  app.get('/api/recruiter/:id', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterController.retrieve);
  app.get('/api/capabilitymatrix/candidate/:id', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, candidateController.getCapabilityMatrix);
  app.get('/api/capabilitymatrix/recruiter/jobProfile/:id/', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.getCapabilityMatrix);
  app.get('/api/recruiter/jobProfile/:id/candidates', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, searchController.getMatchingCandidates);
  app.get('/api/recruiter/jobProfile/:id', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.retrieve);
  app.get('/api/candidate/:id/jobProfile', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, searchController.getMatchingJobProfiles);
  app.get('/api/candidate/:id/:candidateId', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, candidateController.retrieve);
  app.get('/api/candidateDetails/:id', this.authInterceptor.requiresAuth, candidateController.get);
  app.get('/api/candidate/:candidateId/matchresult/:jobId', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, candidateController.metchResult);
  app.get('/api/recruiter/jobProfile/:jobId/matchresult/:candidateId', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.metchResultForJob);
  app.get('/api/candidate/:id/list/:listName', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, candidateController.getList);
  app.get('/api/recruiter/jobProfile/:id/list/:listName', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterController.getList);
  app.put('/api/candidate/:id/jobProfile/:profileId/:listName/:action', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.apply);
  app.post('/api/recruiter/jobProfile/:id/candidates', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.getQCardDetails);
  app.put('/api/recruiter/:recruiterId/jobProfile/:profileId/:listName/:candidateId/:action', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, jobProfileController.update);
  app.get('/api/filterlist',  recruiterController.getFilterList);
  app.get('/api/releventindustries', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, industryController.getReleventIndustryList);
  app.get('/api/recruiter/:id/jobprofile/:jobId', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterController.getCompareDetailsOfCandidate);
  app.get('/api/recruiter/:id/candidatesearch/:searchvalue', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, recruiterController.getCandidatesByName);
  app.get('/api/candidate/:candidateId/recruiter/:recruiterId/jobprofile', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, searchController.searchCandidateJobProfiles);
  app.get('/api/candidateDetails', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.exportCandidateDetails);
  app.get('/api/recruiterDetails', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.exportRecruiterDetails);
  app.get('/api/exportCandidateDetails', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.exportCandidateDetails);
  app.get('/api/exportRecruiterDetails', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.exportRecruiterDetails);
  app.get('/api/getCandidateDetails/:initial', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.getCandidateDetailsByInitial);
  app.get('/api/getRecruiterDetails/:initial', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.getRecruiterDetailsByInitial);
  app.post('/api/request_to_advisor',recruiterController.requestToAdvisor);
  app.post('/api/response_to_recruiter/:id',this.authInterceptor.requiresAuth,recruiterController.responseToRecruiter);
  app.put('/api/job/:id/clone', this.authInterceptor.requiresAuth, jobProfileController.cloneJob);

  //Share api
  app.get('/api/buildValuePortraitUrl', this.authInterceptor.requiresAuth, shareController.buildValuePortraitUrl);
  app.get('/api/buildShareJobUrl/:jobId', this.authInterceptor.requiresAuth, shareController.buildShareJobUrl);
  app.get('/api/share/:shortUrl', shareController.getActualUrlForShare);
  app.put('/api/share/:shortUrl', this.authInterceptor.requiresAuth,shareController.resetActualUrlForShare);
  app.get("/api/closeJob",this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.getCloseJobReasons);
  // API for Uses Tracking
  app.put('/api/usageTracking', jobProfileController.createUsesTracking);
  app.get('/api/usageDetails', this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.getUsageDetails);

  app.use(sharedService.logHandler);
  app.use(sharedService.errorHandler);
  app.use(sharedService.clientHandler);
}
