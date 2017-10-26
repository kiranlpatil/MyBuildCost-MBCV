import * as express from "express";
import * as userController from "./app/framework/controllers/user.controller";
import * as adminController from "./app/framework/controllers/admin.controller";
import * as candidateController from "./app/framework/controllers/candidate.controller";
import * as recruiterController from "./app/framework/controllers/recruiter.controller";
import * as importIndustriesController from "./app/framework/controllers/import-Industries.controller";
import * as sharedService from "./app/framework/shared/logger/shared.service";
import * as userInterceptor from "./app/framework/interceptor/user.interceptor";
import { ImportIndustryController } from "./app/framework/controllers/import-Industries.controller";
import * as loggerInterceptor from "./app/framework/interceptor/logger.interceptor";
var AuthInterceptor = require("./app/framework/interceptor/auth.interceptor");
this.authInterceptor = new AuthInterceptor();

export function init(app: express.Application) {
  let importIndustryController= new ImportIndustryController();
  app.post("/api/generateotp/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.generateOtp);
  app.put("/api/verifyotp/:id", loggerInterceptor.logDetail, this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.verifyOtp);
  app.post("/api/login",loggerInterceptor.logDetail, userInterceptor.login, userController.login);
  app.post("/api/forgotpassword",loggerInterceptor.logDetail,  userInterceptor.forgotPassword, userController.forgotPassword);
  app.put("/api/resetpassword/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.resetPassword);
  app.post("/api/candidate",loggerInterceptor.logDetail,  candidateController.create);
  app.post("/api/admin",loggerInterceptor.logDetail,  adminController.create);
  app.post("/api/recruiter",loggerInterceptor.logDetail,  recruiterController.create);
  app.put("/api/users/:id", loggerInterceptor.logDetail, this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.updateDetails);
  app.put("/api/users/:id/fieldname/:fname",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.updateProfileField);
  app.get("/api/users/:id",loggerInterceptor.logDetail, userInterceptor.retrieve, this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.retrieve);
  app.post("/api/sendverificationmail/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.verificationMail);
  app.put("/api/verifyAccount/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.verifyAccount);
  app.put("/api/changeemailid/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.changeEmailId);
  app.put("/api/changerecruiteraccountdetails/:id",loggerInterceptor.logDetail, this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.updateRecruiterAccountDetails);
  app.put("/api/verifychangedemailid/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.verifyChangedEmailId);
  app.put("/api/changemobilenumber/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.changeMobileNumber);
  app.put("/api/verifymobilenumber/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.verifyMobileNumber);
  app.put("/api/changepassword/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userInterceptor.changePassword, userController.changePassword);
  app.post("/api/sendmail",loggerInterceptor.logDetail,  userInterceptor.mail, userController.mail);
  app.get("/api/notification/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.notifications);
  app.put("/api/notification/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.pushNotifications);
  app.post("/api/industryprofile",loggerInterceptor.logDetail,  userController.profilecreate);
  //api calling fo professional data-lucky
  app.get("/api/realocation",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.getRealocation);
  app.get("/api/education",loggerInterceptor.logDetail,  userController.getEducation);
  app.get("/api/experience",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.getExperience);
  app.get("/api/currentsalary",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.getCurrentSalary);
  app.get("/api/noticeperiod",loggerInterceptor.logDetail,   userController.getNoticePeriod);
  app.get("/api/industryexposure",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.getIndustryExposure);
  app.get("/api/searchedcandidate/jobPosterModel",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.getSearchedCandidate);


  app.get("/api/fblogin",loggerInterceptor.logDetail,  this.authInterceptor.facebookAuth, this.authInterceptor.secureApiCheck, userController.fblogin);
  app.get("/api/address",loggerInterceptor.logDetail,  userController.getAddress);
  app.post("/api/googlelogin",loggerInterceptor.logDetail,  this.authInterceptor.googleAuth, this.authInterceptor.secureApiCheck, userController.googlelogin);
  app.get("/api/indiastates",loggerInterceptor.logDetail,  userController.getIndiaStates);
  //app.get("/auth/google/callback", this.authInterceptor.googleAuthCallback, userController.googlelogin);
  //app.get("/auth/google/success", userController.googlelogin);
  //app.post("/api/googletoken", userController.getGoogleToken);
  app.put("/api/updatepicture/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.updatePicture);
  app.put("/api/changetheme/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.changeTheme);
  app.post("/api/sendrecruitermail/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.recruiterVerificationMail);
  app.post("/api/companydetails/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.updateCompanyDetails);
  app.put("/api/uploaddocuments/:id",loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, userController.uploaddocuments);
  app.get('/api/alluser',loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.getAllUser);
  app.get('/api/countofusers',loggerInterceptor.logDetail,  this.authInterceptor.requiresAuth, this.authInterceptor.secureApiCheck, adminController.getCountOfUsers);
  app.get("/api/readxlsx",loggerInterceptor.logDetail,  importIndustryController.readXlsx);
  //app.post("/api/createImportIndusry", importIndustriesController.create);

  app.use(sharedService.errorHandler);
}
