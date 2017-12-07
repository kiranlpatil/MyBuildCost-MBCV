export class LocalStorageService {
  public static ACCESS_TOKEN = 'access_token';

  public static getLocalValue(key: any) {
    return sessionStorage.getItem(key);
  }

  public static removeLocalValue(key: any) {
    sessionStorage.removeItem(key);
  }

  public static setLocalValue(key: any, value: any) {
    sessionStorage.setItem(key, value);
  }

}
