import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../../shared/shared.module";
import {CreateProjectRoutes} from "./create-project.routes";
import {NgModule} from "@angular/core";
import {CreateProjectComponent} from "./create-project.component";
import {UserModule} from "../../../user/user.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [CommonModule,
    UserModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(CreateProjectRoutes)
    ],
  declarations: [
    CreateProjectComponent
    ]

})

export class CreateProjectModule {

}
