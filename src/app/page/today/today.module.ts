import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodayPage } from './today.page';
import { TodayRoutingModule } from './today-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayRoutingModule
  ],
  declarations: [TodayPage]
})
export class TodayPageModule {}
