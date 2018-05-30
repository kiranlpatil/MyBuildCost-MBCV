export class SessionStorageService {

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
