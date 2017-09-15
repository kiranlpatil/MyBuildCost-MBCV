import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {UserProfile} from "../../../user/models/user";

@Injectable()
export class ProfileService {
  MessageSource = new Subject<UserProfile>();
  profileUpdateObservable$ = this.MessageSource.asObservable();

  onProfileUpdate(profile: UserProfile) {
    this.MessageSource.next(profile);
  }
}
