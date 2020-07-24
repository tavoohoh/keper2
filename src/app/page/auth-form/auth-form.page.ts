import { Component, OnInit } from '@angular/core';
import { ButtonTypeEnum } from '../../_enum';

@Component({
  selector: 'app-sign-in',
  templateUrl: './auth-form.page.html',
  styleUrls: ['./auth-form.page.scss'],
})
export class AuthFormPage implements OnInit {
  public loading: boolean;
  public buttonType = ButtonTypeEnum;
  public isSignIn = false;

  constructor() { }

  ngOnInit(): void {
    this.loading = true;

    setTimeout(() => this.loading = false, 1000);
  }

  public toggleForm() {
    this.isSignIn = !this.isSignIn;
  }

}
