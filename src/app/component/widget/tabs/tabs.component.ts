import {Component, OnInit} from '@angular/core';
import {TabsNameEnum, TabsTypeEnum} from './tabs.enum';
import {WeekDayConst} from "../../../_constant/weekday.const";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  public tabs: Array<{
    name: TabsNameEnum;
    route: string;
    type: TabsTypeEnum;
    context?: any;
  }> = [
    {
      name: TabsNameEnum.TODAY,
      route: 'today',
      type: TabsTypeEnum.TODAY
    },
    {
      name: TabsNameEnum.CONFIG,
      route: 'settings',
      type: TabsTypeEnum.IMAGE
    }
  ];

  public tabType = TabsTypeEnum;

  ngOnInit() {
    this.setTodayWidget();
  }

  private setTodayWidget(): void {
    const todayDate = new Date();
    const today = todayDate.getDate();
    const todayWeekday = WeekDayConst[todayDate.getDay()];

    this.tabs[0].context = {
      today,
      todayWeekday
    };
  }

}
