"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, PartyPopper } from "lucide-react";
import { getCompanySettings } from "@/lib/services/system/settingsService";
import { Holiday, WorkingHours } from "@/components/admin/settings/types";

interface DayInfo {
  date: Date;
  label: string;
  shortDay: string;
  isToday: boolean;
  isWeekend: boolean;
  holiday: Holiday | null;
}

function getNextSevenDays(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function isHolidayOnDate(holiday: Holiday, date: Date): boolean {
  const dateStr = toDateStr(date);
  if (holiday.endDate) {
    return dateStr >= holiday.date && dateStr <= holiday.endDate;
  }
  return holiday.date === dateStr;
}

export default function WorkScheduleWidget() {
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [days, setDays] = useState<DayInfo[]>([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    getCompanySettings().then((settings) => {
      setWorkingHours(settings.workingHours);

      const weekendDayNames = settings.weekendDays || ['Friday', 'Saturday'];
      const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const next7 = getNextSevenDays();

      const dayInfos: DayInfo[] = next7.map((date) => {
        const isWeekend = weekendDayNames.includes(DAY_NAMES[date.getDay()]);
        const holiday =
          settings.holidays.find((h) => isHolidayOnDate(h, date)) || null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return {
          date,
          label: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          shortDay: date.toLocaleDateString("en-US", { weekday: "short" }),
          isToday: date.getTime() === today.getTime(),
          isWeekend,
          holiday,
        };
      });

      setDays(dayInfos);

      // upcoming holidays in next 30 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const in30 = new Date(today);
      in30.setDate(today.getDate() + 30);

      const upcoming = settings.holidays
        .filter((h) => {
          const hStart = new Date(h.date);
          const hEnd = h.endDate ? new Date(h.endDate) : hStart;
          // show if holiday hasn't ended yet and starts within 30 days
          return hEnd >= today && hStart <= in30;
        })
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        .slice(0, 3);

      setUpcomingHolidays(upcoming);
    });
  }, []);

  if (!workingHours) return null;

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Work Schedule
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(workingHours.startTime)} –{" "}
          {formatTime(workingHours.endTime)}
        </div>
      </div>

      {/* 7-day row */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-5">
        {days.map((day) => {
          const isOff = day.isWeekend || !!day.holiday;

          let bg = "bg-gray-50 border-gray-100";
          let dayColor = "text-gray-700";
          let dateColor = "text-gray-500";
          let badge = null;

          if (day.isToday && !isOff) {
            bg = "bg-blue-600 border-blue-600";
            dayColor = "text-blue-100";
            dateColor = "text-white";
          } else if (day.holiday) {
            bg = "bg-amber-50 border-amber-200";
            dayColor = "text-amber-700";
            dateColor = "text-amber-600";
            badge = (
              <span className="mt-1 text-[9px] leading-tight text-amber-600 font-semibold text-center line-clamp-1 px-0.5">
                {day.holiday.name}
              </span>
            );
          } else if (day.isWeekend) {
            bg = "bg-gray-100 border-gray-200";
            dayColor = "text-gray-400";
            dateColor = "text-gray-400";
            badge = (
              <span className="mt-1 text-[9px] text-gray-400 font-medium">
                Off
              </span>
            );
          } else if (day.isToday) {
            bg = "bg-blue-600 border-blue-600";
            dayColor = "text-blue-100";
            dateColor = "text-white";
          }

          return (
            <div
              key={toDateStr(day.date)}
              className={`flex flex-col items-center justify-start border rounded-xl sm:rounded-2xl py-2 sm:py-3 px-1 min-h-[72px] sm:min-h-[80px] ${bg}`}
            >
              <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${dayColor}`}>
                {day.shortDay}
              </span>
              <span className={`text-sm sm:text-base font-bold mt-0.5 ${dateColor}`}>
                {day.date.getDate()}
              </span>
              {badge}
              {!isOff && !day.isToday && (
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400" />
              )}
              {day.isToday && (
                <span className="mt-1 text-[9px] text-blue-100 font-semibold">
                  Today
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-500 mb-4 sm:mb-5">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
          Today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
          Work Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />
          Weekend
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          Holiday
        </span>
      </div>

      {/* Upcoming holidays */}
      {upcomingHolidays.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <PartyPopper className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">
              Upcoming Holidays
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingHolidays.map((h) => {
              const todayMs = new Date().setHours(0, 0, 0, 0);
              const hStart = new Date(h.date).getTime();
              const hEnd = h.endDate ? new Date(h.endDate).getTime() : hStart;
              // if today is within the holiday range, daysLeft = 0 (Today!)
              const daysLeft = todayMs >= hStart && todayMs <= hEnd
                ? 0
                : Math.ceil((hStart - todayMs) / (1000 * 60 * 60 * 24));
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {h.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(h.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {h.endDate &&
                        h.endDate !== h.date &&
                        ` – ${new Date(h.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {daysLeft === 0
                      ? "Today!"
                      : daysLeft === 1
                        ? "Tomorrow"
                        : `${daysLeft} days`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
