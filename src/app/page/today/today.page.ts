import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subject } from 'rxjs';

import {CoreService} from '../../service/core/core.service';
import {TaskModel} from '../../_model';
import {takeUntil} from 'rxjs/operators';
import {ToastService} from '../../service/common/toast.service';
import {LoaderService} from '../../service/loader/loader.service';
import {AuthService} from '../../service/auth/auth.service';
import {User} from "firebase";

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
})
export class TodayPage implements OnInit, OnDestroy {
  private $destroyed = new Subject();
  public todayTasks: Array<TaskModel>;
  public userId: string;

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

  public getTasks(day = { date: new Date() }): void {
    this.loaderService.toggleLoading(true);
    this.coreService.getTodayTasks(day.date)
      .then(tasks => {
        this.todayTasks = tasks;
        this.loaderService.toggleLoading();
      })
      .catch(async error => {
        await this.toastService.show('TOAST.LIST_TASKS_ERROR', { message: error, origin: 'TodayPage.getTasks' });
        this.loaderService.toggleLoading();
      });
  }

  public onTaskOptionEvent(task: TaskModel): void {

  }

}
