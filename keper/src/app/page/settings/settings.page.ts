import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

import {Subject} from 'rxjs';
import {CoreTaskService} from '../../service/core/task.service';
import {ToastService} from '../../service/common/toast.service';

import {EntityModel, MemberModel, TaskModel, UserModel} from '../../_model';
import {AuthService} from '../../service/auth/auth.service';
import {EntityEnum, ModalEnum} from '../../_enum';
import {ModalService} from '../../service/common/modal.service';
import {CoreGroupService} from '../../service/core/group.service';
import {CoreUserService} from '../../service/core/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  private $destroyed = new Subject();
  public userId = '';
  public tasks: Array<TaskModel> = [];
  public users: Array<MemberModel> = [];
  public entityType: EntityEnum;
  public entityValue: EntityModel = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coreTaskService: CoreTaskService,
    private coreUsersService: CoreUserService,
    private groupService: CoreGroupService,
    private toastService: ToastService,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnDestroy(): void {
    this.$destroyed.next(null);
    this.$destroyed.complete();
  }

  ngOnInit(): void {
    this.getAuthUser();
  }

  private getAuthUser(): void {
    this.authService.userDataAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(async (user: UserModel) => {
        if (user) {
          this.userId = user.id;
          this.getGroups();
        } else {
          this.userId = null;
        }
      });
  }

  private getGroups(): void {
    this.groupService.getGroupAsObservable()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(() => {
        this.getTasks();
        this.getUsers();
      });
  }

  private getTasks(): void {
    this.coreTaskService.listTask()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(
      tasks =>  this.tasks = tasks,
      async error => await this.toastService.show('TOAST.LIST_TASKS_ERROR', { message: error, origin: 'SettingsPage.getTasks' }
      ));
  }

  public toGetTasks($event: { refresh?: boolean }): void {
    this.entityValue = null;
    this.entityType = null;

    if ($event.refresh) {
      this.getTasks();
    }
  }

  private getUsers(): void {
    this.coreUsersService.listMembers()
      .pipe(takeUntil(this.$destroyed))
      .subscribe(
      users => this.users = users,
      async error => await this.toastService.show('TOAST.LIST_TASKS_ERROR', { message: error, origin: 'SettingsPage.getTasks' }
      ));
  }

  public toGetUsers($event: { refresh?: boolean }): void {
    this.entityValue = null;
    this.entityType = null;

    if ($event.refresh) {
      this.getUsers();
    }
  }

  /**
   * Manage tasks
   */
  public onTaskOptsEvent(task: TaskModel): void {
    this.entityValue = new EntityModel(task.name, task.uid, task);
    this.setEntityType(EntityEnum.TASKS, ModalEnum.OPTIONS);
  }

  public onTaskFormEvent(entityValue = this.entityValue): void {
    this.entityValue = entityValue;

    setTimeout(() => this.setEntityType(EntityEnum.TASKS, ModalEnum.TASK_FORM));
  }

  public async onDeleteTaskEvent(): Promise<void> {
    this.modalService.currentModalValue = ModalEnum.CONFIRM_DELETE;
  }

  /**
   * Manage users
   */
  public onUserOptsEvent(user: MemberModel): void {
    this.entityValue = new EntityModel(user.displayName, user.fk, user);
    this.setEntityType(EntityEnum.USERS, ModalEnum.OPTIONS);
  }

  public onUserFormEvent(): void {
    this.setEntityType(EntityEnum.USERS, ModalEnum.USER_FORM);
  }

  public async onRemoveUserEvent(): Promise<void> {
    this.modalService.currentModalValue = ModalEnum.CONFIRM_DELETE;
  }

  private setEntityType(entityType: EntityEnum, modalType: ModalEnum): void {
    this.entityType = entityType;
    this.modalService.currentModalValue = modalType;
  }

  public clearEntity(): void {
    this.entityValue = null;
  }
}
