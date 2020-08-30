import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {CoreService} from '../../service/core/core.service';
import {CoreGroupService} from '../../service/core/group.service';
import {TaskModel} from '../../_model';
import {ToastService} from '../../service/common/toast.service';
import {LoaderService} from '../../service/loader/loader.service';
import {AuthService} from '../../service/auth/auth.service';
import {DayModel} from '../../_model/day.model';
import {UserModel} from '../../_model/user.model';
import {ModalEnum} from '../../_enum';
import {ModalService} from '../../service/common/modal.service';
import {GroupModel} from '../../_model/group.model';

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
  public group: GroupModel;

  constructor(
    private coreService: CoreService,
    private groupService: CoreGroupService,
    private authService: AuthService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.$destroyed.next(null);
    this.$destroyed.complete();
  }

  ngOnInit(): void {
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe((user: UserModel) => {
        if (user) {
          this.userId = user.id;
          // this.getTasks();
        }
      });

    this.groupService.getGroupAsObservable().subscribe(group => {
      this.group = group ? group : null;
    });
  }

  public getTasks(day: DayModel = { weekday: null, monthDay: null, date: new Date() }): void {
    this.loaderService.toggleLoading(true);
    this.coreService.getTodayTasks(day.date)
      .subscribe(
        tasksByDate => {
          this.todayTasks = tasksByDate.tasks;
          this.updateSelectedDateTitle(day);
          this.loaderService.toggleLoading();
        },
        async error => {
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

  public toggleGroupSelector(): void {
    this.modalService.currentModalValue = ModalEnum.GROUP_SELECTOR;
  }

  public async goToSettings(): Promise<void> {
    await this.router.navigate(['/settings']);
  }

}
