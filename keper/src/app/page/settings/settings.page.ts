import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

import {Subject} from 'rxjs';
import {CoreTaskService} from '../../service/core/task.service';
import {ToastService} from '../../service/common/toast.service';

import {LoaderService} from '../../service/loader/loader.service';
import {MemberModel, TaskModel, UserModel} from '../../_model';
import {AuthService} from '../../service/auth/auth.service';
import {EntityEnum, ModalEnum} from '../../_enum';
import {ModalService} from '../../service/common/modal.service';
import {CoreGroupService} from '../../service/core/group.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  private $destroyed = new Subject();
  public userId: string;
  public tasks: Array<TaskModel> = [];
  public users: Array<MemberModel> = [];
  public entityType: EntityEnum;
  public entityValue: TaskModel | MemberModel = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coreTaskService: CoreTaskService,
    private groupService: CoreGroupService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnDestroy(): void {
    this.$destroyed.next(null);
    this.$destroyed.complete();
  }

  ngOnInit(): void {
    this.getAuthUser();
    this.getGroups();
  }

  private getAuthUser(): void {
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(async (user: UserModel) => {
        if (user) {
          this.userId = user.id;
          this.getTasks();
          // this.getUsers();
        } else {
          this.userId = null;
        }
      });
  }

  private getGroups(): void {
    this.groupService.getGroupAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(() => {
        if (this.userId) {
          this.getTasks();
          // this.getUsers();
        }
      });
  }

  private getTasks(): void {
    this.loaderService.toggleLoading(true);

    this.coreTaskService.listTask()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(
        tasks => {
          this.tasks = tasks;
          this.loaderService.toggleLoading();
        }, async error => {
          await this.toastService.show('TOAST.LIST_TASKS_ERROR', { message: error, origin: 'SettingsPage.getTasks' });
          this.loaderService.toggleLoading();
        }
      );
  }

  public toGetTasks($event: { refresh?: boolean }): void {
    if ($event.refresh) {
      this.getTasks();
    }
  }

  // private async getUsers(): Promise<Array<UserModel>> {
  //   this.loaderService.toggleLoading(true);
  //
  //   const users = await this.coreService.listUsers()
  //     .catch(async error => {
  //       await this.toastService.show('TOAST.LIST_USERS_ERROR', { message: error, origin: 'SettingsPage.getUsers' });
  //       this.loaderService.toggleLoading();
  //     });
  //
  //   this.loaderService.toggleLoading();
  //   return users as Array<UserModel>;
  // }

  /**
   * Manage tasks
   */

  public onTaskOptsEvent(task: TaskModel): void {
    this.entityValue = task;
    this.entityType = EntityEnum.TASKS;
    this.modalService.currentModalValue = ModalEnum.OPTIONS;
  }

  public onTaskFormEvent(): void {
    this.modalService.currentModalValue = ModalEnum.TASK_FORM;
  }

  public async onDeleteTaskEvent(): Promise<void> {
    this.modalService.currentModalValue = ModalEnum.CONFIRM_DELETE;
  }

  /**
   * Manage users
   */

  public onUserOptsEvent(user: MemberModel): void {
    this.entityValue = user;
    this.entityType = EntityEnum.USERS;
    this.modalService.currentModalValue = ModalEnum.OPTIONS;
  }

  public onUserFormEvent(): void {
    this.modalService.currentModalValue = ModalEnum.USER_FORM;
  }

  public async onRemoveUserEvent(user: UserModel): Promise<void> {
  }

}
