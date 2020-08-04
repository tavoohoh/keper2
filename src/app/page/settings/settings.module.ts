import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { SettingsPage } from './settings.page';
import { SettingsRoutingModule } from './settings-routing.module';
import { WidgetModule } from '../../component/widget/widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsRoutingModule,
    TranslateModule.forChild(),
    WidgetModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
