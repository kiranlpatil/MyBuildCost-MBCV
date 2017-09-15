/**
 * Created by lenovo on 11-09-2016.
 */
import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";
import {ProfileService} from "../../framework/shared/profileservice/profile.service";
import {HeaderComponent} from "../shared/header/header.component";
import {FooterComponent} from "../shared/footer/footer.component";
import {AppModule} from "../../app.module";
import {DashboardService} from "../../user/dashboard.service";

@NgModule({
  imports: [AppModule],
  declarations: [DashboardComponent, HeaderComponent, FooterComponent],
  exports: [DashboardComponent],
  providers: [DashboardService, ProfileService]
})
export class DashboardModule {
}
