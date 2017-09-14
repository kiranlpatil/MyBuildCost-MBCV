export class LocalStorageService {
  public static ACCESS_TOKEN = 'access_token';

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
