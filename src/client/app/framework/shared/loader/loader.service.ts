import {   Injectable  } from '@angular/core';
import {  Subject  } from 'rxjs/Subject';

@Injectable()
export class LoaderService {

    status: Subject<boolean> = new Subject();

   // constructor() {}

    public start(): void {
        this.status.next(true);
    }

    public stop(): void {
        this.status.next(false);
    }
}
