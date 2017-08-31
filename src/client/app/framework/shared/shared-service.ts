import {Injectable} from "@angular/core";

@Injectable()

export class SharedService {

  public isChrome: boolean;

  constructor() {
    //this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    let ua = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)){
      this.isChrome = true;
    }
    else if(/Chrome/i.test(ua)) {
      this.isChrome = true;
    }
    else{
      console.log('other');
      this.isChrome = false;
    }
  }

 /* public setUserBrowser(isChrome:boolean) {
    this.isChrome = isChrome;
  }*/

  public getUserBrowser():boolean {
    return this.isChrome;
  }
}