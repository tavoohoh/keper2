import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './button/button.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { ItemPickerComponent } from './item-picker/item-picker.component';
import { ModalComponent } from './modal/modal.component';
import { WeekdayPickerComponent } from './weekday-picker/weekday-picker.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

const widgets = [
  ButtonComponent,
  CalendarComponent,
  ItemCardComponent,
  ItemPickerComponent,
  ModalComponent,
  WeekdayPickerComponent,
  HeaderComponent,
  ProfileComponent,
  ChangePasswordComponent,
  RecoverPasswordComponent
];

@NgModule({
  declarations: [widgets],
  imports: [TranslateModule.forChild(), CommonModule, ReactiveFormsModule],
  exports: [widgets]
})
export class WidgetModule {}
