import {Share} from "../model/share";
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import CandidateClassModel = require('../../dataaccess/model/candidate-class.model');
import ShareLinkRepository = require("../../dataaccess/repository/share-link.repository");
import Messages = require("../../shared/messages");

class ShareService {
  private shareDetails:Share = new Share();
  private candidateRepository:CandidateRepository;
  private shareLinkRepository:ShareLinkRepository;

  constructor() {
    this.candidateRepository = new CandidateRepository();
    this.shareLinkRepository = new ShareLinkRepository();
  }

  buildValuePortraitUrl(host:string, access_token:string, user:any, res:CandidateClassModel[], callback:(error:any, result:Share) => void) {
    var actualUrl:string = 'value-portrait' + '/' + user._id + '?access_token=' + access_token;
    //var urlForShare = host + 'value-portrait' + '/' + user._id + '?access_token=' + access_token;

    var _date = new Date();
    var _miliSeconds:string = _date.getTime().toString();

    this.shareDetails.first_name = user.first_name;
    this.shareDetails.last_name = user.last_name;
    this.shareDetails.isVisible = res[0].isVisible;
    var _shortString:string = _miliSeconds;
    this.shareDetails.shareUrl = host + 'share' + '/' + _shortString;
    var _item:any = {
      shortUrl: _shortString,
      longUrl: actualUrl
    };
    this.shareLinkRepository.create(_item, (err, res) => {
      if (err) {
        callback(new Error(Messages.MSG_ERROR_IF_STORE_TO_SHARE_LINK_FAILED), null);
      } else {
        callback(null, this.shareDetails);
      }
    });
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.candidateRepository.retrieveWithoutLean(field, callback);
  }

  retrieveUrl(field:any, callback:(error:any, result:any) => void) {
    this.shareLinkRepository.retrieveWithoutLean(field, callback);
  }

}
//Object.seal(ShareService);
export = ShareService;
