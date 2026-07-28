/**
 * Every weekday owns a colour. Tasks inherit the colour of the day they
 * belong to, and it shows up as borders, badges, progress bars, timeline
 * markers and the soft background gradient of whichever day is selected.
 *
 * Indexes follow `Date.prototype.getDay()`: 0 = Sunday ... 6 = Saturday.
 */
export interface WeekdayColor {
  index: number;
  name: string;
  short: string;
  hex: string;
  rgb: string; // "r g b" — usable inside rgb(var(--x) / <alpha>)
}

export const WEEKDAY_COLORS: WeekdayColor[] = [
  { index: 0, name: "Sunday", short: "Sun", hex: "#F0334D", rgb: "240 51 77" },
  { index: 1, name: "Monday", short: "Mon", hex: "#3358E8", rgb: "51 88 232" },
  { index: 2, name: "Tuesday", short: "Tue", hex: "#F2790C", rgb: "242 121 12" },
  { index: 3, name: "Wednesday", short: "Wed", hex: "#17A673", rgb: "23 166 115" },
  { index: 4, name: "Thursday", short: "Thu", hex: "#8B5CF6", rgb: "139 92 246" },
  { index: 5, name: "Friday", short: "Fri", hex: "#EC4899", rgb: "236 72 153" },
  { index: 6, name: "Saturday", short: "Sat", hex: "#F5B300", rgb: "245 179 0" },
];

export function getWeekdayColorByIndex(day: number): WeekdayColor {
  return WEEKDAY_COLORS[((day % 7) + 7) % 7];
}

/** `date` accepts a `Date` or a `yyyy-MM-dd` string, parsed as local time. */
export function getWeekdayColor(date: Date | string): WeekdayColor {
  const d = typeof date === "string" ? parseLocalDate(date) : date;
  return getWeekdayColorByIndex(d.getDay());
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/** A very soft radial gradient tint for the app background. */
export function weekdaySoftGradient(color: WeekdayColor, dark = false): string {
  const alpha1 = dark ? 0.16 : 0.1;
  const alpha2 = dark ? 0.05 : 0.04;
  return `radial-gradient(circle at 15% 0%, rgb(${color.rgb} / ${alpha1}), transparent 60%), radial-gradient(circle at 100% 20%, rgb(${color.rgb} / ${alpha2}), transparent 55%)`;
}
