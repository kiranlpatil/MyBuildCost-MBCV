import {Actions, ConstVariables} from '../sharedconstants';
export class SharedService {

  constructAddActionData(listName: string): Actions {
    switch (listName) {
      case ConstVariables.CART_LISTED_CANDIDATE :
        return Actions.ADDED_IN_TO_CART_BY_RECRUITER;
      case ConstVariables.REJECTED_LISTED_CANDIDATE :
        return Actions.ADDED_IN_TO_REJECT_BY_RECRUITER;
      case ConstVariables.BLOCKED_CANDIDATE:
        return Actions.ADDED_INTO_NOT_INTERESTED;
      case ConstVariables.APPLIED_CANDIDATE :
        return Actions.APPLIED_FOR_JOB_PROFILE_BY_CANDIDATE;
      default :
        return Actions.DEFAULT_VALUE;
    }
  }

  constructRemoveActionData(listName: string): Actions {
    switch (listName) {
      case ConstVariables.CART_LISTED_CANDIDATE :
        return Actions.REMOVED_FROM_CART_BY_RECRUITER;
      case ConstVariables.REJECTED_LISTED_CANDIDATE :
        return Actions.REMOVED_FROM_REJECT_BY_RECRUITER;
      case ConstVariables.BLOCKED_CANDIDATE:
        return Actions.REMOVED_FROM_NOT_INTERESTED;
      default :
        return Actions.DEFAULT_VALUE;
    }
  }
}
