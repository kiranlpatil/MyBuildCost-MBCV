import {Injectable} from "@angular/core";

@Injectable()

export class SharedService {

  public isChrome: boolean;
  public isToasterVisible: boolean = true;

  constructor() {
    let ua = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|Mobile|mobile|Chrome|CriOS/i.test(ua)){
      this.isChrome = true;
    }

    else {
      this.isChrome = false;
    }

    this.detectIE();

  }

  detectIE () : any {
    let ua = window.navigator.userAgent;

    let msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      this.isChrome = false;
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    let trident = ua.indexOf('Trident/');
    if (trident > 0) {
      this.isChrome = false;
      // IE 11 => return version number
      let rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    let edge = ua.indexOf('Edge/');
    if (edge > 0) {
      this.isChrome = false;
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }

  public setToasterVisiblity(isToasterVisible:boolean) {
    this.isToasterVisible = isToasterVisible;
  }

  public getToasterVisiblity():boolean {
    return this.isToasterVisible;
  }

  public getUserBrowser():boolean {
    return this.isChrome;
  }
}