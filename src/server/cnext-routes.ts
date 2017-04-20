import * as express from 'express';
import * as userController from './app/framework/controllers/user.controller';
import * as roleController from './app/framework/controllers/role.controller';
import * as candidateController from './app/framework/controllers/candidate.controller';
import * as capabilityController from './app/framework/controllers/capability.controller';
import * as complexityController from './app/framework/controllers/complexity.controller';
import * as proficienciesController from './app/framework/controllers/proficiency.controller';
import * as industryController from './app/framework/controllers/industry.controller';
import * as recruiterController from './app/framework/controllers/recruiter.controller';
import * as jobProfileController from './app/framework/controllers/job-profile.controller';
import * as sharedService from './app/framework/shared/shared.service';
import * as userInterceptor from './app/framework/interceptor/user.interceptor';
var AuthInterceptor = require("./app/framework/interceptor/auth.interceptor");
this.authInterceptor = new AuthInterceptor();


export function cnextInit(app: express.Application) { //todo add interceptor to authenticate
  app.get("/api/industry",industryController.retrieve);
  app.get("/api/roletype",userController.getRoleTypes);
  app.post("/api/industry",industryController.create);
  app.post("/api/filtered",jobProfileController.searchCandidatesByJobProfile);
  app.put("/api/recruiter/:id/job",recruiterController.postJob);
  app.get("/api/industry/:id/role", roleController.retrieve );
  app.get("/api/industry/:id/proficiency", proficienciesController.retrieve );
  app.post("/api/candidate", userInterceptor.create, candidateController.create);
  app.put("/api/candidate/:id",  candidateController.updateDetails);
  app.put("/api/industry/:id/proficiency",  proficienciesController.update);
  app.get("/api/candidate/:id",candidateController.retrieve);
  app.get("/api/industry/:id/roles/capability", capabilityController.retrieve );
  app.get("/api/industry/:id/roles/capability/complexity", complexityController.retrieve );
  app.get("/api/companysize",  userController.getCompanySize);
  app.get("/api/function",  userController.getFunction);
  app.put("/api/recruiter/:id",recruiterController.updateDetails);
}
