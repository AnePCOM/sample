
using System;
using NQPro.Domain.Enums;
using NQPro.Infrastructure.Common;
using NQPro.Infrastructure.Extensions;
using NUnit.Framework;

namespace NQPro.Tests.BusinessLogic
{
    [TestFixture]
    public class CalendarTests
    {
        [Test]
        public void Should_return_range_for_today()
        {
            // Given
            var startDate = DateTime.UtcNow.ToEstTime().ChangeTime(16, 0, 0, 0);
            var endDate = startDate.EndOfDay();

            TimeRange mainDateRange = new TimeRange(startDate.StartOfDay(), endDate);
            TimeRange alignedDateRange = new TimeRange(startDate.GetPreviousTradingDay(), endDate.EndOfDay());
            TimeRange extendedDateRnage = new TimeRange(startDate.GetPreviousTradingDay().StartOfDay(), endDate);

            // When
            var dateRange = MarketCalendar.CalculateTradingTimeRange(DateRange.Today);
            TimeRange arketCalendarMainDateRange = dateRange.TimeRange as TimeRange;
            TimeRange arketCalendarAlignedDateRange = dateRange.AlignedTimeRange as TimeRange;
            TimeRange arketCalendarExtendedDateRnage = dateRange.ExtendedTimeRange as TimeRange;

            // Then
            Assert.IsTrue(arketCalendarMainDateRange != null && arketCalendarMainDateRange.CompareTo(mainDateRange) == 0);
            Assert.IsTrue(arketCalendarAlignedDateRange != null && arketCalendarAlignedDateRange.CompareTo(arketCalendarAlignedDateRange) == 0);
            Assert.IsTrue(arketCalendarExtendedDateRnage != null && arketCalendarExtendedDateRnage.CompareTo(arketCalendarExtendedDateRnage) == 0);
        }
    }
}
