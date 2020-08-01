import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subject } from 'rxjs';

import {CoreService} from '../../service/core/core.service';
import {TaskModel} from '../../_model';
import {takeUntil} from 'rxjs/operators';
import {ToastService} from '../../service/common/toast.service';
import {LoaderService} from '../../service/loader/loader.service';

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
})
export class TodayPage implements OnInit, OnDestroy {
  private $destroyed = new Subject();
  public todayTasks: Array<TaskModel>;

  constructor(
    private coreService: CoreService,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) { }

  ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }

  ngOnInit(): void {
    this.getTasks();
  }

  private getTasks(): void {
    this.loaderService.toggleLoading(true);
    this.coreService.getTodayTasks()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(
        tasks => this.todayTasks = tasks,
        error => this.toastService.show('LIST_TASKS_ERROR', { message: error, origin: 'TodayPage.getTasks' }),
        () => this.loaderService.toggleLoading());
  }

}
