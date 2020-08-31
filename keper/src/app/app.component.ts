import {Component, OnDestroy, OnInit} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from './service/loader/loader.service';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  public loading: boolean;
  private $destroyed = new Subject();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    private loader: LoaderService
  ) {
    this.initializeApp();
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  ngOnInit() {
    this.loader.getLoadingAsObservable().pipe(takeUntil(this.$destroyed)).subscribe((loading: boolean) => this.loading = loading);
  }

  ngOnDestroy() {
    this.$destroyed.next(null);
    this.$destroyed.complete();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
