using System;
using NewsQuantified.Infrastructure.Common.Calendar;
using NewsQuantified.Infrastructure.Common.Extensions;
using Xunit;
using Xunit.Should;

namespace NewsQuantified.Tests.Trading
{
    public partial class TradingCalendarFixture
    {
        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_yesterday()
        {
            // Given
            var yesterday = DateTime.UtcNow.ToEstTime().Date.GetPreviousTradingDay();
            var start = yesterday.GetTradingDayBeforeDaysCount(5);
            var expectedTimeRange = new TimeRange(start, yesterday);

            // When
            var timeRange = MarketCalendar.CalculateDateRangeForVolumeRatio(DateRange.Yesterday);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }

        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_week()
        {
            // Given
            var yesterday = DateTime.UtcNow.ToEstTime().Date.GetTradingDayBeforeDaysCount(5);

            if (!yesterday.IsTradingDay())
                yesterday = yesterday.GetPreviousTradingDay();

            var start = yesterday.GetTradingDayBeforeDaysCount(5*5); // 5 weeks

            if (!start.IsTradingDay())
                start = start.GetPreviousTradingDay();

            var expectedTimeRange = new TimeRange(start, yesterday);

            // When
            var timeRange = MarketCalendar.CalculateDateRangeForVolumeRatio(DateRange.Week);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }

        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_one_month()
        {
            // Given
            var start = DateTime.UtcNow.ToEstTime().Date.AddMonths(-6);
            var yesterday = DateTime.UtcNow.ToEstTime().Date.AddMonths(-1);

            if (!start.IsTradingDay())
                start = start.GetPreviousTradingDay();

            if (!yesterday.IsTradingDay())
                yesterday = yesterday.GetPreviousTradingDay();

            var expectedTimeRange = new TimeRange(start, yesterday);

            // When
            var timeRange = MarketCalendar.CalculateDateRangeForVolumeRatio(DateRange.OneMonth);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }

        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_three_months()
        {
            // Given
            var start = DateTime.UtcNow.ToEstTime().Date.AddMonths(-3*6);
            if (!start.IsTradingDay())
                start = start.GetPreviousTradingDay();

            var yesterday = DateTime.UtcNow.ToEstTime().Date.AddMonths(-3);
            if (!yesterday.IsTradingDay())
                yesterday = yesterday.GetPreviousTradingDay();

            var expectedTimeRange = new TimeRange(start, yesterday);

            // When
            var timeRange = MarketCalendar.CalculateDateRangeForVolumeRatio(DateRange.ThreeMonths);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }

        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_one_year()
        {
            // Given
            var start = DateTime.UtcNow.ToEstTime().Date.AddYears(-1 * 6);
            var yesterday = DateTime.UtcNow.ToEstTime().Date.AddYears(-1);
            var expectedTimeRange = new TimeRange(start, yesterday);

            // When
            var timeRange = MarketCalendar.CalculateDateRangeForVolumeRatio(DateRange.Year);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }

        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_custom_range()
        {
            // Given
            var start = DateTime.Parse("1/9/2015");
            var end = DateTime.Parse("1/13/2015");
            var expectedTimeRange = new TimeRange(DateTime.Parse("12/17/2014"), DateTime.Parse("1/8/2015"));

            // When
            var timeRange = MarketCalendar.CalculateVolumeRatioDateRange(DateRange.Range, start, end);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }

        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_custom_range_one_day()
        {
            // Given
            var start = DateTime.Parse("1/23/2015");
            var end = DateTime.Parse("1/23/2015");
            var expectedTimeRange = new TimeRange(DateTime.Parse("1/15/2015"), DateTime.Parse("1/22/2015"));

            // When
            var timeRange = MarketCalendar.CalculateVolumeRatioDateRange(DateRange.Range, start, end);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }

        [Fact]
        public void Should_return_valid_volume_ratio_time_range_for_custom_range_one_day_on_holiday()
        {
            // Given
            var start = DateTime.Parse("1/19/2015");
            var end = DateTime.Parse("1/19/2015");
            var expectedTimeRange = new TimeRange(DateTime.Parse("1/9/2015"), DateTime.Parse("1/15/2015"));

            // When
            var timeRange = MarketCalendar.CalculateVolumeRatioDateRange(DateRange.Range, start, end);

            // Then
            timeRange.ShouldBe(expectedTimeRange);
        }
    }
}