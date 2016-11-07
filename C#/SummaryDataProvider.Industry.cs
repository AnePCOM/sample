using NewsQuantified.Infrastructure.Common;

namespace NewsQuantified.Infrastructure.Data.Services.Summary.DataProvider
{
    using System;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Dapper;

    using Common.Calendar;
    using Common.Extensions;

    public partial class SummaryDataProvider
    {
        public async Task<SummaryDataSection> BuildIndustrySection(
            int sicCode,
            DateRange dateRange,
            TradingTimeRange timeRange)
        {
            var timeRangeVolumeRatio = MarketCalendar.CalculateVolumeRatioDateRange(dateRange, timeRange.TimeRange.Start, timeRange.TimeRange.End);

            using (var conn = connectionProvider.GetConnection())
            {
                var dateFromParam = timeRange.TimeRange.Start;
                var dateToParam = timeRange.AlignedTimeRange.End;

               var industrySummaryDataTask = await conn.QueryAsync<SummaryDataSection>(
                    "dbo.usp_IndustryGeneralData",
                    commandType: CommandType.StoredProcedure,
                    param: new
                    {
                        sicCode,
                        dateFrom = dateFromParam,
                        dateTo = dateToParam,
                        datePreviousTradingDay = timeRange.AlignedTimeRange.Start
                    });

                var industrySummaryData = industrySummaryDataTask.FirstOrDefault();

                if (industrySummaryData == null)
                    return null;

                if (dateRange == DateRange.All)
                {
                    industrySummaryData.VolumeRatio = null;
                }
                else if (dateRange == DateRange.Today
                         || dateRange == DateRange.Range && timeRange.TimeRange.Start.Date == DateTime.UtcNow.Date)
                {
                    var volumeRatio = conn.Query<double?>(@"
SELECT AVG(vr.VolumeRatio) FROM VolumeRatio vr WITH(NOLOCK)
INNER JOIN Fundamental4 f WITH(NOLOCK) ON vr.Symbol = f.Symbol
WHERE f.SICCode = @sicCode
", new { sicCode }).FirstOrDefault();
                    industrySummaryData.VolumeRatio = volumeRatio;
                }
                else
                {
                    var mainPeriodVolumeRatio = conn.Query<double>(@"
SELECT AVG(CAST(ip.Volume AS FLOAT)) FROM IndustryPrice ip WITH(NOLOCK)
WHERE
    ip.SICCode = @sicCode
    AND ip.JDate >= CONVERT(CHAR(8), @dateFrom, 112)
    AND ip.JDate <= CONVERT(CHAR(8), @dateTo, 112)
", new
{
    sicCode,
    dateFrom = timeRange.TimeRange.Start,
    dateTo = timeRange.TimeRange.End
}).FirstOrDefault();

                    var periodsToCompare = conn.Query<double>(@"
SELECT AVG(CAST(ip.Volume AS FLOAT)) FROM IndustryPrice ip WITH(NOLOCK)
WHERE
    ip.SICCode = @sicCode
    AND ip.JDate >= CONVERT(CHAR(8), @dateFrom, 112)
    AND ip.JDate <= CONVERT(CHAR(8), @dateTo, 112)
", new
{
    sicCode,
    dateFrom = timeRangeVolumeRatio.Start,
    dateTo = timeRangeVolumeRatio.End,
}).FirstOrDefault();

                    industrySummaryData.VolumeRatio = mainPeriodVolumeRatio / periodsToCompare;
                }

                industrySummaryData.SectionType = "industry";
                return industrySummaryData;
            }
        }
    }
}