import {NgModule} from "@angular/core";
import {CommonModule}       from '@angular/common';
import {LoaderComponent} from "./loader/loader.component";
import {LoaderService} from "./loader/loaders.service";
import {MyGoogleDirective} from "./location/googleplace.directive";
import {ControlMessagesComponent} from "./customvalidations/controlmessages.component";
import {ValidationService} from "./customvalidations/validation.service";
import {LocalStorageService} from "./services/localstorage.service";
import {MessageService} from "./services/message.service";
import {SharedService} from "./services/shared-service";
import {ThemeChangeService} from "./services/themechange.service";
import {CommonService} from "./services/common.service";
import {BaseService} from "./services/httpservices/base.service";
import {CustomHttp} from "./services/httpservices/custom.http";
import {TooltipComponent} from "./tool-tip-component/tool-tip-component";

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent, MyGoogleDirective, ControlMessagesComponent, MyGoogleDirective, TooltipComponent],
  exports: [LoaderComponent, MyGoogleDirective, ControlMessagesComponent, MyGoogleDirective, TooltipComponent],
  providers: [LoaderService, ValidationService, LocalStorageService, MessageService, SharedService,
    ThemeChangeService, CommonService, BaseService, CustomHttp]
})

export class SharedModule {

}
