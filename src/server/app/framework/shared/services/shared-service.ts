import {Actions, ConstVariables} from "../sharedconstants";
export class SharedService {

  constructData(listName: string): Actions {
    switch (listName) {
      case ConstVariables.CART_LISTED_CANDIDATE :
        return Actions.ADDED_IN_TO_CART_BY_RECRUITER;
      case ConstVariables.REJECTED_LISTED_CANDIDATE :
        return Actions.ADDED_IN_TO_REJECT_BY_RECRUITER;
      case ConstVariables.BLOCKED_CANDIDATE:
        return Actions.ADDED_INTO_NOT_INTERESTED;
      case ConstVariables.APPLIED_CANDIDATE :
        return Actions.APPLIED_FOR_JOB_PROFILE;
      default :
        return Actions.DEFAULT_VALUE;
    }
  }
}
