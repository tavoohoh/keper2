import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {User} from 'firebase';

import {CoreService} from '../../service/core/core.service';
import {TaskModel} from '../../_model';
import {ToastService} from '../../service/common/toast.service';
import {LoaderService} from '../../service/loader/loader.service';
import {AuthService} from '../../service/auth/auth.service';
import {DayModel} from '../../_model/day.model';

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
})
export class TodayPage implements OnInit, OnDestroy {
  private $destroyed = new Subject();
  public todayTasks: Array<TaskModel>;
  public userId: string;
  public selectedDateTitle = 'TITLE';

  constructor(
    private coreService: CoreService,
    private authService: AuthService,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) { }

  ngOnDestroy(): void {
    this.$destroyed.next(null);
    this.$destroyed.complete();
  }

  ngOnInit(): void {
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe((user: User) => {
        if (user) {
          this.userId = user.uid;
          this.getTasks();
        }
      });
  }

  public getTasks(day: DayModel = { weekday: null, monthDay: null, date: new Date() }): void {
    this.loaderService.toggleLoading(true);
    this.coreService.getTodayTasks(day.date)
      .then(tasks => {
        this.todayTasks = tasks;
        this.updateSelectedDateTitle(day);
        this.loaderService.toggleLoading();
      })
      .catch(async error => {
        await this.toastService.show('TOAST.LIST_TASKS_ERROR', { message: error, origin: 'TodayPage.getTasks' });
        this.loaderService.toggleLoading();
      });
  }

  private updateSelectedDateTitle(day: DayModel): void {
    if (!day.monthDay || day.monthDay === new Date().getDate()) {
      this.selectedDateTitle = 'TITLE';
    } else if (day.date > new Date()) {
      this.selectedDateTitle = `NEXT.${day.weekday}`;
    } else {
      this.selectedDateTitle = `PREV.${day.weekday}`;
    }
  }

}
