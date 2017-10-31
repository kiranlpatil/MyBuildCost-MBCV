/**
 * Created by admin on 10/5/16.
 */
//import Messages = require("../shared/messages");

class MailAttachments {
  public static AttachmentArray: Array<any> = [
    {
      path: './src/server/app/framework/public/images/logo/jobmosis-mobile-logo.png',
      cid: 'unique@company-logo'
    }, {
      path: './src/server/app/framework/public/images/banner/banner.png',
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
