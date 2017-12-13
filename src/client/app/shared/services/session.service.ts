import {LocalStorage, SessionStorage} from "../../shared/constants";

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

  public static getLocalValue(key: any) {
    return localStorage.getItem(key);
  }

  public static removeLocalValue(key: any) {
    localStorage.removeItem(key);
  }

  public static setLocalValue(key: any, value: any) {
    localStorage.setItem(key, value);
  }
}
