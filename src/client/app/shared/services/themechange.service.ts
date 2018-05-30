import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";


@Injectable()
export class ThemeChangeService {

  themeSource = new Subject<string>();
  //showTheme$ Observable to observe themeSource
  showTheme$ = this.themeSource.asObservable();

  change(theme: string) {
    this.themeSource.next(theme);
  }
}

