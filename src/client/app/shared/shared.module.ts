import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderComponent} from './loader/loader.component';
import {LoaderService} from './loader/loaders.service';
import {MyGoogleDirective} from './location/googleplace.directive';
import {ControlMessagesComponent} from './customvalidations/controlmessages.component';
import {ValidationService} from './customvalidations/validation.service';
import {LocalStorageService} from './services/localstorage.service';
import {MessageService} from './services/message.service';
import {SharedService} from './services/shared-service';
import {ThemeChangeService} from './services/themechange.service';
import {CommonService} from './services/common.service';
import {BaseService} from './services/http/base.service';
import {CustomHttp} from './services/http/custom.http';
import {TooltipComponent} from './tool-tip-component/tool-tip-component';
import {FooterComponent} from '../framework/shared/footer/footer.component';
import {UsageTrackingService} from '../cnext/framework/usage-tracking.service';
import {ErrorService} from "./services/error.service";

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent, MyGoogleDirective, ControlMessagesComponent, MyGoogleDirective, TooltipComponent, FooterComponent],
  exports: [LoaderComponent, MyGoogleDirective, ControlMessagesComponent, MyGoogleDirective, TooltipComponent, FooterComponent],
  providers: [LoaderService, UsageTrackingService,ValidationService, LocalStorageService, MessageService, SharedService,
    ThemeChangeService, CommonService, BaseService, CustomHttp, ErrorService]
})

export class SharedModule {

}
