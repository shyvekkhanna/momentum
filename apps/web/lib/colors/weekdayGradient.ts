import type { WeekdayColor } from "@momentum/core";

/** A very soft radial gradient tint for the app background (CSS, web-only). */
export function weekdaySoftGradient(color: WeekdayColor, dark = false): string {
  const alpha1 = dark ? 0.16 : 0.1;
  const alpha2 = dark ? 0.05 : 0.04;
  return `radial-gradient(circle at 15% 0%, rgb(${color.rgb} / ${alpha1}), transparent 60%), radial-gradient(circle at 100% 20%, rgb(${color.rgb} / ${alpha2}), transparent 55%)`;
}
