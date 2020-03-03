
export enum Month {
    January = 1,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
  }
  
  export enum Day {
    Mon = 1,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
  }
  
  export class Year {
    private readonly _number: number;
  
    constructor(number: number) {
      this._number = number;
    }
  
    number() {
      return this._number;
    }
  
    *getMonthYears(start: number, end: number) {
      for (let i = start; i <= end; i++) {
        let month = new MonthYear(i, new Year(this._number));
        yield month;
      }
    }
  }
  
  export class MonthYear {
    private readonly _month: Month;
    private readonly _year: Year;
  
    constructor(month: Month, year: Year) {
      this._month = month;
      this._year = year;
    }
  
    month() {
      return this._month;
    }
  
    year() {
      return this._year;
    }
  
    getMonthName() {
      return Month[this._month];
    }
  
    numberOfDaysInMonth() {
      const daysInMonth = new Date(this._year.number(), this._month, 0).getDate();
      return daysInMonth;
    }
  
    *getDaysInMonth(start: number, end: number) {
      for (let i = start; i <= end; i++) {
        let day = new FullDate(i, this._month, this._year.number());
        yield day;
      }
    }
  
    getRelativeMonth(offset: number): MonthYear {
      let newMonth;
  
      let newMonthIndex = this._month + offset;
      let newYearIndex = this._year.number();
  
      if(newMonthIndex > 12) {
        newMonthIndex = newMonthIndex - 12;
        newYearIndex++;
      } else if(newMonthIndex < 1) {
        newMonthIndex = newMonthIndex + 12;
        newYearIndex--;
      }
  
      return new MonthYear(newMonthIndex, new Year(newYearIndex));
    }
  
  
    getFirstDayOfMonth() {
      let firstDayOfMonth = new FullDate(new Date(this._year.number(),this._month-1,1));
      return firstDayOfMonth; 
    }
  }
  
  export class FullDate {
    private readonly _day: number;
    private readonly _monthYear: MonthYear;
    private readonly _year: Year;
  
    constructor(...args: any[]) {
      if(args.length === 1) {
        if(args[0] instanceof Date) {
          this._day = args[0].getDate();
          this._year = new Year(args[0].getFullYear());
          this._monthYear = new MonthYear(args[0].getMonth()+1,this._year);
        } else {
          throw new Error("argument is not of type Date");
        }
      } else {
        this._day = args[0];
        this._year = new Year(args[2]);
        this._monthYear = new MonthYear(args[1],this._year);
      }
    }
  
    day() {
      return this._day;
    }
  
    monthYear() {
      return this._monthYear;
    }
  
    year() {
      return this._year;
    }
  
    getDayOfTheWeek() {
      let dayOfWeek = new Date(this.year().number(), this.monthYear().month()-1, this.day()).getDay();
  
      if(dayOfWeek === 0) {
        dayOfWeek = 7;
      }
      return dayOfWeek;
    }
  
    isSameDay(otherDay: FullDate) {
      return (this.day()===otherDay.day() 
        && this.monthYear().month()===otherDay.monthYear().month() 
        && this.year().number()===otherDay.year().number());
    }
  
  }
  
  