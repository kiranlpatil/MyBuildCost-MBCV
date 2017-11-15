/**
 * Created by admin on 10/5/16.
 */
//import Messages = require("../shared/messages");
let config = require('config');
let path = require('path');
class MailAttachments {
  public static AttachmentArray: Array<any> = [
    {
      path: path.resolve() + config.get('TplSeed.publicPath')+'images/logo/jobmosis-mobile-logo.png',
      cid: 'unique@company-logo'
    }, {
      path:  path.resolve() + config.get('TplSeed.publicPath')+'images/banner/banner.png',
      cid: 'unique@banner'
    }/*, {
      path: './src/server/app/framework/public/images/footer/fb.png',
      cid: 'unique@fbfooter'
    }, {
      path: './src/server/app/framework/public/images/footer/google-plus.png',
      cid: 'unique@googleplus'
    }, {
      path: './src/server/app/framework/public/images/footer/linked-in.png',
      cid: 'unique@linkedin'
    }*/
  ];
}
export=MailAttachments;
