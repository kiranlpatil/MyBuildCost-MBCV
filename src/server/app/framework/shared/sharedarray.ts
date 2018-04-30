let config = require('config');
let path = require('path');
class MailAttachments {
  public static AttachmentArray: Array<any> = [
    {
      path: path.resolve() + config.get('application.publicPath')+'images/logo/application-logo.png',
      cid: 'unique@application-logo'
    }
  ];
  public static ForgetPasswordAttachmentArray: Array<any> = [
    {
      path: path.resolve() + config.get('application.publicPath')+'images/logo/application-logo.png',
      cid: 'unique@application-logo'
    },
    {
      path:  path.resolve() + config.get('application.publicPath')+'images/banner/password-reset.png',
      cid: 'unique@password-reset'
    },
  ];
  public static WelcomeAboardAttachmentArray:Array<any>=[
    {
      path: path.resolve() + config.get('application.publicPath')+'images/logo/application-logo.png',
      cid: 'unique@application-logo'
    },
    {
      path:  path.resolve() + config.get('application.publicPath')+'images/banner/welcome-aboard.png',
      cid: 'unique@welcome-aboard'
    }
  ];
}
export=MailAttachments;
