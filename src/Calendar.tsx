import React from 'react';
import './Calendar.css';
import {FullDate, Month, MonthYear, Year, Day} from './FullDate';

interface MonthPickerProps {
  selectedDate: FullDate,
  selectDay: (day: FullDate) => void
}

class MonthPicker extends React.Component<MonthPickerProps> {
  renderMonthButton(month: MonthYear) {
    let newDate = new FullDate(1, month.month(), month.year().number());
    return <button className="month-button" key={month.getMonthName()} onClick={() => {this.props.selectDay(newDate)}}>{month.getMonthName()}</button>;
  }

  renderMonths() {
    let currentYear = this.props.selectedDate.year();
    return Array.from(currentYear.getMonthYears(1, 12), month => this.renderMonthButton(month));
  }

  render() {
    return(
      <div>
        <div className="select-a-month">Select A Month</div>
        <div className="months">{this.renderMonths()}</div>
      </div>
    );
  }
}

interface YearPickerProps {
  selectedDate: FullDate,
  selectDay: (day: FullDate) => void
}

class YearPicker extends React.Component<YearPickerProps> {
  renderYearButton(year: Year) {
    let newDate = new FullDate(1, this.props.selectedDate.monthYear().month(), year.number());
    return <button className="year-button" key={year.number()} onClick={() => {this.props.selectDay(newDate)}}>{year.number()}</button>;
  }

  renderYears() {
    let firstYear = this.props.selectedDate.year().number() - 4;
    let lastYear = this.props.selectedDate.year().number() + 4;
    let yearButtons = [];

    for(let i = firstYear; i <= lastYear; i++) {
      yearButtons.push(this.renderYearButton(new Year(i)));
    }

    return yearButtons;
  }

  render() {
    return(
      <div>
      <div className="select-a-year">Select A Year</div>
        <div className="years">{this.renderYears()}</div>
      </div>
    );
  }
}

interface DayButtonProps {
  date: FullDate, 
  selected: boolean, 
  selectDay: (day: FullDate) => void,
  currentMonth: string,
  today: string
}

class DayButton extends React.Component<DayButtonProps> {
  render() {
    let selected = "";
    if(this.props.selected) {
      selected = "selected";
    }
    return(
      <button className={`day-button ${this.props.currentMonth} ${this.props.today} ${selected}`} onClick={() => {this.props.selectDay(this.props.date)}}>
        {this.props.date.day()}
      </button>
    );
  }
}

interface MonthCalendarProps {
  selectedDate: FullDate, 
  selectDay: (day: FullDate) => void
}

class MonthCalendar extends React.Component<MonthCalendarProps> {
  renderDay(date: FullDate, selected: boolean, currentMonth: boolean): JSX.Element {
    let monthClass = "";
    let todayClass = "";
    if(currentMonth) {
      monthClass = "current-month";
    }
    if(date.isSameDay(new FullDate(new Date()))) {
      todayClass = "today";
    }
    return <DayButton date={date} selected={selected} selectDay={this.props.selectDay} 
            key={date.day()+date.monthYear().getMonthName()} currentMonth={monthClass} today={todayClass} />
  }

  renderMonth(date: FullDate): JSX.Element[] {
    let month = date.monthYear();
    let daysInMonth = month.numberOfDaysInMonth();
    let daysBeforeMonth = month.getFirstDayOfMonth().getDayOfTheWeek() - 1;
    let daysAfterMonth = (daysInMonth + daysBeforeMonth)%7;
    if(daysAfterMonth === 0) {
      daysAfterMonth = 7;
    }

    let prevMonth = month.getRelativeMonth(-1);
    let nextMonth = month.getRelativeMonth(1);
    let daysInPrevMonth = prevMonth.numberOfDaysInMonth();

    return (
      Array.from(prevMonth.getDaysInMonth(daysInPrevMonth - daysBeforeMonth + 1, daysInPrevMonth), d => this.renderDay(d, d.isSameDay(date), false))
      .concat(Array.from(month.getDaysInMonth(1, daysInMonth), d => this.renderDay(d, d.isSameDay(date), true)))
      .concat(Array.from(nextMonth.getDaysInMonth(1, 7 - daysAfterMonth), d => this.renderDay(d, d.isSameDay(date), false)))
    );
  }

