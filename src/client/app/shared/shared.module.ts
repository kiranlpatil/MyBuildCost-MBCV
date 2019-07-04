import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { ControlMessagesComponent } from './customvalidations/control-messages.component';
import { FooterComponent } from '../framework/shared/footer/footer.component';
import {LandingPageComponent} from "../framework/landing-page/landing-page.component";
import {HomePageComponent} from "../framework/home-page/home-page.component";

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent,LandingPageComponent, HomePageComponent, ControlMessagesComponent,
    FooterComponent],
  exports: [LoaderComponent,LandingPageComponent, HomePageComponent, ControlMessagesComponent,
    FooterComponent]
})

export class SharedModule {

}
