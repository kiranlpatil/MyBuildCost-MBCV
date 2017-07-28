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
let AuthInterceptor = require('./app/framework/interceptor/auth.interceptor');
this.authInterceptor = new AuthInterceptor();


export function cnextInit(app: express.Application) { //todo add interceptor to authenticate
  let searchController = new SearchController();
  app.get('/api/industry', industryController.retrieve);
  app.post('/api/proficiency', proficienciesController.create);
  app.get('/api/proficiency', proficienciesController.retrieve);
  app.put('/api/proficiency', proficienciesController.update);
  app.post('/api/industry', industryController.create);
  app.put('/api/recruiter/:id/job', recruiterController.postJob);
  app.get('/api/industry/:id/role', roleController.retrieve);
  app.post('/api/candidate', userInterceptor.create, candidateController.create);
  app.put('/api/candidate/:id', candidateController.updateDetails);
  app.get('/api/candidate/:id', candidateController.retrieve);
  app.get('/api/industry/:id/roles/capability', capabilityController.retrieve);
  app.get('/api/industry/:id/roles/capability/complexity', complexityController.retrieve);
  app.get('/api/companysize', userController.getCompanySize);
  app.get('/api/function', userController.getFunction);
  app.put('/api/recruiter/:id', recruiterController.updateDetails);
  app.get('/api/recruiter/:id', recruiterController.retrieve);
  app.get('/api/capabilitymatrix/candidate/:id', candidateController.getCapabilityMatrix);
  app.get('/api/capabilitymatrix/recruiter/jobProfile/:id/', jobProfileController.getCapabilityMatrix);
  app.get('/api/recruiter/jobProfile/:id/candidates', searchController.getMatchingCandidates);
  app.get('/api/recruiter/jobProfile/:id', jobProfileController.retrieve);
  app.get('/api/candidate/:id/jobProfile', searchController.getMatchingJobProfiles);
  app.get('/api/candidate/:id/:candidateId', candidateController.retrieve);
  app.get('/api/candidateDetails/:id', candidateController.get);
  app.get('/api/candidate/:candidateId/matchresult/:jobId', candidateController.metchResult);
  app.get('/api/recruiter/jobProfile/:jobId/matchresult/:candidateId', jobProfileController.metchResultForJob);
  app.get('/api/candidate/:id/list/:listName', candidateController.getList);
  app.get('/api/recruiter/jobProfile/:id/list/:listName', recruiterController.getList);
  app.put('/api/candidate/:id/jobProfile/:profileId/:listName/:action', jobProfileController.apply);
  app.post('/api/recruiter/jobProfile/:id/candidates', jobProfileController.getQCardDetails);
  app.put('/api/recruiter/:recruiterId/jobProfile/:profileId/:listName/:candidateId/:action', jobProfileController.update);

  app.get('/api/filterlist', recruiterController.getFilterList);
  app.get('/api/releventindustries', industryController.getReleventIndustryList);
  app.get('/api/recruiter/:id/jobprofile/:jobId', recruiterController.getCompareDetailsOfCandidate);
}
