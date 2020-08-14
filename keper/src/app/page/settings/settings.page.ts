import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {User} from 'firebase';

import {CoreService} from '../../service/core/core.service';
import {ToastService} from '../../service/common/toast.service';
import {LoaderService} from '../../service/loader/loader.service';

import {TaskModel} from '../../_model';
import {UserModel} from '../../_model/user.model';
import {AuthService} from '../../service/auth/auth.service';
import {ModalEnum} from '../../_enum';
import {ModalService} from '../../service/common/modal.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  private $destroyed = new Subject();
  public userId: string;
  public tasks: Array<TaskModel> = [];
  public users: Array<UserModel> = [];
  public selectedTask: TaskModel = null;
  public selectedUser: UserModel = null;

  constructor(
    private coreService: CoreService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnDestroy(): void {
    this.$destroyed.next(null);
    this.$destroyed.complete();
  }

  async ngOnInit(): Promise<void> {
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(async (user: User) => {
        if (user) {
          this.userId = user.uid;
          this.tasks = await this.getTasks();
          this.users = await this.getUsers();
        }
      });
  }

  private async getTasks(): Promise<Array<TaskModel>> {
    this.loaderService.toggleLoading(true);

    const tasks = await this.coreService.listTasks()
      .catch(async error => {
        await this.toastService.show('TOAST.LIST_TASKS_ERROR', { message: error, origin: 'SettingsPage.getTasks' });
        this.loaderService.toggleLoading();
      });

    this.loaderService.toggleLoading();
    return tasks as Array<TaskModel>;
  }

  private async getUsers(): Promise<Array<UserModel>> {
    this.loaderService.toggleLoading(true);

    const users = await this.coreService.listUsers()
      .catch(async error => {
        await this.toastService.show('TOAST.LIST_USERS_ERROR', { message: error, origin: 'SettingsPage.getUsers' });
        this.loaderService.toggleLoading();
      });

    this.loaderService.toggleLoading();
    return users as Array<UserModel>;
  }

  /**
   * Manage tasks
   */

  public onTaskOptsEvent(task: TaskModel): void {
    this.selectedTask = task;
    this.modalService.currentModalValue = ModalEnum.TASK_OPTIONS;
  }

  public onTaskFormEvent(task: TaskModel = null): void {
    this.selectedTask = task;
    this.modalService.currentModalValue = ModalEnum.TASK_NEW;
  }

  public async onDeleteTaskEvent(task: TaskModel): Promise<void> {
    this.tasks = await this.getTasks();
  }

  /**
   * Manage users
   */

  public onUserOptsEvent(user: UserModel): void {
    this.selectedUser = user;
    this.modalService.currentModalValue = ModalEnum.USER_OPTIONS;
  }

  public onUserFormEvent(user: UserModel = null): void {
    this.selectedUser = user;
    this.modalService.currentModalValue = ModalEnum.USER_NEW;
  }

  public async onRemoveUserEvent(user: UserModel): Promise<void> {
    this.users = await this.getUsers();
  }

}
