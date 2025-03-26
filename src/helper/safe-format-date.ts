import { isValidDate } from 'rxjs/internal/util/isDate';
import { format } from 'date-fns';

export const safeFormatDate = (
  date: Date | null,
  dateFormat: string,
): string => {
  return isValidDate(date) ? format(date, dateFormat) : '';
};
