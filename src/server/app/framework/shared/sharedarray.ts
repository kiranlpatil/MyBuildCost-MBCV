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
  public static TrialExpiringAttachmentArray: Array<any> = [
    {
      path: path.resolve() + config.get('application.publicPath')+'images/logo/application-logo.png',
      cid: 'unique@application-logo'
    },
    {
      path:  path.resolve() + config.get('application.publicPath')+'images/banner/trial-expiring.png',
      cid: 'unique@trial-expiring'
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
  public static FirstTimeSubscribedAttachmentArray:Array<any>=[
    {
      path: path.resolve() + config.get('application.publicPath')+'images/logo/application-logo.png',
      cid: 'unique@application-logo'
    },
    {
      path:  path.resolve() + config.get('application.publicPath')+'images/banner/successfully-subscribed.png',
      cid: 'unique@first-time-subscribed'
    }
  ];
  public static RaAttachmentArray: Array<any> = [
    {
      path: path.resolve() + config.get('application.publicPath')+'images/logo/grey_ra.png',
      cid: 'unique@ra-application-logo'
    }
  ];
}
export=MailAttachments;
