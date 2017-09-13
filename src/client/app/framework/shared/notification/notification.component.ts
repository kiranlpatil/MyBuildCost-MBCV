import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NotificationService} from "./notification.service";
import {Notification} from "./notification";
import {CommonService, Message, MessageService} from "../../../shared/index";
import {Subscription} from "rxjs/Subscription";
import {LocalStorage, NavigationRoutes} from "../../../shared/constants";
import {LocalStorageService} from "../../../shared/services/localstorage.service";
import {LoaderService} from "../../../shared/loader/loaders.service";

@Component({
  moduleId: module.id,
  selector: 'tpl-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.css'],
})

export class NotificationComponent implements OnInit {
  notifications: Notification[];
  subscription: Subscription;
  newUser: number;
  unreadNotifications: number;

  constructor(private _router: Router, private notificationService: NotificationService,
              private messageService: MessageService, private commonService: CommonService, private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.unreadNotifications = 0;
    this.newUser = parseInt(LocalStorageService.getLocalValue(LocalStorage.IS_LOGGED_IN));
    if (this.newUser === 0) {
      this._router.navigate([NavigationRoutes.APP_START]);
    } else {
      this.getNotification();
    }
  }

  getNotification() {
    this.notificationService.getNotification()
      .subscribe(
        notification => this.onNotificationSuccess(notification),
        error => this.onNotificationFail(error));
  }

  onNotificationSuccess(result: any) {
    if (result !== null) {
      this.notifications = result.data;
      for (var i = 0; i < result.data.length; i++) {
        if (result.data[i].is_read === false) {
          this.unreadNotifications++;
        }
      }
    }
  }

  /*
   retriveData() {
   }*/

  onNotificationFail(error: any) {
    var message = new Message();
    message.isError = true;
    message.error_msg = error;
    message.custom_message = 'Network Not Found';
    this.messageService.message(message);
  }

  goBack() {
    this.commonService.goBack();
  }

  readNotification(count: any) {
  }
}
