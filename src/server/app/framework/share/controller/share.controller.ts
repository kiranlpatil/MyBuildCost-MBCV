import express= require('express');
import ShareService = require('../services/share.service');
import AuthInterceptor = require('../../interceptor/auth.interceptor');
//import config = require('config');
var config = require('config');

class ShareController {

  buildValuePortraitUrl(req:express.Request, res:express.Response) {
    try {
      var user:any = req.user;
      var _host = config.get('TplSeed.mail.host');
      var shareService:ShareService = new ShareService();
      var auth:AuthInterceptor = new AuthInterceptor();
      var _token = auth.issueTokenWithUidForShare(user);
      var query = {'userId': user._id};
      shareService.retrieve(query, (err, response) => {
        if (err) {
          res.status(304).send(err);
        } else {
          shareService.buildValuePortraitUrl(_host, _token, user, response, (error, result)=> {
            if (error) {
              res.status(304).send(error);
            } else {
              res.status(200).send(result);
            }
          });
        }
      });

    } catch (e) {
      res.status(403).send({message: e.message});
    }

  }

}

export = ShareController;