  renderDaysOfWeek() {
    return Object.keys(Day)
            .filter(k => typeof Day[k as any] === "number")
            .map(name => <div key={name}>{name}</div>);
  }

  render() {
    return (
      <div>
        <div className="day-names">
          {this.renderDaysOfWeek()}
        </div>
        <div className="days">
          {this.renderMonth(this.props.selectedDate)}
        </div>
      </div>
    );
  }
}

interface MonthNavigationProps {
  selectedDate: FullDate, 
  navigateMonth: (day: FullDate) => void
}

class MonthNavigation extends React.Component<MonthNavigationProps> {
  render() {
    let currentMonth = this.props.selectedDate.monthYear();
    let startPrevMonth = currentMonth.getRelativeMonth(-1).getFirstDayOfMonth();
    let startNextMonth = currentMonth.getRelativeMonth(1).getFirstDayOfMonth();
    return (
      <div className="nav-buttons">
        <button className="prev-month" onClick={() => {this.props.navigateMonth(startPrevMonth)}}>Prev</button>
        <button className="next-month" onClick={() => {this.props.navigateMonth(startNextMonth)}}>Next</button>
      </div>
    );
  }
}

enum ActiveView {
  MonthCal,
  MonthPicker,
  YearPicker
}

interface CalendarState {
  selectedDate: FullDate,
  activeView: ActiveView
}

interface CalendarProps {
  currentDate: Date;
}

class Calendar extends React.Component<CalendarProps, CalendarState> {
  constructor(props: CalendarProps) {
    super(props);
    this.state = {selectedDate: new FullDate(props.currentDate), activeView: ActiveView.MonthCal}
  }

  setView(view: ActiveView) {
    if(view === this.state.activeView) {
      this.setState({activeView: ActiveView.MonthCal});
    } else {
      this.setState({activeView: view});
    }
  }

  displayView(view: ActiveView) {
    if(view === this.state.activeView) {
      return "active";
    } else {
      return "not-active";
    }
  }

  render() {
    console.log("Date State: " + this.state.selectedDate.day()
     + " " + this.state.selectedDate.monthYear().month()
     + " " + this.state.selectedDate.year().number());
    console.log("Active view: " + this.state.activeView);
    return (
      <div className="calendar">
        <h1>Calendar</h1>
        <div className="date-picker">
          <div className="header">
            <div className="month-navigation">
              <MonthNavigation selectedDate={this.state.selectedDate} navigateMonth={(selectedDate) => {this.setState({selectedDate: selectedDate, activeView: ActiveView.MonthCal})}}/>
            </div>
            <div className="month-tab">
              <button className="current-month" onClick={() => {this.setView(ActiveView.MonthPicker)}}>{this.state.selectedDate.monthYear().getMonthName()}</button>
            </div>
            <div className="year-tab">
              <button className="current-year" onClick={() => {this.setView(ActiveView.YearPicker)}}>{this.state.selectedDate.year().number()}</button>
            </div>
          </div>
          <div className={`month-picker ${this.displayView(ActiveView.MonthPicker)}`}>
            <MonthPicker selectedDate={this.state.selectedDate} selectDay={(selectedDate) => {this.setState({selectedDate: selectedDate, activeView: ActiveView.MonthCal})}}/>
          </div>
          <div className={`year-picker ${this.displayView(ActiveView.YearPicker)}`}>
            <YearPicker selectedDate={this.state.selectedDate} selectDay={(selectedDate) => {this.setState({selectedDate: selectedDate, activeView: ActiveView.MonthCal})}}/>
          </div>
        </div>
        <div className={`day-button ${this.displayView(ActiveView.MonthCal)}`}>
          <MonthCalendar selectedDate={this.state.selectedDate} selectDay={(selectedDate) => {this.setState({selectedDate})}}/>
        </div>
      </div>
    );
  }
}

export default Calendar;
