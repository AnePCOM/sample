namespace NewsQuantified.Web.Tests.Controllers
{
    using System;
    using FakeItEasy;
    using Infrastructure.Common.Calendar;
    using Infrastructure.Data.Services.Graph.DataProvider;
    using MvcContrib.TestHelper;
    using TestStack.FluentMVCTesting;
    using Web.Controllers;
    using Xunit;

    public class GraphControllerTests
    {
        private GraphController _controller;
        public GraphControllerTests()
        {
            var mockGraphDataProvider = A.Fake<IGraphDataProvider>();

            _controller = new GraphController(mockGraphDataProvider);
        }

        [Fact]
        public void Should_return_company_graph_data()
        {
            // When
            var symbol = "AAPL";
            var dateRange = DateRange.OneMonth;
            var from = DateTime.Now;
            var to = DateTime.Now;

            // Given
            _controller.WithCallTo(c => c.Company(symbol, dateRange, from, to, to)).ShouldReturnJson(data =>
            {
                // Then
                int seriesCount = data.series.Length;
                seriesCount.ShouldNotBeNull("NULL");
            });
        }
    }
}