import * as express from 'express';
import * as userController from './app/framework/controllers/user.controller';
import * as roleController from './app/framework/controllers/role.controller';
import * as capabilityController from './app/framework/controllers/capability.controller';
import * as industryController from './app/framework/controllers/industry.controller';
import * as sharedService from './app/framework/shared/shared.service';
import * as userInterceptor from './app/framework/interceptor/user.interceptor';
var AuthInterceptor = require("./app/framework/interceptor/auth.interceptor");
this.authInterceptor = new AuthInterceptor();


export function cnextInit(app: express.Application) {//todo add interceptor to authenticate
  //app.get("/api/industry",industryController.retrieve);
  app.post("/api/industry",industryController.create);
  app.get("/api/industry",  userController.getIndustry);
  app.get("/api/industry/:id/role", roleController.retrieve );
  app.get("/api/industry/:id/roles/capability", capabilityController.retrieve );
  app.get("/api/function",  userController.getFunction);
  app.get("/api/proficiency",  userController.getProficiency);
  app.get("/api/domain",  userController.getDomain);
  app.get("/api/role",  userController.getRole);
  app.get("/api/capability",  userController.getCapability);
  app.get("/api/complexity",  userController.getComplexity);
  app.get("/api/:id/role",  userController.getRole);
  app.get("/api/:id/role/capability",  userController.getRole);

 // app.get("/api/:id/role/capability",  userController.getRole);
}
