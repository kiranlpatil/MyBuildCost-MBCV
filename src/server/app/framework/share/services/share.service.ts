import {Share} from "../model/share";
import CandidateRepository = require('../../dataaccess/repository/candidate.repository');
import CandidateClassModel = require('../../dataaccess/model/candidate-class.model');

class ShareService {
  private shareDetails:Share = new Share();
  private candidateRepository:CandidateRepository;

  constructor() {
    this.candidateRepository = new CandidateRepository();
  }

  buildValuePortraitUrl(host:string, access_token:string, user:any, res:CandidateClassModel[], callback:(error:any, result:Share) => void) {
    var urlForShare = host + 'value-portrait' + '/' + user._id + '?access_token=' + access_token;
    this.shareDetails.first_name = user.first_name;
    this.shareDetails.last_name = user.last_name;
    this.shareDetails.isVisible = res[0].isVisible;
    this.shareDetails.shareUrl = urlForShare;
    callback(null, this.shareDetails);
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
    this.candidateRepository.retrieveWithoutLean(field, callback);
  }
}
//Object.seal(ShareService);
export = ShareService;
