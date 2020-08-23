import {WeekDaysArray} from '../constants/days-date.constant';

interface calculatorOpt {
  usersArray: Array<string>;
  date: string;
  taskDays: Array<string>;
}

const dayOfTheYear = (date: string | Date): number => {
  const now = new Date(date);
  const start = new Date(now.getFullYear(), 0, 0);
  // @ts-ignore
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const getWeekDayOfYearDay = (day: number): number => {
  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, 0);
  const dayDate = new Date(date.setDate(day));
  return dayDate.getDay();
}

const calculateTaskUserIndex = (opt: calculatorOpt, taskUserIndexMod = 0): string | null => {
  const daysOfTheYear = new Date(opt.date).getFullYear() % 4 === 0 ? 366 : 365;
  let daysOfTheYearIndex = 0;
  let user = null;
  let taskUserIndex = taskUserIndexMod;

  while(daysOfTheYearIndex <= daysOfTheYear) {
    // If `opt.taskDays` has this weekday
    if (opt.taskDays.find(day => day === WeekDaysArray[getWeekDayOfYearDay(daysOfTheYearIndex)])) {
      if (dayOfTheYear(opt.date) === daysOfTheYearIndex) {
        // console.warn('Day of the year', daysOfTheYearIndex);
        user = opt.usersArray[taskUserIndex];
        daysOfTheYearIndex = daysOfTheYear;
      } else {
        taskUserIndex = taskUserIndex + 1 < opt.usersArray.length ? taskUserIndex + 1 : 0;
      }
    }

    daysOfTheYearIndex++;
  }

  return user;
};

export const taskUtil = {
  calculateTaskUserIndex
};

// const opt = {
//   usersArray: [
//     'Kebin',
//     'Emma',
//     'Bob'
//   ],
//   date: new Date('8/13/2020'),
//   taskDays: [
//     'MON',
//     'THU',
//   ]
// };
//
// console.log(`
//   Task info for date: "${new Date(opt.date).toDateString()}"
//   ${calculateTaskUserIndex(opt) ? calculateTaskUserIndex(opt) : `Day "${weekDaysArray[opt.date.getDay()]}" is not part of this task`}
// `);
