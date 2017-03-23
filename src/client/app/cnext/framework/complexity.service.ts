import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ComplexityService {

  // Observable string sources
  private _showComplexitySource = new Subject<boolean>();

  // Observable string streams
  showTest$ = this._showComplexitySource.asObservable();

  // Service message commands
  change(isAnswerTrue: boolean) {
    this._showComplexitySource.next(isAnswerTrue);
  }
  
  
}
