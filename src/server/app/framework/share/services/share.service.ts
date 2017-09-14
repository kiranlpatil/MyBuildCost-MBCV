import {Share} from "../model/share";

class ShareService {
  private shareDetails:Share = new Share();

  buildValuePortraitUrl(host:any, access_token:any, user:any, callback:(error:any, result:Share) => void) {
    var urlForShare = host + 'value-portrait' + '?access_token=' + access_token;
    this.shareDetails.first_name = user.first_name;
    this.shareDetails.last_name = user.last_name;
    this.shareDetails.shareUrl = urlForShare;
    callback(null, this.shareDetails);
  }

}
//Object.seal(ShareService);
export = ShareService;
