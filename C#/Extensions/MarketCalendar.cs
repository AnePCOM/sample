namespace NewsQuantified.Infrastructure.Common.Calendar
{
    using System;

    using Extensions;

    [Flags]
    public enum DateRange
    {
        Range = -1,
        Today = 1,
        Yesterday = 2,
        Week = 4,
        OneMonth = 8,
        ThreeMonths = 16,
        Year = 32,
        All = 64, // TODO: Do we really need this?

        IntraDay = Today | Yesterday | Week
    }

    [Serializable]
    public class TradingTimeRange
    {
        /// <summary>
        /// Main time range. Bounds to the requested datetime range.
        /// </summary>
        public ITimeRange TimeRange { get; private set; }

        /// <summary>
        /// Aligned to trading session datetime range.
        /// This means that this property always holds value [start_day] - 1 day 4:00:00 pm (after market hours)
        /// We use this datetime range for news and charts.
        /// </summary>
        public ITimeRange AlignedTimeRange { get; private set; }


        /// <summary>
        /// Holds extended time to midnight.
        /// [start_day] - 1 day 0:00 - [end_day] 0:00
        /// We use it for charts.
        /// </summary>
        public ITimeRange ExtendedTimeRange { get; private set; }

        public TradingTimeRange(DateTime from, DateTime to)
        {
            TimeRange = new TimeRange(from.StartOfDay(), to.EndOfDay());

            var yesterday = TimeRange.Start.GetPreviousTradingDay();

            AlignedTimeRange = new TimeRange(yesterday.ChangeTime(16, 0, 0, 0), to.EndOfDay());
            ExtendedTimeRange = new TimeRange(yesterday.StartOfDay(), to.EndOfDay());
        }

        public TradingTimeRange(ITimeRange timeRange)
        {
            TimeRange = timeRange;

            var yesterday = TimeRange.Start.GetPreviousTradingDay();

            AlignedTimeRange = new TimeRange(yesterday.ChangeTime(16, 0, 0, 0), TimeRange.End);
            ExtendedTimeRange = new TimeRange(yesterday.StartOfDay(), TimeRange.End);
        }
    }

    public partial class MarketCalendar
    {
        private static TimeSpan MarketOpenTime = new TimeSpan(9, 30, 0);
        private static TimeSpan MarketCloseTime = new TimeSpan(16, 0, 0);

        private static DateTime MinDateTime = new DateTime(2006, 1, 1);

        public static TradingTimeRange CalculateTradingTimeRange(DateRange dateRange, DateTime from, DateTime to)
        {
            if (!from.IsTradingDay())
                from = from.GetPreviousTradingDay();

            if (!to.IsTradingDay())
                to = to.GetPreviousTradingDay();

            if (dateRange == DateRange.Range)
            {
                return CalculateTradingTimeRange(from, to);
            }

            return CalculateTradingTimeRange(dateRange);
        }

        public static TradingTimeRange CalculateTradingTimeRange(DateTime from, DateTime to)
        {
            return new TradingTimeRange(from, to);
        }

        public static TradingTimeRange CalculateTradingTimeRange(DateRange dateRange)
        {
            var today = DateTime.UtcNow.ToEstTime();

            switch (dateRange)
            {
                case DateRange.Today: return CalculateTradingTimeRangeForToday();
                case DateRange.Yesterday: return new TradingTimeRange(today.GetPreviousTradingDay(), today.GetPreviousTradingDay());
                case DateRange.Week:
                    {
                        var start = today.AddWeekDays(4);
                        return new TradingTimeRange(start, today);
                    }
                case DateRange.IntraDay:
                    {
                        if ((dateRange & DateRange.Today) != 0)
                        {
                            // Today is a special case and should be calculated in a different way
                            return CalculateTradingTimeRangeForToday();
                        }
                        if ((dateRange & DateRange.Yesterday) != 0)
                        {
                            return new TradingTimeRange(today.GetPreviousTradingDay(), today.GetPreviousTradingDay());
                        }

                        var start = today.AddWeekDays(4);
                        return new TradingTimeRange(start, today);
                    }
                case DateRange.OneMonth:
                    {
                        var start = today.AddMonths(-1);
                        if (!start.IsTradingDay())
                            start = start.GetPreviousTradingDay();

                        return new TradingTimeRange(start, today);
                    }
                case DateRange.ThreeMonths:
                    {
                        var start = today.AddMonths(-3);
                        if (!start.IsTradingDay())
                            start = start.GetPreviousTradingDay();

                        return new TradingTimeRange(start, today);
                    }
                case DateRange.Year:
                    {
                        var start = today.AddYears(-1);
                        if (!start.IsTradingDay())
                            start = start.GetPreviousTradingDay();

                        return new TradingTimeRange(start, today);
                    }
                case DateRange.All:
                    {
                        return new TradingTimeRange(MinDateTime, today);
                    }
            }

            throw new InvalidOperationException("WUT? Use overrided CalculateTradingTimeRange for custom date ranges");
        }

        private static TradingTimeRange CalculateTradingTimeRangeForToday()
        {
            var today = DateTime.UtcNow.ToEstTime();
            if (!today.IsTradingDay())
                today = today.GetPreviousTradingDay();

            if (today.TimeOfDay <= MarketOpenTime)
            {
                // pre-market time
                return CalculateTradingTimeRange(today, today);
            }

            if (today.TimeOfDay >= MarketCloseTime)
            {
                // after-market time
                return CalculateTradingTimeRange(today.ChangeTime(16, 0, 0, 0), today.EndOfDay());
            }

            return CalculateTradingTimeRange(today, today.ChangeTime(16, 0, 0, 0));
        }

        public static TradingTimeRange GetRandomTimeForMarketSession(MarketSession marketSession)
        {
            var today = DateTime.UtcNow.ToEstTime();
            if (!today.IsTradingDay())
                today = today.GetPreviousTradingDay();

            switch (marketSession)
            {
                case MarketSession.Pre:
                    {
                        var start = today.Date;
                        var end = new TimeSpan(9, 29, 59);

                        today = start.SetTime(start.TimeOfDay.Random(end));
                        return new TradingTimeRange(new TimeRange(start, today));
                    }
                case MarketSession.Main:
                    {
                        if (today.TimeOfDay < new TimeSpan(9, 30, 00))
                            today = today.GetPreviousTradingDay();

                        var start = today.ChangeTime(9, 30, 59, 59);
                        var end = new TimeSpan(15, 59, 59);

                        today = start.SetTime(start.TimeOfDay.Random(end));
                        return new TradingTimeRange(new TimeRange(start, today));
                    }
                case MarketSession.After:
                    {
                        if(today.TimeOfDay.TotalSeconds < 16*60*60)
                            today = today.GetPreviousTradingDay();

                        var start = today;
                        var end = new TimeSpan(8, 00, 59);

                        Random random = new Random();

                        today = today.Date.AddHours(random.Next(17,23));

                        var time = new TradingTimeRange(new TimeRange(start, today));
                        return time;
                    }
            }

            return CalculateTradingTimeRangeForToday();
        }
    }
}