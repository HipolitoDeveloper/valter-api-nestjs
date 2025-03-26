import { toZonedTime } from 'date-fns-tz';

const convertToAmericaSPTimezone = (date: string) => {
  const timeZone = 'America/Sao_Paulo';
  return toZonedTime(date, timeZone);
};

export { convertToAmericaSPTimezone };
