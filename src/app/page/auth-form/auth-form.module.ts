import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthFormPage } from './auth-form.page';
import { AuthFormRoutingModule } from './auth-form-routing.module';
import { WidgetModule } from '../../component/widget/widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthFormRoutingModule,
    WidgetModule,
    TranslateModule.forChild(),
    ReactiveFormsModule
  ],
  declarations: [AuthFormPage]
})
export class AuthFormPageModule {}
