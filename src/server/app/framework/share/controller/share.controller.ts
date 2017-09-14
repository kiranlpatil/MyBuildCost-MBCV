import express= require('express');
import ShareService = require('../services/share.service');
import AuthInterceptor = require('../../interceptor/auth.interceptor');
import config = require('config');
import UserModel = require('../../dataaccess/model/user.model');

class ShareController {

  buildValuePortraitUrl(req:express.Request, res:express.Response) {
    try {
      var user:UserModel = req.user;
      var _host = config.get('TplSeed.mail.host');
      var shareService:ShareService = new ShareService();
      var auth:AuthInterceptor = new AuthInterceptor();
      var _token = auth.issueTokenWithUidForShare(user);
      shareService.buildValuePortraitUrl(_host, _token, user, (error, result)=> {
        if (error) {
          res.status(304).send(error);
        } else {
          res.status(200).send(result);
        }
      });

    } catch (e) {
      res.status(403).send({message: e.message});
    }

  }

}

export = ShareController;
