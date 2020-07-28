import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TodayPage } from './today.page';
import { TodayRoutingModule } from './today-routing.module';
import { WidgetModule } from '../../component/widget/widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayRoutingModule,
    TranslateModule.forChild(),
    WidgetModule
  ],
  declarations: [TodayPage]
})
export class TodayPageModule {}
