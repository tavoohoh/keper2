import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {TabsComponent} from './tabs/tabs.component';
import {ButtonComponent} from './button/button.component';
import {WeekdaysComponent} from './weekdays/weekdays.component';
import {ItemCardComponent} from './item-card/item-card.component';
import {ItemPickerComponent} from './item-picker/item-picker.component';
import {ModalComponent} from './modal/modal.component';
import {WeekdayPickerComponent} from './weekday-picker/weekday-picker.component';
import {HeaderComponent} from './header/header.component';
import {ProfileComponent} from './profile/profile.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {RecoverPasswordComponent} from './recover-password/recover-password.component';
import {TaskFormComponent} from './task-form/task-form.component';
import {UserFormComponent} from './user-form/user-form.component';
import {TaskOptionsComponent} from './task-options/task-options.component';
import {UserOptionsComponent} from './user-options/user-options.component';
import {GroupSelectorComponent} from './group-selector/group-selector.component';
import {GroupFormComponent} from './group-form/group-form.component';
import {OptionsComponent} from './options/options.component';
import {ConfirmDeleteComponent} from './confirm-delete/confirm-delete.component';

const widgets = [
  TabsComponent,
  ButtonComponent,
  WeekdaysComponent,
  ItemCardComponent,
  ItemPickerComponent,
  ModalComponent,
  WeekdayPickerComponent,
  HeaderComponent,
  ProfileComponent,
  ChangePasswordComponent,
  RecoverPasswordComponent,
  TaskFormComponent,
  UserFormComponent,
  TaskOptionsComponent,
  UserOptionsComponent,
  GroupSelectorComponent,
  GroupFormComponent,
  OptionsComponent,
  ConfirmDeleteComponent
];

@NgModule({
  declarations: [widgets],
  imports: [TranslateModule.forChild(), CommonModule, ReactiveFormsModule, RouterModule],
  exports: [widgets]
})
export class WidgetModule {}
