namespace NewsQuantified.Infrastructure.Common.Extensions
{
    using System;
    using System.Globalization;
    using System.Runtime.InteropServices;

    using Calendar;

    public static class DateTimeExtensions
    {
        /// <summary>
        /// Convert a long into a DateTime
        /// </summary>
        public static DateTime FromUnixTime(this Int64 self)
        {
            var ret = new DateTime(1970, 1, 1);
            return ret.AddMilliseconds(self);
        }

        /// <summary>
        /// Utility method for converting a .NET DateTime into a unix timestamp
        /// </summary>
        /// <param name="date">DateTime to convert</param>
        /// <returns>A long that is a unix timestamp</returns>
        public static long ToUnixTime(this DateTime date)
        {
            return ((long)(date - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds) * 1000;
        }

        public static bool IsWeekend(this DateTime value)
        {
            return (value.DayOfWeek == DayOfWeek.Sunday || value.DayOfWeek == DayOfWeek.Saturday);
        }

        public static DateTime FindPreviousDayOfWeek(this DateTime currentDate, DayOfWeek day)
        {
            int currentDay = (int)currentDate.DayOfWeek;
            int seekDay = (int)day;
            int daysToAdd;
            if (seekDay <= currentDay)
                daysToAdd = (7 - currentDay) + seekDay;
            else
                daysToAdd = (seekDay - currentDay);
            daysToAdd = daysToAdd - 7;

            return currentDate.AddDays(daysToAdd);
        }

        public static DateTime ToEstTime(this DateTime value)
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
            int offset = tz.GetUtcOffset(value.ToUniversalTime()).Hours;
            DateTime utcTime = value.ToUniversalTime();
            DateTime estTime = utcTime.AddHours(offset);
            return estTime;
        }

        public static DateTime StartOfDay(this DateTime dateTime)
        {
            return dateTime.ChangeTime(0, 0, 0, 0);
        }

        public static DateTime EndOfDay(this DateTime dateTime)
        {
            return dateTime.ChangeTime(23, 59, 59, 00);
        }

        public static DateTime ChangeTime(this DateTime dateTime, int hours, int minutes, int seconds, int milliseconds)
        {
            return new DateTime(
                dateTime.Year,
                dateTime.Month,
                dateTime.Day,
                hours,
                minutes,
                seconds,
                milliseconds,
                dateTime.Kind);
        }

        public static DateTime SetTime(this DateTime dateTime, TimeSpan time)
        {
            return new DateTime(
                dateTime.Year,
                dateTime.Month,
                dateTime.Day,
                time.Hours,
                time.Minutes,
                time.Milliseconds,
                dateTime.Kind);
        }

        /// <summary>
        /// Gets the next date from the year, month and day of current value.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="dayOfWeek">The day of week.</param>
        /// <returns></returns>
        public static DateTime Get(this DateTime value, DayOfWeek dayOfWeek)
        {
            var e = (int)dayOfWeek;
            var s = (int)value.DayOfWeek;

            return s < e ? value.AddDays(e - s) : value.AddDays(-(s - e)).AddDays(7);
        }

        /// <summary>
        /// Gets the previous date from the year, month and day of current value.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="dayOfWeek">The day of week.</param>
        /// <returns></returns>
        public static DateTime GetPrevious(this DateTime value, DayOfWeek dayOfWeek)
        {
            var e = (int)dayOfWeek;
            var s = (int)value.DayOfWeek;

            return s > e ? value.AddDays(e - s) : value.AddDays(-(s - e)).AddDays(-7);
        }

        /// <summary>
        /// Gets the next date from the year and month of current date.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="weekOfMonth">The week of month.</param>
        /// <param name="dayOfWeek">The day of week.</param>
        /// <returns></returns>
        public static DateTime Get(this DateTime value, WeekOfMonth weekOfMonth, DayOfWeek dayOfWeek)
        {
            var startDate = new DateTime(value.Year, value.Month, 1);
            var date = startDate;
            var i = (int)weekOfMonth;

            if (date.DayOfWeek == dayOfWeek && weekOfMonth == WeekOfMonth.First)
                return date;

            if (date.DayOfWeek == dayOfWeek)
                return date.AddDays((int)weekOfMonth * 7);

            var e = (int)dayOfWeek;
            var s = (int)date.DayOfWeek;

            if (s < e)
                date = date.AddDays(e - s);
            else
            {
                date = date.AddDays(-s);

                if (date.Month != startDate.Month)
                    i++;

                date = date.AddDays(e);
            }

            date = date.AddDays(i * 7);

            return date.Month != startDate.Month ? date.AddDays(-7) : date;
        }

        /// <summary>
        /// Gets the next date from the year of current date.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="monthOfYear">The month of year.</param>
        /// <param name="weekOfMonth">The week of month.</param>
        /// <param name="dayOfWeek">The day of week.</param>
        /// <returns></returns>
        public static DateTime Get(this DateTime value, MonthOfYear monthOfYear, WeekOfMonth weekOfMonth, DayOfWeek dayOfWeek)
        {
            var dateTime = new DateTime(value.Year, (int)monthOfYear + 1, 1);
            return dateTime.Get(weekOfMonth, dayOfWeek);
        }

