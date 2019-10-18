import moment from 'moment';
let utilsForDateObject: (dateObject: moment.Moment, dateType: string) => string | number;

utilsForDateObject = (dateObject, dateType) => {
  switch (dateType) {
    case 'daysInMonth':
      return dateObject.daysInMonth();
    case 'year':
      return dateObject.format('Y');
    case 'currentDay':
      return dateObject.format('D');
    case 'firstDayOfMonth':
      const firstDay: string = moment(dateObject)
        .startOf('month')
        .format('d');
      return firstDay;
    case 'month':
      return dateObject.format('MMMM');
    default:
      return '';
  }
};

export interface InterfaceEvent {
  city: string;
  country: string;
  startDate: string;
  twitter: string;
  url: string;
  endDate?: string;
  name: string;
}

export { utilsForDateObject };
