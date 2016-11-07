(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('HistoricNewsController', HistoricNewsController);
    HistoricNewsController.$inject = [
        '$scope', 'historicNewsService', '$window', 'utils', 'filterPanelFactory', '$cookies', 'device', 'authService', '$location'
    ];

    function HistoricNewsController($scope, historicNewsService, $window, utils, filterPanelFactory, $cookies, device, authService, $location) {
        $scope.navigatePanelIsShow = true;
        $scope.navigatePanelCanBeShow = true;
        $scope.isMobile = null;
        $scope.windowsIsVisible = false;
        $scope.windowsTitle = "";
        
        $scope.filter = {
            "cap": [],
            "vol": [],
            "perfor": [],
            "volrat": [],
            "id": [],
            "piceMin": [],
            "piceMax": []
        };
        $scope.dateFilter = {
            startDate: {
                dateString: null,
                dateObject: null,
                minDate: new Date(1990, 0, 1, 0, 0, 0)
            },
            endDate: {
                dateString: null,
                dateObject: null,
                minDate: new Date(1990, 0, 1, 0, 0, 0)
            }
        };
        $scope.options = undefined;
        $scope.changeFilter = changeFilter;
        $scope.changeHandler = changeHandler;
        $scope.fromDateChanged = fromDateChanged;
        $scope.toDateChanged = toDateChanged;
          

        var defaultField = undefined,
            defaultDir = undefined,
            isActive = false,
            subscriptionLevel = null,
            subscriptionHistoryDays = null;
        activate();

        function activate() {
            
            if (!authService || !authService.authentication || !authService.authentication.isAuth) {
                $location.path('/portal/login');
            }
            
            var authData = authService.authentication;
            if (authData) {
                subscriptionLevel = authData.subscriptionLevel;
                subscriptionHistoryDays = authData.subscriptionHistoryDays;
            }

            var d = new Date();
            d.setDate(d.getDate() - subscriptionHistoryDays);
            $scope.dateFilter.startDate.minDate = d;
            $scope.dateFilter.endDate.minDate = d;
            var cFilter = $cookies.getObject("dbhn_filter");
            if (cFilter) $scope.filter = cFilter;
            if (device.getDeviceType().any() === null) {
                $scope.isMobile = false;
            } else {
                $scope.isMobile = true;
            }
           var sortField = $cookies.getObject("dbhn_sorting");
            if (sortField && sortField.length > 0) {
                defaultField = sortField[0].field;
                defaultDir = sortField[0].dir;
            }
            $scope.gridDataSource = {
                transport: {
                    read: function (options) {
                        if (!isActive) {
                            var cSort = $cookies.getObject("dbhn_sorting");
                            if (cSort) options.data.sort = cSort;
                        }
                        $scope.options = options;
                        historicNewsService.geTableData(options.data.take, options.data.skip, "", $scope.filter, options.data.sort, $scope.dateFilter.startDate.dateObject, $scope.dateFilter.endDate.dateObject)
                            .then(function (data) {
                                if (data) {
                                    if (data.total > 0) $scope.gridIsVisible = true;
                                    angular.forEach(data.data, function (value) {
                                        value.volume = utils.kendoFormatValue(value.volume);
                                    });
                                    options.success(data);
                                } else {
                                    $scope.gridIsVisible = false;
                                }
                                $cookies.putObject("dbhn_sorting", options.data.sort);
                                isActive = true;
                            });
                    }
                },
                pageSize: 50,
                serverPaging: true,
                serverSorting: true,
                schema: {
                    total: function (data) {
                        return data.total;
                    },
                    data: function (data) {
                        return data.data;
                    },
                    model: {
                        fields: {
                            change: {
                                type: "string"
                            },
                            changePerc: {
                                type: "number"
                            },
                            colorChange: {
                                type: "string"
                            },
                            colorChangePrice: {
                                type: "string"
                            },
                            colorPrice: {
                                type: "string"
                            },
                            columnOrder: {
                                type: "string"
                            },
                            date: {
                                type: "string"
                            },
                            filterPrice: {
                                type: "number"
                            },
                            filterVolume: {
                                type: "number"
                            },
                            headLine: {
                                type: "string"
                            },
                            id: {
                                type: "string"
                            },
                            name: {
                                type: "string"
                            },
                            newsKey: {
                                type: "string"
                            },
                            price: {
                                type: "number"
                            },
                            priceNews: {
                                type: "string"
                            },
                            provider: {
                                type: "string"
                            },
                            pubTime: {
                                type: "string"
                            },
                            scale: {
                                type: "string"
                            },
                            session: {
                                type: "string"
                            },
                            shortNewsKey: {
                                type: "string"
                            },
                            stock: {
                                type: "string"
                            },
                            tag: {
                                type: "string"
                            },
                            time: {
                                type: "string"
                            },
                            tonLast: {
                                type: "number"
                            },
                            volume: {
                                type: "string"
                            },
                            volumeRatio: {
                                type: "number"
                            }
                        }
                    }
                }
            };
        }

        function reloadPaging() {
            var grid = $("#gridTopNews").data("kendoGrid");
            grid.dataSource.page(1);
        }

        function fromDateChanged() {
            var newDate = new Date($scope.dateFilter.startDate.dateObject);
            newDate.setHours(0, 0, 0, 0);
            var subscriberDate = new Date();
            subscriberDate.setDate(subscriberDate.getDate() - subscriptionHistoryDays);
            subscriberDate.setHours(0, 0, 0, 0);
            if (newDate < subscriberDate) {
                alert("The specified date range is not available for your active subscription plan");
                $scope.dateFilter.startDate.dateObject = null;
                $scope.dateFilter.endDate.minDate = new Date(1990, 0, 1, 0, 0, 0);
                return;
            }
            $scope.dateFilter.endDate.minDate = newDate;
            reloadPaging();
        }

        function toDateChanged() {
            var newDate = new Date($scope.dateFilter.endDate.dateObject);
            newDate.setHours(0, 0, 0, 0);
            var subscriberDate = new Date();
            subscriberDate.setDate(subscriberDate.getDate() - subscriptionHistoryDays);
            subscriberDate.setHours(0, 0, 0, 0);
            if (newDate < subscriberDate) {
                alert("The specified date range is not available for your active subscription plan");
                $scope.dateFilter.endDate.dateObject = null;
                return;
            }
            reloadPaging();
        }

        function changeHandler(self, grid) {
            var row = $(self).closest("tr"),
                data = grid.dataItem($(self).closest("tr")),
                colIdx = $("td", row).index(self);
            var contentUrl = "";
            if ($scope.isMobile) colIdx = colIdx - 1;
            if (colIdx === 0) {
                contentUrl = '#/portal/stock?symbol=' + data.stock;
            } else if (colIdx > 0) {
                contentUrl = '#/reports/mainreport?news=' + data.newsKey;
            }
            $window.open(contentUrl);
        }

        function changeFilter(filter, value) {
            $scope.filter = filterPanelFactory.readFilters($scope.filter, filter, value);
            $cookies.putObject("dbhn_filter", $scope.filter);
            reloadPaging();
        }
    }
})();