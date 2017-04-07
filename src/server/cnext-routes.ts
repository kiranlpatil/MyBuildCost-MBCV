import * as express from 'express';
import * as userController from './app/framework/controllers/user.controller';
import * as roleController from './app/framework/controllers/role.controller';
import * as candidateController from './app/framework/controllers/candidate.controller';
import * as capabilityController from './app/framework/controllers/capability.controller';
import * as complexityController from './app/framework/controllers/complexity.controller';
import * as proficienciesController from './app/framework/controllers/proficiency.controller';
import * as industryController from './app/framework/controllers/industry.controller';
import * as recruiterController from './app/framework/controllers/recruiter.controller';
import * as sharedService from './app/framework/shared/shared.service';
import * as userInterceptor from './app/framework/interceptor/user.interceptor';
var AuthInterceptor = require("./app/framework/interceptor/auth.interceptor");
this.authInterceptor = new AuthInterceptor();


export function cnextInit(app: express.Application) {//todo add interceptor to authenticate
  app.get("/api/industry",industryController.retrieve); //todo done
  app.get("/api/roletype",userController.getRoleTypes); //todo remove
  app.post("/api/industry",industryController.create); //todo done
  app.put("/api/recruiter/:id/job",recruiterController.postJob); //todo done
  app.get("/api/industry/:id/role", roleController.retrieve );  //todo done
  app.get("/api/industry/:id/proficiency", proficienciesController.retrieve );  //todo done
  app.post("/api/candidate", userInterceptor.create, candidateController.create);  //todo done
  app.put("/api/candidate/:id",  candidateController.updateDetails);//todo add auth interceptor as like update profile of user
  app.put("/api/industry/:id/proficiency",  proficienciesController.update);//todo add auth interceptor as like update profile of user
  app.get("/api/candidate/:id",candidateController.retrieve);
  app.get("/api/industry/:id/roles/capability", capabilityController.retrieve ); //todo done
  app.get("/api/industry/:id/roles/capability/complexity", complexityController.retrieve ); //todo done
  app.get("/api/companysize",  userController.getCompanySize); //todo done
  app.get("/api/function",  userController.getFunction);  //todo remove
  app.get("/api/proficiency",  userController.getProficiency);  //todo remaining
  app.get("/api/domain",  userController.getDomain);
}
