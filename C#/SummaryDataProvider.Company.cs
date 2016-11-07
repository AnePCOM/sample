using LAHolidays;
using NewsQuantified.Core;
using NewsQuantified.Infrastructure.Common;

namespace NewsQuantified.Infrastructure.Data.Services.Summary.DataProvider
{
    using System;
    using System.Data;
    using System.Linq;
    using System.Threading.Tasks;
    using Dapper;

    using Common.Calendar;

    public partial class SummaryDataProvider
    {

        private static DateTime CalcTonDate(DateTime newsTime)
        {
            var holiday = new Holidays();
            var currentDate = newsTime;
            currentDate = currentDate.AddDays(1);

            while (!holiday.DetTradeDay(currentDate))
            {
                currentDate = currentDate.AddDays(1);
            }

            return currentDate;
        }

        public async Task<SummaryDataSection> BuildCompanySection(
            string symbol,
            DateRange dateRange,
            TradingTimeRange timeRange)
        {
            var timeRangeVolumeRatio = MarketCalendar.CalculateVolumeRatioDateRange(dateRange, timeRange.TimeRange.Start, timeRange.TimeRange.End);
                
                
                
                using (var conn = connectionProvider.GetConnection())
                {
                    var dateFromParam = timeRange.TimeRange.Start;
                    var dateToParam = timeRange.TimeRange.End;

                   var companySummaryDataTask = await conn.QueryAsync<SummaryDataSection>(
                        "dbo.usp_CompanyGeneralData",
                        commandType: CommandType.StoredProcedure,
                        param: new
                        {
                            symbol,
                            dateFrom = dateFromParam,
                            dateTo = dateToParam,
                            datePreviousTradingDay = timeRange.AlignedTimeRange.Start
                        });

                    var companySummaryData = companySummaryDataTask.FirstOrDefault();

                    if (companySummaryData == null)
                        return null;

                    companySummaryData.VolumeRatio = GetVolumeRatioBySymbol(symbol, dateRange, timeRange,
                        timeRangeVolumeRatio);
                    companySummaryData.SectionType = "company";

                    return companySummaryData;
                }
        }

        private double? GetVolumeRatioBySymbol(
            string symbol,
            DateRange dateRange,
            TradingTimeRange timeRange,
            ITimeRange timeRangeVolumeRatio)
        {
            using (var conn = connectionProvider.GetConnection())
            {
                if (dateRange == DateRange.All)
                {
                    return null;
                }
                else if (dateRange == DateRange.Today
                         || dateRange == DateRange.Range && timeRange.TimeRange.Start.Date == DateTime.UtcNow.Date)
                {
                    var volumeRatio = conn.Query<double?>(@"
SELECT vr.VolumeRatio FROM VolumeRatio vr WITH(NOLOCK) WHERE vr.Symbol = @symbol
", new {symbol}).FirstOrDefault();
                    return volumeRatio;
                }
                else
                {
                    var mainPeriodVolumeRatio = conn.Query<double?>(@"
SELECT AVG(p.AllVolume) FROM Price p WITH(NOLOCK)
WHERE
    CAST(p.[Date] AS DATE) >= @dateFrom
    AND CAST(p.[Date] AS DATE) <= @dateTo
    AND p.Symbol = @symbol
", new
                    {
                        symbol,
                        dateFrom = timeRange.TimeRange.Start,
                        dateTo = timeRange.TimeRange.End
                    }).FirstOrDefault();

                    if (mainPeriodVolumeRatio == null)
                        return null;

                    var periodsToCompare = conn.Query<double>(@"
SELECT AVG(p.AllVolume) FROM Price p WITH(NOLOCK)
WHERE
    CAST(p.[Date] AS DATE) >= @dateFrom
    AND CAST(p.[Date] AS DATE) <= @dateTo
    AND p.Symbol = @symbol
", new
                    {
                        symbol,
                        dateFrom = timeRangeVolumeRatio.Start,
                        dateTo = timeRangeVolumeRatio.End,
                    }).FirstOrDefault();

                    return mainPeriodVolumeRatio/periodsToCompare;
                }
            }
        }
    }
}