import express= require('express');
import ShareService = require('../services/share.service');
import AuthInterceptor = require('../../interceptor/auth.interceptor');
//import config = require('config');
let config = require('config');

class ShareController {

  buildValuePortraitUrl(req: express.Request, res: express.Response, next: any) {
    try {
      let user: any = req.user;
      let _host = config.get('TplSeed.mail.host');
      let shareService: ShareService = new ShareService();
      let auth: AuthInterceptor = new AuthInterceptor();
      let _token = auth.issueTokenWithUidForShare(user);
      let query = {'userId': user._id};
      shareService.retrieve(query, (err, response) => {
        if (err) {
          next(err);
        } else {
          shareService.buildValuePortraitUrl(_host, _token, user, response, (error, result) => {
            if (error) {
              next(error);
            } else {
              res.status(200).send(result);
            }
          });
        }
      });

    } catch (e) {
      next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
    }

  }

  buildShareJobUrl(req: express.Request, res: express.Response, next: any) {
    try {
      let user: any = req.user;
      let _host = config.get('TplSeed.mail.host');
      let shareService: ShareService = new ShareService();
      let auth: AuthInterceptor = new AuthInterceptor();
      let _token = auth.issueTokenWithUid(user, 'hiringManager');
      shareService.buildShareJobUrl(_host, _token, user, req.params.jobId, (error, result) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send(result);
        }
      });
    } catch (e) {
      next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
    }

  }

  getActualUrlForShare(req: express.Request, res: express.Response, next: any) {
    try {
      let shareService: ShareService = new ShareService();
      let shortUrl = req.params.shortUrl;
      let query: any = {'shortUrl': shortUrl.toString()};
      shareService.retrieveUrl(query, (err, response) => {
        if (err) {
          next(err);
        } else {
          res.status(200).send(response);
        }
      });
    } catch (e) {
      next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
    }
  }

  resetActualUrlForShare(req: express.Request, res: express.Response,next:any) {
    try {
      let shareService: ShareService = new ShareService();
      let shortUrl = req.params.shortUrl;
      let query: any = {'shortUrl': shortUrl.toString()};
      shareService.findOneAndUpdate(query, (err, response) => {
        if (err) {
          next(err);
        } else {
          res.status(200).send(response);
        }
      });
    } catch (e) {
      next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
    }
  }

}

export = ShareController;
