import * as express from "express";
import * as userController from "./app/framework/controllers/user.controller";
import * as candidateController from "./app/framework/controllers/candidate.controller";
import * as recruiterController from "./app/framework/controllers/recruiter.controller";
import * as importIndustriesController from "./app/framework/controllers/import-Industries.controller";
import * as sharedService from "./app/framework/shared/shared.service";
import * as userInterceptor from "./app/framework/interceptor/user.interceptor";
var AuthInterceptor = require("./app/framework/interceptor/auth.interceptor");
this.authInterceptor = new AuthInterceptor();

export function init(app: express.Application) {
  app.post("/api/generateotp/:id", this.authInterceptor.requiresAuth, userController.generateOtp);
  app.put("/api/verifyotp/:id", this.authInterceptor.requiresAuth, userController.verifyOtp);
  app.post("/api/login", userInterceptor.login, userController.login);
  app.post("/api/forgotpassword", userInterceptor.forgotPassword, userController.forgotPassword);
  app.put("/api/resetpassword/:id", this.authInterceptor.requiresAuth, userController.resetPassword);
  app.post("/api/candidate", candidateController.create);
  app.post("/api/recruiter", recruiterController.create);
  app.put("/api/users/:id", this.authInterceptor.requiresAuth, userController.updateDetails);
  app.get("/api/users/:id", userInterceptor.retrieve, this.authInterceptor.requiresAuth, userController.retrieve);
  app.post("/api/sendverificationmail/:id", this.authInterceptor.requiresAuth, userController.verificationMail);
  app.put("/api/verifyAccount/:id", this.authInterceptor.requiresAuth, userController.verifyAccount);
  app.put("/api/changeemailid/:id", this.authInterceptor.requiresAuth, userController.changeEmailId);
  app.put("/api/verifychangedemailid/:id", this.authInterceptor.requiresAuth, userController.verifyChangedEmailId);
  app.put("/api/changemobilenumber/:id", this.authInterceptor.requiresAuth, userController.changeMobileNumber);
  app.put("/api/verifymobilenumber/:id", this.authInterceptor.requiresAuth, userController.verifyMobileNumber);
  app.put("/api/changepassword/:id", this.authInterceptor.requiresAuth, userInterceptor.changePassword, userController.changePassword);
  app.post("/api/sendmail", userInterceptor.mail, userController.mail);
  app.get("/api/notification/:id", this.authInterceptor.requiresAuth, userController.notifications);
  app.put("/api/notification/:id", this.authInterceptor.requiresAuth, userController.pushNotifications);
  app.post("/api/industryprofile", userController.profilecreate);
  //api calling fo professional data-lucky
  app.get("/api/realocation",this.authInterceptor.requiresAuth, userController.getRealocation);
  app.get("/api/education", this.authInterceptor.requiresAuth,userController.getEducation);
  app.get("/api/experience",this.authInterceptor.requiresAuth, userController.getExperience);
  app.get("/api/currentsalary",this.authInterceptor.requiresAuth, userController.getCurrentSalary);
  app.get("/api/noticeperiod",this.authInterceptor.requiresAuth, userController.getNoticePeriod);
  app.get("/api/industryexposure",this.authInterceptor.requiresAuth, userController.getIndustryExposure);
  app.get("/api/searchedcandidate/jobPosterModel",this.authInterceptor.requiresAuth, userController.getSearchedCandidate);


  app.get("/api/fblogin", this.authInterceptor.facebookAuth, userController.fblogin);
  app.get("/api/address", userController.getAddress);
  app.post("/api/googlelogin", this.authInterceptor.googleAuth, userController.googlelogin);
  app.get("/api/indiastates", userController.getIndiaStates);
  //app.get("/auth/google/callback", this.authInterceptor.googleAuthCallback, userController.googlelogin);
  //app.get("/auth/google/success", userController.googlelogin);
  //app.post("/api/googletoken", userController.getGoogleToken);
  app.put("/api/updatepicture/:id", this.authInterceptor.requiresAuth, userController.updatePicture);
  app.put("/api/changetheme/:id", this.authInterceptor.requiresAuth, userController.changeTheme);
  app.post("/api/sendrecruitermail/:id", this.authInterceptor.requiresAuth, userController.recruiterVerificationMail);
  app.post("/api/companydetails/:id", this.authInterceptor.requiresAuth, userController.updateCompanyDetails);
  app.put("/api/uploaddocuments/:id", this.authInterceptor.requiresAuth, userController.uploaddocuments);

  app.get("/api/readxlsx", importIndustriesController.readXlsx);
  //app.post("/api/createImportIndusry", importIndustriesController.create);

  app.use(sharedService.logHandler);
  app.use(sharedService.errorHandler);
  app.use(sharedService.clientHandler);
}
