import React, { useState } from 'react';
import moment from 'moment';
import './styles.scss';

import { utilsForDateObject, InterfaceEvent } from './utils';

const Calendar: React.FC = () => {
  const events: InterfaceEvent[] = [];

  const [localState, setLocalState] = useState({
    dateObject: moment(),
    allEvents: events,
  });

  if (localState.allEvents.length === 0) {
    fetch(
      `https://raw.githubusercontent.com/tech-conferences/conference-data/master/conferences/2019/javascript.json`
    )
      .then(response => response.json())
      .then(commits => setLocalState({ ...localState, allEvents: commits }));
  }

  if (localState.allEvents.length > 0) {
    const blanks: JSX.Element[] = [];
    for (let i: number = 0; i < utilsForDateObject(localState.dateObject, 'firstDayOfMonth'); i++) {
      const elem: JSX.Element = <td key={1000 - i}>{''}</td>;
      blanks.push(elem);
    }

    const currEvents: InterfaceEvent[] = localState.allEvents.filter(e => {
      if (
        localState.dateObject.format('M') === moment(e.startDate).format('M') ||
        localState.dateObject.format('M') === moment(e.endDate).format('M')
      ) {
        return true;
      } else {
        return false;
      }
    });

    const daysInMonth: JSX.Element[] = [];
    for (let d: number = 1; d <= utilsForDateObject(localState.dateObject, 'daysInMonth'); d++) {
      const dStr: string = d + '';
      const currentDay: string =
        dStr === utilsForDateObject(localState.dateObject, 'currentDay') &&
        utilsForDateObject(localState.dateObject, 'month') === moment().format('MMMM')
          ? 'today'
          : '';

      const eventOnCurDay: InterfaceEvent[] = [];
      if (currEvents.length > 0) {
        currEvents.forEach(event => {
          if (
            moment(
              `${localState.dateObject.format('YYYY')}-${localState.dateObject.format('MM')}-${d}`
            ).isBetween(moment(event.startDate), moment(event.endDate), 'day', '[]')
          ) {
            eventOnCurDay.push(event);
          }
        });
      }
      const day: JSX.Element = (
        <td key={d} className={`${currentDay} cell full`}>
          <div className={'date'}>{d}</div>
          <div>
            {eventOnCurDay.map((e, i) => {
              return (
                <div className={'event-info'} key={i}>
                  <a key={i} className={'link'} href={e.url}>
                    {e.name}
                  </a>
                  <p className={'city'}>{e.city}</p>
                </div>
              );
            })}
          </div>
        </td>
      );

      daysInMonth.push(day);
    }

    const totalSlots: JSX.Element[] = [...blanks, ...daysInMonth];
    const rows: JSX.Element[][] = [];
    let cells: JSX.Element[] = [];
    totalSlots.forEach((day, i) => {
      if (i % 7 !== 0) {
        cells.push(day);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(day);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });
    const weekDays: string[] = moment.weekdaysShort();
    const weekDaysView: JSX.Element[] = weekDays.map(day => {
      return (
        <th className={'week-days'} key={day}>
          {day}
        </th>
      );
    });

    const daysView: JSX.Element[] = rows.map((d, i) => {
      return <tr key={i}>{d}</tr>;
    });

    const onPrev: () => void = () => {
      setLocalState({ ...localState, dateObject: localState.dateObject.subtract(1, 'month') });
    };
    const onNext: () => void = () => {
      setLocalState({ ...localState, dateObject: localState.dateObject.add(1, 'month') });
    };
    return (
      <div>
        <div className="calendar-navi">
          <span onClick={onPrev} className="nav-button">
            {'<===='}
          </span>
          <span>{utilsForDateObject(localState.dateObject, 'month')}</span>
          <span>{utilsForDateObject(localState.dateObject, 'year')}</span>
          <span onClick={onNext} className="nav-button">
            {'====>'}
          </span>
        </div>

        <div>
          <table className="table">
            <thead>
              <tr>{weekDaysView}</tr>
            </thead>
            <tbody>{daysView}</tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <div className={'loading'}>Loading...</div>;
  }
};

export default Calendar;
