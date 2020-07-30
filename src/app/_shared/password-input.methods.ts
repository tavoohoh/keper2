import {ModalMethods} from './modal.methods';

export class ChangePasswordMethods {
  public formFieldSetting = {
    passwordType: 'password'
  };

  public togglePassword(): void {
    this.formFieldSetting.passwordType = this.formFieldSetting.passwordType === 'text' ? 'password' : 'text';
  }
}

export class ChangePasswordAndModalMethods extends ModalMethods {
  public formFieldSetting = {
    passwordType: 'password'
  };

  public togglePassword(): void {
    this.formFieldSetting.passwordType = this.formFieldSetting.passwordType === 'text' ? 'password' : 'text';
  }
}
