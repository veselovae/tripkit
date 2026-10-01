import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";

export const formatDateTime = (value: string, locale = "en") => {
  return format(new Date(value), "dd MMM yyyy, HH:mm", {
    locale: locale === "ru" ? ru : enUS,
  });
};

export const toIsoDateTime = (value: string) => {
  return new Date(value).toISOString();
};

export const toDateTimeLocal = (value: string) => {
  const date = new Date(value);

  const offset = date.getTimezoneOffset();

  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};
