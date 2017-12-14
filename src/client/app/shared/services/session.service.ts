import {SessionStorage} from "../../shared/constants";

export class SessionStorageService {

  public static getRecruiterReferenceId() {
    return sessionStorage.getItem(SessionStorage.RECRUITER_REFERENCE_ID);
  }

  public static removeRecruiterReferenceId() {
    sessionStorage.removeItem(SessionStorage.RECRUITER_REFERENCE_ID);
  }

  public static setRecruiterReferenceId(id: string) {
    sessionStorage.setItem(SessionStorage.RECRUITER_REFERENCE_ID, id);
  }

   public static getSessionValue(key: any) {
     return sessionStorage.getItem(key);
   }

   public static removeSessionValue(key: any) {
     sessionStorage.removeItem(key);
   }

   public static setSessionValue(key: any, value: any) {
     sessionStorage.setItem(key, value);
   }
}
