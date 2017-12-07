import {Injectable} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
declare let ga: Function;

@Injectable()

export class AnalyticService {
  googleAnalyse(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
}
