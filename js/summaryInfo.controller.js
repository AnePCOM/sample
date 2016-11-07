(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('StockSummaryInfoController', StockSummaryInfoController);
    StockSummaryInfoController.$inject = ["$rootScope", "$scope"];

    function StockSummaryInfoController($rootScope, $scope) {
        $scope.mainSymbolSummary = undefined;
        activate();

        function activate() {
            $scope.$on('stock.SummaryInfoFillData', fillData);
            //load the data only once
            if (!$scope.mainSymbolSummary) {
                $scope.$emit('stock.getStockSummary');
            }
        }

        function fillData(event, data) {
            if (data) {
                $scope.mainSymbolSummary = data;
                $scope.$apply();
            }
        }
    }
})();