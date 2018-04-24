import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ProjectNameChangeService {

  projectNameService = new Subject<string>();
  //showTheme$ Observable to observe themeSource
  changeProjectName$ = this.projectNameService.asObservable();

  change(projectName: string) {
    this.projectNameService.next(projectName);
  }
}

