namespace NQPro.Tests.BusinessLogic
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Collections;
    using System.Threading;
    using NqPro.Core.StockPage;
    using Domain.DataTable;
    using Domain.Enums;
    using Infrastructure.Common;
    using Infrastructure.Core;
    using Infrastructure.Data.Services.Summary.DataProvider;
    using NUnit.Framework;

    [TestFixture]
    public class SingleStockTests
    {
        /// <summary>
        /// Single Stock: Should return the same number of news in the table and summary information
        /// </summary>
        [Test]
        [TestCaseSource(typeof(ExampleStockInfoTestCaseSourrces))]
        public void SingleStock_should_return_same_number_news_table_and_summary_info(DataTableDateRangeOptions dataTableDateRangeOptions)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("en-US");
            var repository = new Repository();
            var summaryDataProvider = new SummaryDataProvider(repository);

            DataTableOptions stockTableOptions = new DataTableOptions
            {
                Filter = dataTableDateRangeOptions.Filter,
                Symbol = dataTableDateRangeOptions.Symbol,
                Take = dataTableDateRangeOptions.Take,
                Skip = dataTableDateRangeOptions.Skip,
                SortDescription = dataTableDateRangeOptions.SortDescription,
                StartTonDate = dataTableDateRangeOptions.StartTonDate,
                Providers = dataTableDateRangeOptions.Providers
            };

            var range = DateRange.Today;
            var trr = MarketCalendar.CalculateTradingTimeRange(range, DateTime.Now, DateTime.Now);
            if (dataTableDateRangeOptions.StartDate != null && dataTableDateRangeOptions.EndDate != null)
            {
                trr = MarketCalendar.CalculateTradingTimeRange(range, dataTableDateRangeOptions.StartDate.Value, dataTableDateRangeOptions.EndDate.Value);
            }
            var stockPageSymbolFunc = new StockPageSymbolFunc(repository);
            var tableResult = stockPageSymbolFunc.GetNewsStreamingDataSource(stockTableOptions);
            var symbolSummaryData = summaryDataProvider.BuildCompanySection(stockTableOptions.Symbol, range, trr, dataTableDateRangeOptions.StartTonDate, dataTableDateRangeOptions.Providers);
            Assert.AreEqual(tableResult.Total, 10003);
        }


        /// <summary>
        /// Single Stock: data validation in summary info block
        /// </summary>
        [Test]
        [TestCaseSource(typeof(ExampleStockInfoTestCaseSourrces))]
        public void SingleStock_should_not_epty_data_in_summary_info(DataTableDateRangeOptions dataTableDateRangeOptions)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("en-US");
            var repository = new Repository();
            var summaryDataProvider = new SummaryDataProvider(repository);
            const DateRange range = DateRange.Today;
            var trr = MarketCalendar.CalculateTradingTimeRange(range, DateTime.Now, DateTime.Now);
            if (dataTableDateRangeOptions.StartDate != null && dataTableDateRangeOptions.EndDate != null)
            {
                trr = MarketCalendar.CalculateTradingTimeRange(range, dataTableDateRangeOptions.StartDate.Value, dataTableDateRangeOptions.EndDate.Value);
            }
            var symbolSummaryData = summaryDataProvider.BuildCompanySection(dataTableDateRangeOptions.Symbol, range, trr, dataTableDateRangeOptions.StartTonDate, dataTableDateRangeOptions.Providers);

            Assert.That(symbolSummaryData.AllNewsCount, Is.Not.Null);
            Assert.That(symbolSummaryData.AskShares, Is.Not.Null);
            Assert.That(symbolSummaryData.AskSharesStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.AskSize, Is.Not.Null);
            Assert.That(symbolSummaryData.AvgBidAskSize, Is.Not.Empty);
            Assert.That(symbolSummaryData.BidAskSpread, Is.Not.Null);
            Assert.That(symbolSummaryData.BidShares, Is.Not.Null);
            Assert.That(symbolSummaryData.BidSharesStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.BidSize, Is.Not.Null);
            Assert.That(symbolSummaryData.BlockShares, Is.Not.Null);
            Assert.That(symbolSummaryData.BlockSharesStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.Change, Is.Not.Null);
            Assert.That(symbolSummaryData.ChangeStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.DowngradesCount, Is.Not.Null);
            Assert.That(symbolSummaryData.InitiatesCount, Is.Not.Null);
            Assert.That(symbolSummaryData.LastEarnings, Is.Not.Empty);
            Assert.That(symbolSummaryData.LastEarningsDate, Is.Not.Null);
            Assert.That(symbolSummaryData.LastEps, Is.Not.Null);
            Assert.That(symbolSummaryData.LastTod, Is.Not.Empty);
            Assert.That(symbolSummaryData.MoreOverCount, Is.Not.Null);
            Assert.That(symbolSummaryData.NewsWiresCount, Is.Not.Null);
            Assert.That(symbolSummaryData.NextEarnings, Is.Not.Empty);
            Assert.That(symbolSummaryData.NextEarningsDate, Is.Not.Null);
            Assert.That(symbolSummaryData.NextTod, Is.Not.Empty);
            Assert.That(symbolSummaryData.OddLot, Is.Not.Null);
            Assert.That(symbolSummaryData.OddLotStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.OffExchange, Is.Not.Empty);
            Assert.That(symbolSummaryData.ReiteratesCount, Is.Not.Null);
            Assert.That(symbolSummaryData.SecEdgarFilingsCount, Is.Not.Null);
            Assert.That(symbolSummaryData.SectionType, Is.Not.Empty);
            Assert.That(symbolSummaryData.SharesAtAskBid, Is.Not.Empty);
            Assert.That(symbolSummaryData.SubPenny, Is.Not.Null);
            Assert.That(symbolSummaryData.SubPennyStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.TotalShares, Is.Not.Null);
            Assert.That(symbolSummaryData.TotalSharesStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.TotalTrades, Is.Not.Null);
            Assert.That(symbolSummaryData.TotalTradesStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.UpgradesCount, Is.Not.Null);
            Assert.That(symbolSummaryData.Volatility, Is.Not.Null);
            Assert.That(symbolSummaryData.Volatility20, Is.Not.Null);
            Assert.That(symbolSummaryData.Volatility20Str, Is.Not.Empty);
            Assert.That(symbolSummaryData.VolatilityStr, Is.Not.Empty);
            Assert.That(symbolSummaryData.VolumeRatio, Is.Not.Null);
            Assert.That(symbolSummaryData.VolumeRatioStr, Is.Not.Empty);
        }

        private class ExampleStockInfoTestCaseSourrces : IEnumerable
        {
            public IEnumerator GetEnumerator()
            {
                yield return new DataTableDateRangeOptions
                {
                    Skip = 0,
                    Take = 50,
                    SortDescription = new List<GridSortDescription>
                    {
                        new GridSortDescription() {dir = "desc", field = "PubTime"},
                        
                    },
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now,
                    HideMediaMonitoring = false,
                    DateRange = DateRange.Today,
                    PageMode = CompanyPageMode.Company,
                    Symbol = "AAPL",
                    StartTonDate = "20060101",
                    Providers = null,
                    Exchange = " and f.[Exchange] in ('AMEX','NYSE','NASDAQ-NMS')"
                };
                yield return new DataTableDateRangeOptions
                {
                    Skip = 50,
                    Take = 100,
                    SortDescription = new List<GridSortDescription>
                    {
                        new GridSortDescription() {dir = "desc", field = "PubTime"},
                        
                    },
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now,
                    HideMediaMonitoring = false,
                    DateRange = DateRange.Today,
                    PageMode = CompanyPageMode.Company,
                    Symbol = "MSFT",
                    StartTonDate = DateTime.Now.AddDays(-365).ToString("yyyyMMdd"),
                    Providers = "BW,PR,GN,MW,AM",

                };
                yield return new DataTableDateRangeOptions
                {
                    Skip = 0,
                    Take = 30,
                    SortDescription = new List<GridSortDescription>
                    {
                        new GridSortDescription() {dir = "desc", field = "PubTime"},
                        
                    },
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now,
                    HideMediaMonitoring = false,
                    DateRange = DateRange.Today,
                    PageMode = CompanyPageMode.Company,
                    Symbol = "MSFT",
                    StartTonDate = DateTime.Now.AddDays(-365).ToString("yyyyMMdd"),
                    Providers = "FW,MB,BW,PR,GN,MW,WH",

                };
                yield return new DataTableDateRangeOptions
                {
                    Skip = 100,
                    Take = 150,
                    SortDescription = new List<GridSortDescription>
                    {
                        new GridSortDescription() {dir = "desc", field = "PubTime"},
                        
                    },
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now,
                    HideMediaMonitoring = false,
                    DateRange = DateRange.Today,
                    PageMode = CompanyPageMode.Company,
                    Symbol = "MS",
                    StartTonDate = DateTime.Now.AddDays(-90).ToString("yyyyMMdd"),
                    Providers = "MB,BW,PR,GN,MW,WH",
                };
                yield return new DataTableDateRangeOptions
                {
                    Skip = 0,
                    Take = 40,
                    SortDescription = new List<GridSortDescription>
                    {
                        new GridSortDescription() {dir = "desc", field = "PubTime"},
                        
                    },
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now,
                    HideMediaMonitoring = false,
                    DateRange = DateRange.Today,
                    PageMode = CompanyPageMode.Company,
                    Symbol = "MS",
                    StartTonDate = DateTime.Now.AddDays(-90).ToString("yyyyMMdd"),
                    Providers = "BW,PR,GN,MW,AM",
                };
            }
        }
        
    }
}
