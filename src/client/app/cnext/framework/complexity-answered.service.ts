import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from "rxjs/Rx";

@Injectable()

export class ComplexityAnsweredService {

  _isAnswered = new Subject<boolean>();

  //makeCall$ = this._isAnswered.asObservable();

  change(isAnswered : boolean) {
    this._isAnswered.next(isAnswered);
  }

  makeCall(): Observable<any> {
    this._isAnswered.observers.splice(0, this._isAnswered.observers.length);
    return this._isAnswered.asObservable();
  }
}