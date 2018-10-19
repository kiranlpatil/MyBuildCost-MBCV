import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { ControlMessagesComponent } from './customvalidations/control-messages.component';
import { FooterComponent } from '../framework/shared/footer/footer.component';
import {LandingPageComponent} from "../framework/landing-page/landing-page.component";

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent,LandingPageComponent, ControlMessagesComponent,
    FooterComponent],
  exports: [LoaderComponent,LandingPageComponent, ControlMessagesComponent,
    FooterComponent]
})

export class SharedModule {

}
