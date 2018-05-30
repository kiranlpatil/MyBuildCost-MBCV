import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loaders.service';
import { ControlMessagesComponent } from './customvalidations/control-messages.component';
import { ValidationService } from './customvalidations/validation.service';
import { SessionStorageService } from './services/session.service';
import { MessageService } from './services/message.service';
import { SharedService } from './services/shared-service';
import { ThemeChangeService } from './services/themechange.service';
import { CommonService } from './services/common.service';
import { BaseService } from './services/http/base.service';
import { CustomHttp } from './services/http/custom.http';
import { TooltipComponent } from './tool-tip-component/tool-tip-component';
import { FooterComponent } from '../framework/shared/footer/footer.component';
import { UsageTrackingService } from '../build-info/framework/usage-tracking.service';
import { ErrorService } from './services/error.service';

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent, ControlMessagesComponent, TooltipComponent, FooterComponent],
  exports: [LoaderComponent, ControlMessagesComponent, TooltipComponent, FooterComponent],
  providers: [LoaderService, UsageTrackingService,ValidationService, SessionStorageService, MessageService, SharedService,
    ThemeChangeService, CommonService, BaseService, CustomHttp, ErrorService, SessionStorageService]
})

export class SharedModule {

}