        /// <summary>
        /// Gets the next date.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="year">The year.</param>
        /// <param name="monthOfYear">The month of year.</param>
        /// <param name="weekOfMonth">The week of month.</param>
        /// <param name="dayOfWeek">The day of week.</param>
        /// <returns></returns>
        public static DateTime Get(this DateTime value, int year, MonthOfYear monthOfYear, WeekOfMonth weekOfMonth, DayOfWeek dayOfWeek)
        {
            var dateTime = new DateTime(year, (int)monthOfYear + 1, 1);
            return dateTime.Get(weekOfMonth, dayOfWeek);
        }

        /// <summary>
        /// Gets the observed day.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public static DateTime GetObservedDay(this DateTime value)
        {
            var date = new DateTime(value.Year, value.Month, value.Day);

            switch (value.DayOfWeek)
            {
                case DayOfWeek.Sunday:
                    date = date.AddDays(1);
                    break;
                case DayOfWeek.Saturday:
                    date = date.AddDays(-1);
                    break;
            }

            return date;
        }

        /// <summary>
        /// Gets Good Friday.
        /// </summary>
        /// <value>The good friday.</value>
        public static DateTime GetGoodFriday(this GregorianCalendar value, int year)
        {
            return value.GetEasterSunday(year).AddDays(-2);
        }

        /// <summary>
        /// Gets Easter Sunday.
        /// As noted on : http://www.assa.org.au/edm.html#Computer.
        /// Slightly modified for C#.
        /// </summary>
        /// <value>The Easter Sunday.</value>
        public static DateTime GetEasterSunday(this GregorianCalendar value, int year)
        {
            // EASTER DATE CALCULATION FOR YEARS 1583 TO 4099

            //first 2 digits of year
            int firstDig = year / 100;
            //remainder of year / 19
            int remain19 = year % 19;

            // calculate PFM date
            int temp = (firstDig - 15) / 2 + 202 - 11 * remain19;

            switch (firstDig)
            {
                case 21:
                case 24:
                case 25:
                case 27:
                case 28:
                case 29:
                case 30:
                case 31:
                case 32:
                case 34:
                case 35:
                case 38:
                    temp = temp - 1;
                    break;
                case 33:
                case 36:
                case 37:
                case 39:
                case 40:
                    temp = temp - 2;
                    break;
            }
            temp = temp % 30;

            //table A to E results
            int tA = temp + 21;
            if ((temp == 29) || (temp == 28 & remain19 > 10))
                tA -= 1;

            int tB = (tA - 19) % 7;

            int tC = (40 - firstDig) % 4;
            if (tC == 3 || tC > 1)
                tC++;

            temp = year % 100;
            int tD = (temp + temp / 4) % 7;

            int tE = ((20 - tB - tC - tD) % 7) + 1;

            //find the next Sunday
            int d = tA + tE;
            int m = 3;

            if (d > 31)
            {
                d -= 31;
                m++;
            }

            return new DateTime(year, m, d);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DateTime GetPreviousTradingDay(this DateTime value)
        {
            return LACalendar.GetTradingDayShiftPrev(value.AddDays(-1));
            /*do
            {
                value = value.AddDays(-1);
            }
            while (value.IsWeekend() || holidaySchedule.IsHoliday(value));*/

           // return value;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DateTime GetNextTradingDay(this DateTime value)
        {
            return LACalendar.GetTradingDayShiftNext(value.AddDays(1));
           /* var holidaySchedule = new UnitedStatesHolidaySchedule(value.Year);

            do
            {
                value = value.AddDays(1);

                if (value.Year != holidaySchedule.Year)
                    holidaySchedule = new UnitedStatesHolidaySchedule(value.Year);
            }
            while (value.IsWeekend() || holidaySchedule.IsHoliday(value));

            return value;*/
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool IsTradingDay(this DateTime value)
        {
           // var holidaySchedule = new UnitedStatesHolidaySchedule(value.Year);
           // return !holidaySchedule.IsHoliday(value.Date) && !value.IsWeekend();
            return LACalendar.IsTradingDay(value);
        }

        public static DateTime GetTradingDayBeforeDaysCount(this DateTime value, int daysCount)
        {
            var holidaySchedule = new UnitedStatesHolidaySchedule(value.Year);
            do
            {
                if (value.Year != holidaySchedule.Year)
                    holidaySchedule = new UnitedStatesHolidaySchedule(value.Year);

                value = value.AddDays(-1);

                if (value.IsWeekend() || holidaySchedule.IsHoliday(value))
                    continue;

                daysCount--;
            } while (daysCount > 0);

            return value;
        }

        public static int TradingDaysCount(this DateTime value, DateTime other)
        {
            int count = 1;

            while (value.Date != other.Date)
            {
                value = other.Date > value.Date ? value.AddDays(1) : value.AddDays(-1);

                if (value.IsTradingDay())
                    count++;
            }

            return count;
        }

        public static DateTime AddWeekDays(this DateTime value, int count)
        {
            do
            {
                value = value.AddDays(-1);

                if (value.IsWeekend())
                    continue;

                count--;
            } while (count > 0);

            return value;
        }
    }

    [ComVisible(true)]
    [Serializable]
    public enum MonthOfYear
    {
        January,
        February,
        March,
        April,
        May,
        June,
        July,
        August,
        September,
        October,
        November,
        December
    }

    [ComVisible(true)]
    [Serializable]
    public enum WeekOfMonth
    {
        First = 0,
        Second = 1,
        Third = 2,
        Fourth = 3,
        Last = 4
    }
}