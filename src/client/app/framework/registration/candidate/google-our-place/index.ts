import {ModuleWithProviders, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyGoogleDirective} from "./googleplace.directive";

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  declarations: [MyGoogleDirective],
  exports: [MyGoogleDirective],
  providers: []
})
export class MyGooglePlaceModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: MyGooglePlaceModule, providers: []};
  }
}
