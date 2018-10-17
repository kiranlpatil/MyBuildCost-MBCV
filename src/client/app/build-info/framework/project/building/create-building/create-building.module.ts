import { CommonModule } from '@angular/common';
import { UserModule } from '../../../../../user/user.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreateBuildingRoutes } from './create-building.routes';
import { CreateBuildingComponent } from './create-building.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule,UserModule,FormsModule,SharedModule, RouterModule.forChild(CreateBuildingRoutes)],
  declarations: [CreateBuildingComponent]

})

export class CreateBuildingModule {

}
