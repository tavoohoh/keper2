import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from './button/button.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { ItemPickerComponent } from './item-picker/item-picker.component';
import { ModalComponent } from './modal/modal.component';
import { WeekdayPickerComponent } from './weekday-picker/weekday-picker.component';
import { HeaderComponent } from './header/header.component';
import {CommonModule} from "@angular/common";

const widgets = [
  ButtonComponent,
  CalendarComponent,
  ItemCardComponent,
  ItemPickerComponent,
  ModalComponent,
  WeekdayPickerComponent,
  HeaderComponent
];

@NgModule({
  declarations: [widgets],
  imports: [TranslateModule.forChild(), CommonModule],
  exports: [widgets]
})
export class WidgetModule {}
