export const calculateDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = d2.getTime() - d1.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const getQuarterDates = (quarter, year = 2025) => {
  const quarters = {
    'Q1': { start: new Date(year, 0, 1), end: new Date(year, 2, 31), label: '01/01 🡆 31/03' },
    'Q2': { start: new Date(year, 3, 1), end: new Date(year, 5, 30), label: '01/04 🡆 30/06' },
    'Q3': { start: new Date(year, 6, 1), end: new Date(year, 8, 30), label: '01/07 🡆 30/09' },
    'Q4': { start: new Date(year, 9, 1), end: new Date(year, 11, 31), label: '01/10 🡆 31/12' }
  };
  return quarters[quarter];
};

export const isDateInQuarter = (date, quarter) => {
  const d = new Date(date);
  const quarterData = getQuarterDates(quarter);
  return d >= quarterData.start && d <= quarterData.end;
};
