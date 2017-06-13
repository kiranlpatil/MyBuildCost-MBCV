import {Injectable} from "@angular/core";
//import { Observable  } from 'rxjs/Observable';
/// <reference path='../../../../../typings/globals/fbsdk/index.d.ts' />

@Injectable()
export class FacebookService {

  constructor() {
    if (!window.fbAsyncInit) {
      window.fbAsyncInit = function () {
        FB.init({
          appId: '1000308350087499',
          xfbml: true,
          version: 'v2.7'
        });
      };
    }
  }

  loadAndInitFBSDK() {
    var js: any,
      id = 'facebook-jssdk',
      ref = document.getElementsByTagName('script')[0];

    if (document.getElementById(id)) {
      return;
    }

    js = document.createElement('script');
    js.id = id;
    js.async = true;
    js.src = '//connect.facebook.net/en_US/sdk.js';

    ref.parentNode.insertBefore(js, ref);
    return;
  }

}

