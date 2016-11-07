namespace NewsQuantified.Tests.Trading
{
    using System;

    using Infrastructure.Common.Calendar;
    using Infrastructure.Common.Extensions;
    using Xunit;
    using Xunit.Should;
    public partial class TradingCalendarFixture
    {
        [Fact]
        public void Should_return_range_for_today()
        {
            // Given
            var startDate = DateTime.UtcNow.ToEstTime().ChangeTime(16, 0, 0, 0);
            var endDate = startDate.EndOfDay();

            var mainDateRange = new TimeRange(startDate.StartOfDay(), endDate);
            var alignedDateRange = new TimeRange(startDate.GetPreviousTradingDay(), endDate.EndOfDay());
            var extendedDateRnage = new TimeRange(startDate.GetPreviousTradingDay().StartOfDay(), endDate);

            // When
            var dateRange = MarketCalendar.CalculateTradingTimeRange(DateRange.Today);

            // Then
            dateRange.TimeRange.ShouldBe(mainDateRange);
            dateRange.AlignedTimeRange.ShouldBe(alignedDateRange);
            dateRange.ExtendedTimeRange.ShouldBe(extendedDateRnage);
        }

        [Fact]
        public void Should_return_range_for_yesterday()
        {
            // Given
            var startDate = DateTime.UtcNow.ToEstTime().GetPreviousTradingDay().ChangeTime(16, 0, 0, 0);
            var endDate = DateTime.UtcNow.ToEstTime().GetPreviousTradingDay().EndOfDay();

            var mainDateRange = new TimeRange(startDate.StartOfDay(), endDate);
            var alignedDateRange = new TimeRange(startDate.GetPreviousTradingDay(), endDate.EndOfDay());
            var extendedDateRnage = new TimeRange(startDate.GetPreviousTradingDay().StartOfDay(), endDate);

            // When
            var dateRange = MarketCalendar.CalculateTradingTimeRange(DateRange.Yesterday);

            // Then
            dateRange.TimeRange.ShouldBe(mainDateRange);
            dateRange.AlignedTimeRange.ShouldBe(alignedDateRange);
            dateRange.ExtendedTimeRange.ShouldBe(extendedDateRnage);
        }

        //[Fact]
        //public void Should_return_range_for_yesterday_on_weekend()
        //{
        //    // Given
        //    var today = DateTime.ParseExact("11/23/2014", "MM/dd/yyyy", CultureInfo.InvariantCulture.DateTimeFormat);
        //    var startDate = today.GetPreviousTradingDay().ChangeTime(16, 0, 0, 0);
        //    var endDate = today.GetPreviousTradingDay().EndOfDay();

        //    var mainDateRange = new TimeRange(startDate.StartOfDay(), endDate);
        //    var alignedDateRange = new TimeRange(startDate.GetPreviousTradingDay(), endDate.ChangeTime(16, 0, 0, 0));
        //    var extendedDateRnage = new TimeRange(startDate.GetPreviousTradingDay().StartOfDay(), endDate);

        //    // When
        //    var dateRange = MarketCalendar.CalculateTradingTimeRange(today, today);

        //    // Then
        //    dateRange.TimeRange.ShouldBe(mainDateRange);
        //    dateRange.AlignedTimeRange.ShouldBe(alignedDateRange);
        //    dateRange.ExtendedTimeRange.ShouldBe(extendedDateRnage);
        //}

        [Fact]
        public void Should_return_range_for_week()
        {
            // Given
            var startDate = DateTime.UtcNow.ToEstTime().AddWeekDays(4).ChangeTime(16, 0, 0, 0);

            if (!startDate.IsTradingDay())
                startDate = startDate.GetPreviousTradingDay();

            var endDate = DateTime.UtcNow.ToEstTime().EndOfDay();

            var mainDateRange = new TimeRange(startDate.StartOfDay(), endDate);
            var alignedDateRange = new TimeRange(startDate.GetPreviousTradingDay(), endDate.EndOfDay());
            var extendedDateRnage = new TimeRange(startDate.GetPreviousTradingDay().StartOfDay(), endDate);

            // When
            var dateRange = MarketCalendar.CalculateTradingTimeRange(DateRange.Week);

            // Then
            dateRange.TimeRange.ShouldBe(mainDateRange);
            dateRange.AlignedTimeRange.ShouldBe(alignedDateRange);
            dateRange.ExtendedTimeRange.ShouldBe(extendedDateRnage);
        }
    }
}