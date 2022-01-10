import { format, isValid, parseISO } from "date-fns";

export const dateFormat = "dd.MM.yyyy";
export const dateTimeFormat = "dd.MM.yyyy HH:mm";
export const standardDateTimeFormat = "dd-MM-yyyy HH:mm";
export const standardDateFormat = "dd-MM-yyyy";

export const prettyDateFormat = "MMM d, yyyy";
export const prettyTime = "p";

export const getMonthsList = () => {
  const monthsList = [];
  for (let i = 1; i <= 12; i++) {
    monthsList.push(`${i}`.padStart(2, "0"));
  }
  return monthsList;
};


export const getDayList = () => {
  const monthsList = [];
  for (let i = 1; i <= 31; i++) {
    monthsList.push(`${i}`.padStart(2, "0"));
  }
  return monthsList;
};

export const printDateTime = (value: any): string => {
  if (typeof value === "string") {
    return printDateTime(strToDate(value));
  }
  if (isValid(value)) return format(value, dateTimeFormat);
  else return "";
};

export const isoDateString = (value: any): string => {
  if (typeof value === "string") {
    return strToDate(value)?.toISOString() || "";
  }
  if (isValid(value)) return value?.toISOString();
  else return "";
};

export const printBirthday = (value: any): string => {
  if (typeof value === "string") {
    return printBirthday(strToDate(value));
  }
  if (isValid(value)) return format(value, "dd MMM");
  else return "";
};

export const printMonth = (value: any): string => {
  if (typeof value === "string") {
    return printMonth(strToDate(value));
  }
  if (isValid(value)) return format(value, "MMM");
  else return "";
};

export const printDay = (value: any): string => {
  if (typeof value === "string") {
    return printDay(strToDate(value));
  }
  if (isValid(value)) return format(value, "dd");
  else return "";
};

export const printShortDate = (value: any): string => {
  if (typeof value === "string") {
    return printShortDate(strToDate(value));
  }
  if (isValid(value)) return format(value, "dd MMM");
  else return "";
};

export const printDayOfMonth = (value: any): string => {
  if (typeof value === "string") {
    return printDayOfMonth(strToDate(value));
  }
  if (isValid(value)) return format(value, "dd");
  else return "";
};

export const printDate = (value: any): string => {
  if (typeof value === "string") {
    return printDate(strToDate(value));
  }
  if (isValid(value)) return format(value, dateFormat);
  else return "";
};

export const printStdDate = (value: any): string => {
  if (typeof value === "string") {
    return printDate(strToDate(value));
  }
  if (isValid(value)) return format(value, standardDateFormat);
  else return "";
};

export const printStdDatetime = (value: any): string => {
  if (typeof value === "string") {
    return printDate(strToDate(value));
  }
  if (isValid(value)) return format(value, standardDateTimeFormat);
  else return "";
};

export const printPrettyDate = (value: any): string => {
  if (typeof value === "string") {
    return printPrettyDate(strToDate(value));
  }
  if (isValid(value)) return format(value, prettyDateFormat);
  else return "";
};

export const printPrettyTime = (value: any): string => {
  if (typeof value === "string") {
    return printPrettyTime(strToDate(value));
  }
  if (isValid(value)) return format(value, "p");
  else return "";
};

export const strToDate = (str: string): Date | null => {
  try {
    return parseISO(str);
  } catch (e) {
    return null;
  }
};
