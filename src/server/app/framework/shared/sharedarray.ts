/**
 * Created by admin on 10/5/16.
 */
//import Messages = require("../shared/messages");
let config = require('config');
let path = require('path');
class MailAttachments {
  public static AttachmentArray: Array<any> = [
    {
      path: path.resolve() + config.get('TplSeed.publicPath')+'images/logo/jobmosis-logo.png',
      cid: 'unique@jobmosis-logo'
    }
  ];
  public static ForgetPasswordAttachmentArray: Array<any> = [
    {
      path: path.resolve() + config.get('TplSeed.publicPath')+'images/logo/jobmosis-logo.png',
      cid: 'unique@jobmosis-logo'
    }, {
      path:  path.resolve() + config.get('TplSeed.publicPath')+'images/banner/password-reset.png',
      cid: 'unique@password-reset'
    }
  ];
}
export=MailAttachments;
