export class LocalStorageService {
  public static ACCESS_TOKEN = 'access_token';

 /* public static getSessionValue(key: any) {
    return sessionStorage.getItem(key);
  }

  public static removeSessionValue(key: any) {
    sessionStorage.removeItem(key);
  }

  public static setSessionValue(key: any, value: any) {
    sessionStorage.setItem(key, value);
  }*/

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
