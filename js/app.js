///#source 1 1 /Scripts/app/nqpro.module.js
(function () {
    'use strict';
    angular.module('nqpro', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'kendo.directives', 'ngSanitize', 'ngCookies', 'angular-carousel']);
})();
///#source 1 1 /Scripts/app/nqpro.routes.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .config(routesConfig);
    routesConfig.$inject = ['$routeProvider'];

    function routesConfig($routeProvider) {
        $routeProvider
            .when("/admin", {
                templateUrl: "Scripts/app/admin/admin.html",
                controller: "AdminController"
            })
            .when("/portal/settings", {
                templateUrl: "Scripts/app/settings/settings.html",
                controller: "SettingsController"
            })
            .when("/reports/mainreport", {
                templateUrl: "Scripts/app/reports/mainreport/mainreport.html",
                controller: "MainReportController"
            })
            .when("/portal/about", {
                templateUrl: "Scripts/app/about/about.html",
                controller: "AboutController"
            })
            .when("/portal/analystActions", {
                templateUrl: "Scripts/app/analystActions/analystActions.html",
                controller: "AnalystActionsController"
            })
            .when("/portal/performanceAnalystActions", {
                templateUrl: "Scripts/app/performanceAnalystActions/performanceAnalystActions.html",
                controller: "PerformanceAnalystActionsController"
            })
            .when("/portal/database/historicnews", {
                templateUrl: "Scripts/app/database/historicnews/historicnews.html",
                controller: "HistoricNewsController"
            })
            .when("/portal/analystActionsReturn", {
                templateUrl: "Scripts/app/analystActionsReturn/analystActionsReturn.html",
                controller: "AnalystActionsReturnController"
            })
            .when("/portal/database", {
                templateUrl: "Scripts/app/database/database.html",
                controller: "DataBaseController"
            })
            .when("/portal/earnings", {
                templateUrl: "Scripts/app/earnings/earnings.html",
                controller: "EarningsController"
            })
            .when("/portal/login", {
                templateUrl: "Scripts/app/login/login.html",
                controller: "LoginController"
            })
            .when("/portal/forgot", {
                templateUrl: "Scripts/app/login/forgot/forgot.html",
                controller: "ForgotController"
            })
            .when("/resetPassword", {
                 templateUrl: "Scripts/app/login/resetPassword/reset.password.html",
                 controller: "ResetPasswordController"
            })
            .when("/registerSuccessfully", {
                templateUrl: "Scripts/app/login/loginAutocompleate/loginAutocompleate.html",
                controller: "LoginAutoCompleateController"
            })
            .when("/portal/services", {
                templateUrl: "Scripts/app/services/services.html",
                controller: "ServicesController"
            })
            .when("/portal/topnews", {
                templateUrl: "Scripts/app/topnews/topnews.html",
                controller: "TopNewsController"
            })
            .when("/portal/stock", {
                templateUrl: "Scripts/app/stock/stock.html",
                controller: "StockController"
            })
            .when("/alerts", {
                templateUrl: "Scripts/app/alerts/alerts.html",
                controller: "AlertsController"
            })
            .when("/:guid", {
                templateUrl: "Scripts/app/login/emailConfermByGuid/emailConfermByGuid.html",
                controller: "EmailConfermByGuidController"
            })
        .otherwise({
            redirectTo: "/portal/topnews"
        });
    }


    var serviceBase = 'http://localhost:50671/';
    //var serviceBase = 'http://104.156.54.174:8083/';
    //var serviceBase = 'http://analytics.newsquantified.com/';
    angular
    .module('nqpro').constant('ngProSettings', {
        apiServiceBaseUri: serviceBase,
        clientId: 'self'
    });

    angular
    .module('nqpro').config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    angular
        .module('nqpro').run(['authService', function (authService) {
            authService.fillAuthData();
        }]);
})();
///#source 1 1 /Scripts/app/common/directives/include.replace.directive.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .directive('includeReplace', function () {
            return {
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.includeReplace;
                },
                replace: true,
                controller: includeReplaceController
            }
        });
    includeReplaceController.$inject = ['$parse', '$scope', '$attrs'];

    function includeReplaceController($parse, $scope, $attrs) {
        if ($attrs.includeReplaceArgs)
            $scope.includeReplaceArgs = $parse($attrs.includeReplaceArgs)($scope);
    }
})();
///#source 1 1 /Scripts/app/common/directives/header.directive.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .directive('header', function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: "Scripts/app/common/directives/header.html",
                controller: headerController
            }
        });
    headerController.$inject = ['$parse', '$scope', '$q', 'httpService', 'authService', '$window', 'ngProSettings', 'device'];

    function headerController($parse, $scope, $q, httpService, authService, $window, ngProSettings, device) {
        $scope.onSelect = onSelect;
        $scope.toggleLogin = toggleLogin;
        $scope.headerActivate = headerActivate;


        $scope.loginOptions = {
            loginText: "Login",
            loginUrl: '#/portal/login'
        };

        $scope.searchOptions = {
            placeholder: "Search for company or Symbol"
        };
        $scope.searchSource = {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    getSymbolSearch(options.data.filter.filters[0].value)
                        .then(function (data) {
                            options.success(data);
                        });
                }
            }
        };

        function headerActivate() {

            if (authService.authentication.isAuth) {
                $scope.loginOptions.loginText = "Sign Out";
            } else {
                $scope.loginOptions.loginText = "Login";
            }

            if (device.getDeviceType().any() === null) {
                $scope.isMobile = false;
            } else {
                $scope.isMobile = true;
            }
        }

        function toggleLogin() {
            if (authService.authentication.isAuth) {
                authService.logOut();
                $scope.loginOptions.loginText = "Login";
            } 
            $window.location.href = $scope.loginOptions.loginUrl;
        }

        function onSelect(ev) {
            var model = ev.sender.dataItem(ev.item);
            $window.location.href = '#/portal/stock?symbol=' + model.searchValueField;

        };

        function getSymbolSearch(options) {
            return httpService.get('api/reportApi/getsymbol', {
                options: options
            });
        }

        

        headerActivate();
    }
})();
///#source 1 1 /Scripts/app/common/directives/footer.directive.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .directive('footer', function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: "Scripts/app/common/directives/footer.html",
                controller: footerController
            }
        });
    footerController.$inject = ['$scope'];

    function footerController($scope) {
    }
})();
///#source 1 1 /Scripts/app/common/directives/navigate.panel.directive.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .directive('navigatePanel', function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: "Scripts/app/common/directives/navigate.panel.html",
                scope: {
                    isShowPanel: '=isShowPanel',
                    isShowFilter: '=isShowFilter',
                    filterValue: '=filterValue',
                    showAllProviders: '=showAllProviders',
                    filterCallback: '=',
                    pageType: '='
                },
                controller: navigatePanelController
            }
        });
    navigatePanelController.$inject = ['$scope', 'filterModelFactory', 'authService'];

    function navigatePanelController($scope, filterModelFactory, authService) {
        $scope.filterModel = null;
        $scope.setFilterValue = setFilterValue;
        $scope.isNewsFilterPanel = isNewsFilterPanel;
        $scope.isEarningsFilterPanel = isEarningsFilterPanel;
        $scope.userName = null;
        $scope.userEmail = null;
        $scope.subscriptionLevel = null;
        $scope.role = null;
        $scope.subscriptionHistoryDays = null;
        setFilter();

        function setFilter() {
            var authData = authService.authentication;
            if (authData) {
                $scope.userName = authData.userName;
                $scope.userEmail = authData.userEmail;
                $scope.role = authData.role;
                $scope.subscriptionLevel = authData.subscriptionLevel;
                $scope.subscriptionHistoryDays = authData.subscriptionHistoryDays;
            }

            switch ($scope.pageType) {
            case 'newsFilterPanel':
                $scope.allProviders = true;
                if ($scope.showAllProviders !== undefined) {
                    $scope.allProviders = $scope.showAllProviders;
                }
                $scope.filterModel = filterModelFactory.getNewsPanelObject();
                var visibleObject = $scope.subscriptionLevel.split(",");
                angular.forEach(visibleObject, function (value) {
                    $scope.filterModel.id.visibleElement[value] = true;
                });

                if ($scope.isShowFilter) {
                    $scope.filterModel = filterModelFactory.setNewsPanelObjectValue($scope.filterValue, $scope.filterModel);
                }
                break;
            case 'earningsFilterPanel':
                $scope.filterModel = filterModelFactory.getEarningsPanelObject();
                if ($scope.isShowFilter) {
                    $scope.filterModel = filterModelFactory.setEarningsPanelObjectValue($scope.filterValue, $scope.filterModel);
                }
                break;
            }
        }

        function setFilterValue(el, filter, value) {
            $scope.filterCallback(filter, value);
        }

        function isNewsFilterPanel() {
            return $scope.pageType === 'newsFilterPanel';
        }

        function isEarningsFilterPanel() {
            $scope.startDate = new Date();
            return $scope.pageType === 'earningsFilterPanel';
        }
    }
})();
///#source 1 1 /Scripts/app/common/directives/toggle.arrow.directive.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .directive('toggleArrow', function () {
            return {
                restrict: 'A',
                replace: true,

                transclude: true,
                templateUrl: "Scripts/app/common/directives/toggle.arrow.directive.html",
                link: function ($scope, element, attrs) {
                    $scope.navigatePanelIsShow = false;
                    $scope.$parent.navigatePanelIsShow = false;
                },
                controller: toogleArrowController
            }
        });

    toogleArrowController.$inject = ['$scope'];
    function toogleArrowController($scope) {
        $scope.togglePanel = togglePanel;
        $scope.navigatePanelIsShow = true;

        function togglePanel() {
           // $scope.navigatePanelCtrl.togglePanel();
            $scope.navigatePanelIsShow = !$scope.navigatePanelIsShow;
            $scope.$parent.navigatePanelIsShow = $scope.navigatePanelIsShow;
        }
    }
})();


///#source 1 1 /Scripts/app/common/service/http.service.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .service('httpService', httpService);
    httpService.$inject = ['$http'];

    function httpService($http) {
        var self = this;
        self.get = get;
        self.post = post;

        function get(url, params) {
            return $http
                .get(url, {
                    params: params
                })
                .then(function (response) {
                    return response.data;
                });
        }

        function post(url, params) {
            return $http
                .post(url, params)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();
///#source 1 1 /Scripts/app/common/service/utils.service.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .service('utils', utils);
    utils.$inject = ['$sce'];

    function utils($sce) {
        var self = this;
        self.kendoFormatValue = kendoFormatValue;
        self.trustAsHtml = trustAsHtml;
        self.kendoPercentFormatValue = kendoPercentFormatValue;
        self.kendoRoundPercentFormatValue = kendoRoundPercentFormatValue;
        self.kendoPercentFormatValueNum = kendoPercentFormatValueNum;
        self.kendoDateFormat = kendoDateFormat;


        function trustAsHtml(vol) {
            return $sce.trustAsHtml(vol);
        }

        function kendoFormatValue(vol) {
            if (vol == null) {
                return ' ';
            } else {
                return kendo.toString(vol, '##,#');
            }
        }

        function kendoPercentFormatValue(vol) {
            if (vol == null) {
                return 'N/A';
            } else {
                return kendo.toString(vol, '#,0.00') + '%';
            }
        }

        function kendoDateFormat(vol) {
            return kendo.toString(vol, "d");
        }

        function kendoPercentFormatValueNum(vol) {
            if (vol == null) {
                return 'N/A';
            } else {
                return kendo.toString(vol, '#,0.00');
            }
        }

        function kendoRoundPercentFormatValue(vol) {
            if (vol == null) {
                return 'N/A';
            } else {
                return kendo.toString(vol, '##') + '%';
            }
        }
    }
})();
///#source 1 1 /Scripts/app/common/service/devicetype.service.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .service('device', device);

    device.$inject = [];

    function device() {
        var self = this;
        self.getDeviceType = getDeviceType;
        function getDeviceType() {
                return {
                    Android: function () {
                        return navigator.userAgent.match(/Android/i);
                    },
                    BlackBerry: function () {
                        return navigator.userAgent.match(/BlackBerry/i);
                    },
                    iOS: function () {
                        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                    },
                    Opera: function () {
                        return navigator.userAgent.match(/Opera Mini/i);
                    },
                    Windows: function () {
                        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
                    },
                    any: function () {
                        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
                    }
                };
        }
    }
})();
///#source 1 1 /Scripts/app/common/factors/filterModel.factory.js
'use strict';
angular
    .module('nqpro').factory('filterModelFactory', function () {
        var filterModeloptions = {};
        var getNewsPanelObject = function () {
           return {
                cap: {
                        mega: false,
                        big: false,
                        mid: false,
                        small: false,
                        micro: false,
                        nano: false
                },
                id: {
                       MB: false,
                       BW: false,
                       CN: false,
                       GN: false,
                       MW: false,
                       AM: false,
                       PR: false,
                       SC: false,
                       FW: false,
                       WH: false,
                       BZ: false,
                       visibleElement: {
                            MB: false,
                            BW: false,
                            CN: false,
                            GN: false,
                            MW: false,
                            AM: false,
                            PR: false,
                            SC: false,
                            FW: false,
                            WH: false,
                            BZ: false
                       }
               },
                perfor: {
                    val6: false,
                    val5: false,
                    val4: false,
                    val3: false,
                    val2: false,
                    val1: false,
                    val0: false
                },
                piceMax: {
                    value: null
                },
                piceMin: {
                    value: null
                },
                vol: {
                    val4: false,
                    val3: false,
                    val2: false,
                    val1: false,
                    val0: false
                },
                volrat: {
                    val4: false,
                    val3: false,
                    val2: false,
                    val1: false,
                    val0: false
                }
            };
        };
        var getEarningsPanelObject = function () {
            return {
                calendarDate: {
                    value: null,
                    kvalue: null
                },
                todValue: {
                    afterM: false,
                    beforeM: false,
                    duringM: false
                },
                symbol: {
                    value: null
                },
                type: {
                    week: false,
                    day: true
                }
            };
        };
        var setNewsPanelObjectValue = function (filterValue, filterModel) {
            if (filterValue) {
                if (filterValue.cap) {
                    angular.forEach(filterValue.cap, function(value) {
                        switch (value) {
                        case "mega":
                            filterModel.cap.mega = true;
                            break;
                        case "big":
                            filterModel.cap.big = true;
                            break;
                        case "mid":
                            filterModel.cap.mid = true;
                            break;
                        case "small":
                            filterModel.cap.small = true;
                            break;
                        case "micro":
                            filterModel.cap.micro = true;
                            break;
                        case "nano":
                            filterModel.cap.nano = true;
                            break;
                        }
                    });
                }
                if (filterValue.id) {
                    angular.forEach(filterValue.id, function(value) {
                        switch (value) {
                        case "BW":
                            filterModel.id.BW = true;
                            break;
                        case "CN":
                            filterModel.id.CN = true;
                            break;
                        case "GN":
                            filterModel.id.GN = true;
                            break;
                        case "MW":
                            filterModel.id.MW = true;
                            break;
                        case "AM":
                            filterModel.id.AM = true;
                            break;
                        case "PR":
                            filterModel.id.PR = true;
                            break;
                        case "SC":
                            filterModel.id.SC = true;
                            break;
                        case "FW":
                            filterModel.id.FW = true;
                            break;
                        case "WH":
                            filterModel.id.WH = true;
                            break;
                        case "BZ":
                            filterModel.id.BZ = true;
                            break;

                        }
                    });
                }
                if (filterValue.perfor) {
                    angular.forEach(filterValue.perfor, function(value) {
                        switch (value) {
                        case "6":
                            filterModel.perfor.val6 = true;
                            break;
                        case "5":
                            filterModel.perfor.val5 = true;
                            break;
                        case "4":
                            filterModel.perfor.val4 = true;
                            break;
                        case "3":
                            filterModel.perfor.val3 = true;
                            break;
                        case "2":
                            filterModel.perfor.val2 = true;
                            break;
                        case "1":
                            filterModel.perfor.val1 = true;
                            break;
                        case "0":
                            filterModel.perfor.val0 = true;
                            break;
                        }
                    });
                }
                if (filterValue.vol) {
                    angular.forEach(filterValue.vol, function(value) {
                        switch (value) {
                        case "4":
                            filterModel.vol.val4 = true;
                            break;
                        case "3":
                            filterModel.vol.val3 = true;
                            break;
                        case "2":
                            filterModel.vol.val2 = true;
                            break;
                        case "1":
                            filterModel.vol.val1 = true;
                            break;
                        case "0":
                            filterModel.vol.val0 = true;
                            break;
                        }
                    });
                }
                if (filterValue.volrat) {
                    angular.forEach(filterValue.volrat, function(value) {
                        switch (value) {
                        case "4":
                            filterModel.volrat.val4 = true;
                            break;
                        case "3":
                            filterModel.volrat.val3 = true;
                            break;
                        case "2":
                            filterModel.volrat.val2 = true;
                            break;
                        case "1":
                            filterModel.volrat.val1 = true;
                            break;
                        case "0":
                            filterModel.volrat.val0 = true;
                            break;
                        }
                    });
                }
                if (filterValue.piceMax && filterValue.piceMax.length > 0) {
                    filterModel.piceMax.value = filterValue.piceMax[0];
                }
                if (filterValue.piceMin && filterValue.piceMin.length > 0) {
                    filterModel.piceMin.value = filterValue.piceMin[0];
                }
            }
            return filterModel;
        };
        var setEarningsPanelObjectValue = function (filterValue, filterModel) {
            if (filterValue) {
                if (filterValue.todValue) {
                    angular.forEach(filterValue.todValue, function (value) {
                        switch (value) {
                            case "AFTER_M":
                                filterModel.todValue.afterM = true;
                                break;
                            case "BEFORE_M":
                                filterModel.todValue.beforeM = true;
                                break;
                            case "DURING_M":
                                filterModel.todValue.duringM = true;
                                break;
                        }
                    });
                }
                if (filterValue.type) {
                    angular.forEach(filterValue.type, function (value) {
                        switch (value) {
                            case "week":
                                filterModel.type.week = true;
                                break;
                            case "day":
                                filterModel.type.day = true;
                        }
                    });
                }
                if (filterValue.calendarDate && filterValue.calendarDate.length > 0) {
                    filterModel.calendarDate.value = filterValue.calendarDate[0];
                }
                if (filterValue.symbol && filterValue.symbol.length > 0) {
                    filterModel.symbol.value = filterValue.symbol[0];
                }
            }
            return filterModel;
        };

        filterModeloptions.getNewsPanelObject = getNewsPanelObject;
        filterModeloptions.setNewsPanelObjectValue = setNewsPanelObjectValue;
        filterModeloptions.getEarningsPanelObject = getEarningsPanelObject;
        filterModeloptions.setEarningsPanelObjectValue = setEarningsPanelObjectValue;
        return filterModeloptions;
    });
///#source 1 1 /Scripts/app/common/factors/filterPanel.factory.js
'use strict';
angular
    .module('nqpro').factory('filterPanelFactory', function () {
        var filpteroptions = {};

        var readFilters = function (scopefilter, filter, value) {
            if (filter === 'piceMin' || filter === 'piceMax') {
                if (scopefilter[filter].length === 0) {
                    scopefilter[filter].push(value);
                } else {
                    scopefilter[filter][0] = value;
                }
            } else {
                if (scopefilter[filter].length === 0) {
                    scopefilter[filter].push(value);
                } else {
                    if (jQuery.inArray(value, scopefilter[filter]) >= 0) {
                        scopefilter[filter].splice(jQuery.inArray(value, scopefilter[filter]), 1);
                    } else {
                        scopefilter[filter].push(value);
                    }
                }
            }
            return scopefilter;
        };

        var readEarningsFilters = function (scopefilter, filter, value) {
            if (filter === 'calendarDate' || filter === 'symbol') {
                if (scopefilter[filter].length === 0) {
                    scopefilter[filter].push(value);
                } else {
                    scopefilter[filter][0] = value;
                }
            } else if (filter === 'type') {
                scopefilter[filter].length = 0;
                scopefilter[filter].push(value);
            } else {
                if (scopefilter[filter].length === 0) {
                    scopefilter[filter].push(value);
                } else {
                    if (jQuery.inArray(value, scopefilter[filter]) >= 0) {
                        scopefilter[filter].splice(jQuery.inArray(value, scopefilter[filter]), 1);
                    } else {
                        scopefilter[filter].push(value);
                    }
                }
            }
            return scopefilter;
        };

        filpteroptions.readEarningsFilters = readEarningsFilters;
        filpteroptions.readFilters = readFilters;
        return filpteroptions;
    });
///#source 1 1 /Scripts/app/common/factors/auth.factory.js
'use strict';
angular
    .module('nqpro').factory('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {
        var serviceBase = '';
        var authServiceFactory = {};
        var _authentication = {
            isAuth: false,
            userName: "",
            userEmail: "",
            subscriptionLevel : "",
            subscriptionHistoryDays : "",
            useRefreshTokens: false,
            aaStartDate: null,
            aaEndDate: null,
            isAaVisible: false
        };

        var _externalAuthData = {
            provider: "",
            userName: "",
            externalAccessToken: ""
        };

        var _saveRegistration = function (registration) {
            _logOut();
            return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                return response;
            });
        };

        var _writeAuthToken = function (token) {
            localStorageService.set('authorizationData', {
                token: token
            });
        }

        var _writeUserInfo = function (data) {
            var authData = localStorageService.get('authorizationData');
            localStorageService.set('authorizationData', {
                token: authData.token,
                role: data.role,
                userName: data.userName,
                userEmail: data.userEmail,
                subscriptionLevel: data.subscriptionLevel,
                subscriptionHistoryDays: data.subscriptionHistoryDays,
                aaStartDate: data.aaStartDate,
                aaEndDate: data.aaEndDate,
                isAaVisible: data.isAaVisible
            });
        }

        

        var _login = function (loginData) {
            var data = "grant_type=password&username=" + loginData.userName + "&password=" + escape(loginData.password.replace('+','#PLUS#'));
            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + 'ngAuthApp';
            }
            var deferred = $q.defer();
            $http.post(serviceBase + 'token', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (response) {
                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    role: response.role,
                    userName: response.userName,
                    subscriptionLevel: response.subscriptionLevel,
                    subscriptionHistoryDays: response.subscriptionHistoryDays,
                    refreshToken: response.refresh_token,
                    useRefreshTokens: loginData.useRefreshTokens,
                    userEmail: response.userEmail,
                    aaStartDate: response.aaStartDate,
                    aaEndDate: response.aaEndDate,
                    isAaVisible: response.isAaVisible
                });
                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.userEmail = response.userEmail;
                _authentication.subscriptionLevel = response.subscriptionLevel;
                _authentication.subscriptionHistoryDays = response.subscriptionHistoryDays;
                _authentication.role = response.role;
                _authentication.useRefreshTokens = loginData.useRefreshTokens;
                _authentication.aaStartDate = response.aaStartDate;
                _authentication.aaEndDate = response.aaEndDate;
                _authentication.isAaVisible = response.isAaVisible;
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _logOut = function () {
            if (_authentication.isAuth) {
                $http.post('api/accountApi/logout').success(function (response) {
                    localStorageService.remove('authorizationData');
                    _authentication.isAuth = false;
                    _authentication.userName = "";
                    _authentication.userEmail = "";
                    _authentication.subscriptionLevel = "";
                    _authentication.subscriptionHistoryDays = "";
                    _authentication.role = "";
                    _authentication.useRefreshTokens = false;
                    _authentication.aaStartDate = null;
                    _authentication.aaEndDate = null;
                    _authentication.isAaVisible = false;
                }).error(function (err, status) {
                    localStorageService.remove('authorizationData');
                    _authentication.isAuth = false;
                    _authentication.userName = "";
                    _authentication.userEmail = "";
                    _authentication.subscriptionLevel = "";
                    _authentication.subscriptionHistoryDays = "";
                    _authentication.role = "";
                    _authentication.useRefreshTokens = false;
                    _authentication.aaStartDate = null;
                    _authentication.aaEndDate = null;
                    _authentication.isAaVisible = false;
                });
            } else {
                localStorageService.remove('authorizationData');
                _authentication.isAuth = false;
                _authentication.userName = "";
                _authentication.userEmail = "";
                _authentication.subscriptionLevel = "";
                _authentication.subscriptionHistoryDays = "";
                _authentication.role = "";
                _authentication.useRefreshTokens = false;
                _authentication.aaStartDate = null;
                _authentication.aaEndDate = null;
                _authentication.isAaVisible = false;
            }
        };

        var _fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.userEmail = authData.userEmail;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
                _authentication.role = authData.role;
                _authentication.aaStartDate = authData.aaStartDate;
                _authentication.aaEndDate = authData.aaEndDate;
                _authentication.isAaVisible = authData.isAaVisible;
                _authentication.subscriptionLevel = authData.subscriptionLevel;
                _authentication.subscriptionHistoryDays = authData.subscriptionHistoryDays;
            }
        };

        var _refreshToken = function () {
            var deferred = $q.defer();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                if (authData.useRefreshTokens) {
                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + "ngAuthApp";
                    localStorageService.remove('authorizationData');
                    $http.post(serviceBase + 'token', data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (response) {
                        localStorageService.set('authorizationData', {
                            token: response.access_token,
                            role: response.role,
                            userName: response.userName,
                            userEmail: response.userEmail,
                            subscriptionLevel: response.subscriptionLevel,
                            subscriptionHistoryDays: response.subscriptionHistoryDays,
                            refreshToken: response.refresh_token,
                            useRefreshTokens: true,
                            aaStartDate : response.aaStartDate,
                            aaEndDate : response.aaEndDate,
                            isAaVisible : response.isAaVisible
                        });
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        _logOut();
                        deferred.reject(err);
                    });
                }
            }
            return deferred.promise;
        };

        var _obtainAccessToken = function (externalData) {
            var deferred = $q.defer();
            $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', {
                params: {
                    provider: externalData.provider,
                    externalAccessToken: externalData.externalAccessToken
                }
            }).success(function (response) {
                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    role: response.role,
                    userName: response.userName,
                    userEmail: response.userEmail,
                    subscriptionLevel: response.subscriptionLevel,
                    subscriptionHistoryDays: response.subscriptionHistoryDays,
                    refreshToken: "",
                    useRefreshTokens: false,
                    aaStartDate: response.aaStartDate,
                    aaEndDate: response.aaEndDate,
                    isAaVisible: response.isAaVisible
                });
                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.userEmail = response.userEmail,
                _authentication.useRefreshTokens = false;
                _authentication.role = response.role;
                _authentication.subscriptionLevel = response.subscriptionLevel;
                _authentication.subscriptionHistoryDays = response.subscriptionHistoryDays;
                _authentication.aaStartDate = response.aaStartDate;
                _authentication.aaEndDate = response.aaEndDate;
                _authentication.isAaVisible = response.isAaVisible;
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _registerExternal = function (registerExternalData) {
            var deferred = $q.defer();
            $http.post(serviceBase + 'api/accountApi/registerexternal', registerExternalData).success(function (response) {
                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    role: response.role,
                    userName: response.userName,
                    userEmail: response.userEmail,
                    subscriptionLevel: response.subscriptionLevel,
                    subscriptionHistoryDays: response.subscriptionHistoryDays,
                    refreshToken: "",
                    useRefreshTokens: false,
                    aaStartDate: response.aaStartDate,
                    aaEndDate: response.aaEndDate,
                    isAaVisible: response.isAaVisible
                });
                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.userEmail = response.userEmail;
                _authentication.subscriptionLevel = response.subscriptionLevel;
                _authentication.subscriptionHistoryDays = response.subscriptionHistoryDays;
                _authentication.role = response.role;
                _authentication.useRefreshTokens = false;
                _authentication.aaStartDate = response.aaStartDate;
                _authentication.aaEndDate = response.aaEndDate;
                _authentication.isAaVisible = response.isAaVisible;
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };
        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.writeAuthToken = _writeAuthToken;
        authServiceFactory.writeUserInfo = _writeUserInfo;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;
        authServiceFactory.obtainAccessToken = _obtainAccessToken;
        authServiceFactory.externalAuthData = _externalAuthData;
        authServiceFactory.registerExternal = _registerExternal;
        return authServiceFactory;
    }]);
///#source 1 1 /Scripts/app/common/factors/tokensManager.factory.js
'use strict';
angular
    .module('nqpro').factory('tokensManagerService', ['$http', function ($http) {
        var serviceBase = '';
        var tokenManagerServiceFactory = {};
        var _getRefreshTokens = function () {
            return $http.get(serviceBase + 'api/refreshtokens').then(function (results) {
                return results;
            });
        };
        var _deleteRefreshTokens = function (tokenid) {
            return $http.delete(serviceBase + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
                return results;
            });
        };
        tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
        tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;
        return tokenManagerServiceFactory;
    }]);
///#source 1 1 /Scripts/app/common/factors/authInterceptor.factory.js
'use strict';
angular
    .module('nqpro').factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {
        var authInterceptorServiceFactory = {};
        var _request = function (config) {
            config.headers = config.headers || {};
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
            return config;
        }
        var _responseError = function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                authService.logOut();
                $location.path('/portal/login');
            }
            return $q.reject(rejection);
        }
        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;
        return authInterceptorServiceFactory;
    }]);
///#source 1 1 /Scripts/app/reports/mainreport/mainreport.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('MainReportController', MainReportController);
    MainReportController.$inject = [
        '$scope', 'mainReportService', '$q', '$routeParams', '$window', 'utils', 'authService'
    ];

    function MainReportController($scope, mainReportService, $q, $routeParams, $window, utils, authService) {
        $scope.reportData = undefined;
        $scope.guid = undefined;
        $scope.newsKey = undefined;
        $scope.isLoading = true;
        $scope.isMarketBitProvider = false;
        $scope.logoSrc = "";
        $scope.maxUp = "";
        $scope.maxDown = "";
        $scope.maxUpStyle = "";
        $scope.maxDownStyle = "";
        $scope.informationLabel = "";
        $scope.tabStripSelect = tabStripSelect;
        $scope.pctCharAxisYMaxValue = undefined;
        $scope.pctCharAxisYMinValue = undefined;
        $scope.pctSource = undefined;
        $scope.pctInfo = undefined;
        $scope.isAuth = false;
        $scope.getPctColor = getPctColor;
        var chat1DayBig = null;
        var chat2DayBig = null;
        activate();

        function activate() {
            if (authService || authService.authentication || authService.authentication.isAuth) {
                $scope.isAuth = authService.authentication.isAuth;
            }

            $scope.minWidthCondition = $scope.isAuth || !$scope.isAuth && $(window).width() <= 970;

            Highcharts.setOptions({
                chart: {
                    style: {
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                    }
                }
            });
            $scope.guid = $routeParams.guid;
            $scope.newsKey = $routeParams.news;
            if (!$scope.guid) {
                if (!$scope.newsKey) {
                    $scope.informationLabel = "Invalid News Guid. Please input correct Guid";
                    return;
                }
                $scope.informationLabel = 'Please Wait ....';
                mainReportService.getMainReportDataNews($scope.newsKey)
                    .then(function (data) {
                        displayCallBackData(data);
                    });
            } else {
                $scope.informationLabel = 'Please Wait ....';
                mainReportService.getMainReportData($scope.guid)
                    .then(function (data) {
                        displayCallBackData(data);
                    });
            }
        }


        function displayCallBackData(data) {
            $scope.reportData = data;
            $scope.newsKey = $scope.reportData.filter;
            if ($scope.reportData.secondSection.reportScaleInfo.$ref) {
                $scope.reportData.secondSection.reportScaleInfo = $scope.reportData.firstSection.reportScaleInfo;
            }
            if ($scope.reportData.provider === 'Dow Jones') {
                $scope.maxUp = $scope.reportData.secondSection.maxUp;
                $scope.maxDown = $scope.reportData.secondSection.maxDown;
                $scope.maxUpStyle = $scope.reportData.secondSection.maxUpStyle;
                $scope.maxDownStyle = $scope.reportData.secondSection.maxDownStyle;
            } else {
                $scope.maxUp = $scope.reportData.firstSection.maxUp;
                $scope.maxDown = $scope.reportData.firstSection.maxDown;
                $scope.maxUpStyle = $scope.reportData.firstSection.maxUpStyle;
                $scope.maxDownStyle = $scope.reportData.firstSection.maxDownStyle;
            }
            if ($scope.reportData.secondSection.priceChangeStyle === 'positive') {
                $scope.reportData.secondSection.priceChangeStyle = ['positive', 'k-font-icon', 'k-i-arrow-n'];
            } else if ($scope.reportData.secondSection.priceChangeStyle === 'negative') {
                $scope.reportData.secondSection.priceChangeStyle = ['negative', 'k-font-icon', 'k-i-arrow-s'];
            }
            $scope.isLoading = false;
            var chart1DayUrl = '';
            mainReportService.getChartDataDay($scope.reportData.symbol, $scope.reportData.tonDate, $scope.reportData.newsId)
                .then(function (data) {
                    var obgJson = data;
                    if ($('#graphContainer1DayBig').length > 0) {
                        var peers2 = [$scope.reportData.symbol, 'SPX'];
                        chat1DayBig = ChartReport('peer',
                            'Range',
                            $scope.reportData.symbol,
                            peers2,
                            3571,
                            $scope.reportData.firstSection.from,
                            $scope.reportData.firstSection.from,
                            'True',
                            $scope.reportData.newsId,
                            'graphContainer1DayBig',
                            chart1DayUrl,
                            true,
                            obgJson
                        );
                        chat1DayBig();
                    }
                });
            mainReportService.getChartDataDaySinceEvent($scope.reportData.symbol, $scope.reportData.tonDate, $scope.reportData.newsId)
                .then(function (data) {
                    var obgJson = data;
                    if ($('#graphContainer2DayBig').length > 0) {
                        var peers2 = [$scope.reportData.symbol, 'SPX'];
                        chat2DayBig = ChartReport('peer',
                            'Range',
                            $scope.reportData.symbol,
                            peers2,
                            3571,
                            $scope.reportData.firstSection.from,
                            $scope.reportData.secondSection.to,
                            'True',
                            $scope.reportData.newsId,
                            'graphContainer2DayBig',
                            chart1DayUrl,
                            true,
                            obgJson
                        );
                        chat2DayBig();
                    }
                });
            if ($scope.reportData.provider === 'Dow Jones') {
                $scope.logoSrc = 'Content/images/report/dj-logo.png';
            } else if ($scope.reportData.provider === 'MarketBeat') {
                $scope.isMarketBitProvider = true;
                $scope.logoSrc = 'Content/images/report/market-beat-logo.png';
            } else {
                if ($scope.reportData.id.toLowerCase() !== "am") {
                    $scope.logoSrc = 'Content/images/providers/' + $scope.reportData.id + '.png';
                } else {
                    $scope.logoSrc = 'Content/images/providers/' + $scope.reportData.provider + '.png';
                }
            }

            if (window.devicePixelRatio > 1) {
                var dotExtPosition = $scope.logoSrc.lastIndexOf(".");
                var extantion = $scope.logoSrc.slice(dotExtPosition);
                if (window.devicePixelRatio <= 2) {
                    var logoSrc = $scope.logoSrc.slice(0, dotExtPosition) + "@2x";
                } else if (window.devicePixelRatio <= 3) {
                    var logoSrc = $scope.logoSrc.slice(0, dotExtPosition) + "@3x";
                } else {
                    var logoSrc = $scope.logoSrc.slice(0, dotExtPosition) + "@3x";
                }
                $scope.logoSrc = logoSrc + extantion;
            }


            mainReportService.getNewsRelease($scope.reportData.filter)
                .then(function (data) {
                    $scope.newsData = data;
                });
        }

        function tabStripSelect(e) {
            $('#graphContainer2DayBig').highcharts().reflow();
            $('#graphContainer1DayBig').highcharts().reflow();
            var selectedIndex = $("#tabstrip").data("kendoTabStrip").select().index();
            if (selectedIndex === 2) {
                pctFillChartData();
            }
        }

       
        

        function pctFillChartData() {
            $scope.pctSource = {
                transport: {
                    read: function (e) {
                        mainReportService.getPctInfo($scope.newsKey)
                            .then(function (data) {
                                fillPctValue(data);
                                e.success($scope.pctInfo);
                            });
                    }
                }
            };
        }

        function fillPctValue(data) {
            $scope.pctInfo = data;
            $scope.pctCharAxisYMaxValue = 0;
            $scope.pctCharAxisYMinValue = 0;
            angular.forEach($scope.pctInfo, function (pctInfoItem) {
                pctInfoItem.percent = pctInfoItem.percent * 100;
                if (pctInfoItem.percent > $scope.pctCharAxisYMaxValue) $scope.pctCharAxisYMaxValue = pctInfoItem.percent;
                if (pctInfoItem.percent < $scope.pctCharAxisYMinValue) $scope.pctCharAxisYMinValue = pctInfoItem.percent;
                pctInfoItem.percentStr = utils.kendoPercentFormatValue(pctInfoItem.percent);
                pctInfoItem.userColor = getPctColor(pctInfoItem.percent);
            });
            $scope.pctCharAxisYMaxValue = $scope.pctCharAxisYMaxValue * 2;
            $scope.pctCharAxisYMinValue = $scope.pctCharAxisYMinValue * 2;
            if ($scope.pctCharAxisYMaxValue === 0 && $scope.pctCharAxisYMinValue < 0) {
                $scope.pctCharAxisYMaxValue = ($scope.pctCharAxisYMinValue / 2) * -1;
            }
        }

        function getPctColor(value) {
            if (!value) return '#000';
            else if (value >= 0) return "#4CB45C";
            else if (value < 0) return "#D32E28";
            else return "#000";
        }
        $scope.chartOptions2 = {
            renderAs: "SVG",
            legend: {
                visible: false
            },
            seriesDefaults: {
                type: 'column'
            },
            series: [{
                field: "percent",
                colorField: "userColor",
                color: "#4572A7"
            }],
            tooltip: {
                visible: true,
                template: "${dataItem.toolTipLabel}<br/>${dataItem.percent}"
            },
            categoryAxis: {
                labels: {
                    font: "12px Roboto, Helvetica, Arial, sans-serif",
                    rotation: "auto"
                },
                categories: ["30 Seconds", "1 Minute", "5 Minutes", "10 Minutes", "30 Minutes", "60 Minutes", "90 Minutes", "120 Minutes"],
                majorGridLines: {
                    visible: false
                }
            },
            valueAxis: {
                labels: {
                    font: "12px Roboto, Helvetica, Arial, sans-serif",
                    format: "{0:n2} %"
                }
            },
            pannable: {
                lock: "y"
            }
        }

        
    }
})();
///#source 1 1 /Scripts/app/reports/mainreport/mainreport.service.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .service('mainReportService', mainReportService);
    mainReportService.$inject = ['$q', 'httpService'];

    function mainReportService($q, httpService) {
        var self = this;
        self.getMainReportData = getMainReportData;
        self.getMainReportDataNews = getMainReportDataNews;
        self.getChartJson = getChartJson;
        self.getSymbolSearch = getSymbolSearch;
        self.getChartDataDay = getChartDataDay;
        self.getChartDataDaySinceEvent = getChartDataDaySinceEvent;
        self.getPctInfo = getPctInfo;
        self.getNewsRelease = getNewsRelease;

        function getMainReportData(guid) {
            return httpService.get('api/reportApi/getmainreport', {
                guid: guid
            });
        }

        function getMainReportDataNews(news) {
            return httpService.get('api/reportApi/getmainreportnews', {
                news: news
            });
        }

        function getChartJson(url) {
            return httpService.get('api/reportApi/GetDataFromBW', {
                url: url
            });
        }

        function getSymbolSearch(options) {
            return httpService.get('api/reportApi/getsymbol', {
                options: options
            });
        }

        function getChartDataDay(symbol, tonDate, newsKey) {
            return httpService.get('api/chartApi/getchartjsonday', {
                symbol: symbol,
                tonDate: tonDate,
                newsKey: newsKey
            });
        }

        function getChartDataDaySinceEvent(symbol, tonDate, newsKey) {
            return httpService.get('api/chartApi/getchartjsonsincevent', {
                symbol: symbol,
                tonDate: tonDate,
                newsKey: newsKey
            });
        }

        function getPctInfo(newsKey) {
            return httpService.get('api/stockApi/getNewsPctInfo', {
                newsKey: newsKey
            });
        }

        function getNewsRelease(newsKey) {
            return httpService.get('api/stockApi/getNewsLink', {
                newsKey: newsKey
            });
        }
    }
})();
///#source 1 1 /Scripts/app/admin/admin.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('AdminController', AdminController);

    AdminController.$inject = [
        '$scope', 'adminService'
    ];

    function AdminController($scope, adminService) {
        $scope.removeClient = removeClient;
        $scope.changePassword = changePassword;
        $scope.changeHandler = changeHandler;
        $scope.fromDateChanged = fromDateChanged;
        $scope.contactValidator = null;
        $scope.minEndDate = null;
        $scope.isChangePassword = false;
        $scope.selectedClient = null;
        $scope.changeClientPassword = {
            newPassword: '',
            confirmNewPassword: ''
        }
       var roleDataSource = [
            { 
              RoleName : "Admin",
              RoleID: "Admin"
            }, { 
              RoleName : "User",
              RoleID: "User"
            }
       ],
       firstLoad = true;

       activate();

       $scope.$watch('selectedClient.aaIsActive', function (newValue) {
           if (newValue && !$scope.selectedClient.aaStartDate) {
               $scope.selectedClient.aaStartDate = new Date();
               $scope.minEndDate = $scope.selectedClient.aaStartDate;
           }
       });

        var tableOptions = undefined;

        function activate() {
            $scope.adminGridDataSource = {
                transport: {
                    read: function (options) {
                        tableOptions = options;
                        adminService.getUsers(options.data.take, options.data.skip, options.data.sort)
                            .then(function (data) {
                                if (data.total > 0) $scope.gridIsVisible = true;
                                options.success(data);
                                if (firstLoad) {
                                    var grid = $("#adminClientData").data("kendoGrid");
                                    grid.select('tr:eq(0)');
                                    firstLoad = false;
                                }
                                
                            });
                    }
                },
                pageSize: 20,
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
                            id: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            role: {
                                type: "string"
                            },
                            phoneNumber: {
                                type: "string"
                            },
                            userName: {
                                type: "string"
                            },
                            aaStartDate: {
                                type: "string"
                            },
                            aaEndDate: {
                                type: "string"
                            },
                            aaIsActive: {
                                type: "boolean"
                            }
                        }
                    }
                }
            };
        }

        function changeHandler(data, dataItem, column) {
            $scope.isChangePassword = false;
            $scope.selectedClient = angular.copy(data);
            $scope.minEndDate = $scope.selectedClient.aaStartDate;
        }

        function removeClient(e) {
            var grid = $("#adminClientData").data("kendoGrid");
            grid.select($(e.currentTarget).closest("tr"));
            if ($scope.selectedClient && $scope.selectedClient.id) {
                var confirmCallback = confirm("Are you sure you want delete  client " + $scope.selectedClient.userName);
                if (confirmCallback === true) {
                    adminService.removeUser($scope.selectedClient.id)
                            .then(function (data) {
                                if (data.succeeded === false) {
                                    alert("Sorry! Record hasn't been successfully deleted");
                                } else {
                                    alert("Record has been successfully deleted");
                                }
                                var grid = $("#adminClientData").data("kendoGrid");
                                grid.dataSource.page(1);
                                grid.select('tr:eq(0)');
                        });
                }
            }
        }

        function fromDateChanged() {
            $scope.minEndDate = new Date($scope.selectedClient.aaStartDate);
            if ($scope.selectedClient.aaEndDate < $scope.selectedClient.aaStartDate) {
                $scope.selectedClient.aaEndDate = $scope.selectedClient.aaStartDate;
            }
        }

        function changePassword(e) {
            var grid = $("#adminClientData").data("kendoGrid");
            grid.select($(e.currentTarget).closest("tr"));
            $scope.isChangePassword = true;
        }

        $scope.validateContact = function (event) {
            event.preventDefault();
            if ($scope.contactValidator.validate()) {
                if ($scope.selectedClient && $scope.selectedClient.id) {
                    adminService.changeUser($scope.selectedClient.email,
                                            $scope.selectedClient.phoneNumber,
                                            $scope.selectedClient.userName,
                                            $scope.selectedClient.role,
                                            $scope.selectedClient.aaStartDate,
                                            $scope.selectedClient.aaEndDate,
                                            $scope.selectedClient.aaIsActive)
                                .then(function (data) {
                        if (data.succeeded) {
                            $scope.validationMessage = "Your information has been updated!";
                            $scope.adminGridDataSource.transport.read(tableOptions);
                        }
                    });
                }
            }
        }

        $scope.validatePassword = function (event) {
            event.preventDefault();

            if ($scope.selectedClient && $scope.selectedClient.id) {
                if ($scope.changeClientPassword.newPassword !== $scope.changeClientPassword.confirmNewPassword) {
                    $scope.passValidationMessage = "Passwords do not match!";
                    return;
                }
                if ($scope.passwordValidator.validate()) {
                    adminService.changePassword($scope.selectedClient.id, $scope.changeClientPassword.newPassword, $scope.changeClientPassword.confirmNewPassword)
                        .then(function(data) {
                            $scope.passValidationMessage = data.message;
                        });
                }
            }
        }


        $scope.roleOptions = {
            dataSource: roleDataSource,
            dataTextField: "RoleName",
            dataValueField: "RoleID"
        };    
        

        $scope.adminGridOptions = {
            columns: [{
                "title": "UserName",
                "field": "userName",
                "template": "<div style='text-align: center;width:100%'>#: userName  #</div>"

            }, {
                "title": "Email",
                "field": "email",
                "template": "<div style='text-align: center;width:100%'>#: email  #</div>"
            }, {
                "title": "Phone Number",
                "field": "phoneNumber",
                "template": "<div style='text-align: center;width:100%'>#: phoneNumber  #</div>"
            },{
                command: [{
                    template: "<button class='k-button' ng-click='removeClient($event)'>Remove</button>"
                }, {
                    template: "<button class='k-button' ng-click='changePassword($event)'>Change password</button>"
                }],
                title: "Operations"
            }],
           
            groupable: false,
            pageable: true,
            sortable: true,
            resizable: true,
            selectable: true
        };
    }
})();
///#source 1 1 /Scripts/app/admin/admin.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('adminService', adminService);

    adminService.$inject = ['$q', 'httpService'];

    function adminService($q, httpService) {
        var self = this;
        self.getUsers = getUsers;
        self.changeUser = changeUser;
        self.changePassword = changePassword;
        self.removeUser = removeUser;


        function getUsers(take, skip, sort) {
            var dataTableOptions = {
                take: take,
                skip: skip,
                sortDescription: sort
            };
            return httpService.post('api/adminApi/getUsers', dataTableOptions);
        }

        function changeUser(email, phone, userName, role, aaStartDate, aaEndDate, aaIsActive) {
            var model = {
                email: email,
                phone: phone,
                userName: userName,
                role: role,
                aaStartDate: aaStartDate,
                aaEndDate: aaEndDate,
                aaIsActive: aaIsActive
            };
            return httpService.post('api/accountApi/changeuser', model);
        }

        function changePassword(id, newPassword, confirmPassword) {
            var updateUserPasswordModel = {
                id: id,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            };
            return httpService.post('api/accountApi/changeuserpassword', updateUserPasswordModel);
        }

        function removeUser(id) {
            var model = {
                id: id
            };
            return httpService.post('api/accountApi/removeuser', model);
        }
    }


})();
///#source 1 1 /Scripts/app/settings/settings.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('SettingsController', SettingsController);
    SettingsController.$inject = [
        '$scope', 'settingsService', 'authService', '$location'
    ];

    function SettingsController($scope, settingsService, authService, $location) {
        $scope.toAdminPanel = toAdminPanel;
        $scope.buttonAdminIsShow = false;
        $scope.role = undefined;
        $scope.resultmessage = "";
        activate();

        function activate() {
            if (!authService.authentication || !authService.authentication.isAuth) {
                return $location.path("/portal/login");
            }

            if (authService && authService.authentication && authService.authentication.isAuth) {
                $scope.role = authService.authentication.role;
                if (authService.authentication.role.toUpperCase() === 'ADMIN') {
                    $scope.buttonAdminIsShow = true;
                }
            }
        }

        function toAdminPanel() {
            return $location.path("/admin");
        }
    }
})();
///#source 1 1 /Scripts/app/settings/settings.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('settingsService', settingsService);

    settingsService.$inject = ['$q', 'httpService'];

    function settingsService($q, httpService) {
        var self = this;

  }

})();
///#source 1 1 /Scripts/app/about/about.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('AboutController', AboutController);

    AboutController.$inject = [
        '$scope', 'aboutService', '$q', '$routeParams', 'cfpLoadingBar'
    ];

    function AboutController($scope, aboutService, $q, $routeParams, cfpLoadingBar) {

        activate();

        function activate() {
           
        }

    }
})();
///#source 1 1 /Scripts/app/about/about.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('aboutService', aboutService);

    aboutService.$inject = ['$q', 'httpService'];

    function aboutService($q, httpService) {
        var self = this;
        self.getData = getData;
        function getData(guid) {
            return httpService.get('api/reportApi/getmainreport', { guid: guid });
        }
  }

})();
///#source 1 1 /Scripts/app/performanceAnalystActions/performanceAnalystActions.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('PerformanceAnalystActionsController', PerformanceAnalystActionsController);
    PerformanceAnalystActionsController.$inject = [
        '$scope', 'performanceAnalystActionsService', 'utils', 'authService', '$cookies', 'device'
    ];

    function PerformanceAnalystActionsController($scope, performanceAnalystActionsService, utils, authService, $cookies, device) {
        $scope.newsData = undefined;
        //$scope.init = init;
        $scope.symbol = '';
        $scope.options = undefined;
        $scope.responseTime = undefined;
        $scope.historicPerformanceLongInfo = undefined;
        $scope.historicPerformanceShortInfo = undefined;
        $scope.changeOperations = changeOperations;
        $scope.toggleShowAllData = toggleShowAllData;
        $scope.clearFilters = clearFilters;
        $scope.analystActionLongInfo = undefined;
        $scope.analystActionShortInfo = undefined;
        $scope.isShowAllData = false;
        $scope.isHaveAccess = false;
        var isActive = false,
            isUpgrade = null;
        activate();

        function activate() {
            if (device.getDeviceType().any() === null) {
                $scope.isMobile = false;
            } else {
                $scope.isMobile = true;
            }
        //}


        //function init() {
            if (!authService || !authService.authentication || !authService.authentication.isAuth || authService.authentication.isAaVisible === "False") {
                return;
            }

            reloadData(false);

            $scope.isHaveAccess = true;
            $scope.gridDataSource = {
                transport: {
                    read: function (options) {
                        if (!isActive) {
                            var cSort = $cookies.getObject("paa_sorting");
                            if (cSort) options.data.sort = cSort;
                        }
                        $scope.options = options;
                        performanceAnalystActionsService.getAnalystActionsTableData(options.data.take, options.data.skip, options.data.sort, isUpgrade, $scope.isShowAllData)
                            .then(function (data) {
                                if (data) {
                                    if (data.total > 0) $scope.gridIsVisible = true;
                                    $scope.responseTime = utils.kendoDateFormat(data.responseTime);
                                    options.success(data);
                                } else {
                                    $scope.gridIsVisible = false;
                                }
                                $cookies.putObject("paa_sorting", options.data.sort);
                                isActive = true;
                            });
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverSorting: true,
                schema: {
                    total: function (data) {
                        $('.date-n-time').text(data.responseTime);
                        return data.total;
                    },
                    data: function (data) {
                        return data.data;
                    },
                    model: {
                        fields: {
                            firm: {
                                type: "string"
                            },
                            action: {
                                type: "string"
                            },
                            newsCountFirm: {
                                type: "number"
                            },
                            avgPerformanceFirm: {
                                type: "number"
                            },
                            avgVolumeRatioFirm: {
                                type: "number"
                            },
                            winFirm: {
                                type: "number"
                            },
                            avgUpFirm: {
                                type: "number"
                            },
                            avgDownFirm: {
                                type: "number"
                            }
                        }
                    }
                }
            };
           // reloadData(false);
        }

        function reloadPaging() {
            var grid = $("#analystActionGrid").data("kendoGrid");
            grid.dataSource.page(1);
        }

        function toggleShowAllData() {
            reloadPaging();
            $scope.gridDataSource.transport.read($scope.options);
        }

        function clearFilters() {
            isUpgrade = null;
            $scope.isShowAllData = false;
            reloadPaging();
            $scope.gridDataSource.transport.read($scope.options);
        }

        function changeOperations(value, isShowAllData) {
            isUpgrade = value;
            $scope.isShowAllData = isShowAllData;
            reloadPaging();
            $scope.gridDataSource.transport.read($scope.options);
        }

        function reloadData(isReload) {
            if (isReload) {
                $scope.gridDataSource.transport.read($scope.options);
            }
            performanceAnalystActionsService.getPerformanceInfo(true)
                .then(function (data) {
                    $scope.analystActionLongInfo = data;
                    formatValueData($scope.analystActionLongInfo);
                });
            performanceAnalystActionsService.getPerformanceInfo(false)
                .then(function (data) {
                    $scope.analystActionShortInfo = data;
                    formatValueData($scope.analystActionShortInfo);
                });
            performanceAnalystActionsService.getHistoricPerformanceInfo(true)
                .then(function (data) {
                    $scope.historicPerformanceLongInfo = data;
                    formatValueData($scope.historicPerformanceLongInfo);
                });
            performanceAnalystActionsService.getHistoricPerformanceInfo(false)
                .then(function (data) {
                    $scope.historicPerformanceShortInfo = data;
                    formatValueData($scope.historicPerformanceShortInfo);
                });
        }

        function formatValueData(item) {
            if (item) {
                item.avgPerformanceFrmt = utils.kendoPercentFormatValue(item.avgPerformance);
                item.avgVolumeRatioFrmt = utils.kendoPercentFormatValueNum(item.avgVolumeRatio);
                item.winFrmt = utils.kendoRoundPercentFormatValue(item.win);
                item.avgUpFrmt = utils.kendoPercentFormatValue(item.avgUp);
                item.avgDownFrmt = utils.kendoPercentFormatValue(item.avgDown);
            }
        }

    }
})();
///#source 1 1 /Scripts/app/performanceAnalystActions/performanceAnalystActions.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('performanceAnalystActionsService', performanceAnalystActionsService);

    performanceAnalystActionsService.$inject = ['$q', 'httpService'];

    function performanceAnalystActionsService($q, httpService) {
        var self = this;
        self.getAnalystActionsTableData = getAnalystActionsTableData;
        self.getHistoricPerformanceInfo = getHistoricPerformanceInfo;
        self.getPerformanceInfo = getPerformanceInfo;

        function getAnalystActionsTableData(take, skip, sortDescription, isUpgrade, isShowAllData) {
            var performanceAnalystActionOptions = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                isUpdateOperation: isUpgrade,
                showAll: isShowAllData
            };
            return httpService.post('api/analystActionApi/getPerformanceAnalystActionsTableData', performanceAnalystActionOptions);
        }

        function getHistoricPerformanceInfo(isUpdate) {
            return httpService.get('api/analystActionApi/getHistoricPerformanceAnalystActionInfo', { isUpgrade: isUpdate, isDay:false });
        }

        function getPerformanceInfo(isUpdate) {
            return httpService.get('api/analystActionApi/getHistoricPerformanceAnalystActionInfo', { isUpgrade: isUpdate, isDay: true });
        }
  }

})();
///#source 1 1 /Scripts/app/performanceAnalystActions/performanceAnalystActionsTableTemplate/performanceAAgridTempalte.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('PerformanceAAgridTempalteController', PerformanceAAgridTempalteController);
    PerformanceAAgridTempalteController.$inject = [
        '$scope'
    ];

    function PerformanceAAgridTempalteController($scope) {
        function activate() {
             $scope.gridOptions = {
                columns: [{
                    "title": "Firm",
                    "field": "firm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "#: firm  #"
                }, {
                    "title": "Action",
                    "field": "action",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "#: action  #"
                }, {
                    "title": "News Count",
                    "field": "newsCountFirm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "#: (newsCountFirm == null) ? ' ' : kendo.toString(newsCountFirm, 'n0') #"
                }, {
                    "title": "Avg. %",
                    "field": "avgPerformanceFirm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "#: ( avgPerformanceFirm == null) ? ' ' : kendo.toString(avgPerformanceFirm, 'p2') #"
                }, {
                    "title": "Avg. Volume ratio",
                    "field": "avgVolumeRatioFirm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "#= ( avgVolumeRatioFirm == null) ? ' ' : kendo.toString(avgVolumeRatioFirm, 'n2') #"
                }, {
                    "title": "Win%",
                    "field": "winFirm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "#= ( winFirm == null) ? ' ' : kendo.toString(winFirm, 'p2') #"
                }, {
                    "title": "Avg. Up",
                    "field": "avgUpFirm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "<span class='nar positive k-font-icon k-i-arrow-n'></span>#= ( avgUpFirm == null) ? ' ' : kendo.toString(avgUpFirm, 'p2') #"
                }, {
                    "title": "Avg. Down",
                    "field": "avgDownFirm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "<span class='nar negative k-font-icon k-i-arrow-s'></span>- #= ( avgDownFirm == null) ? ' ' : kendo.toString(avgDownFirm, 'p2') #"
                }],
                groupable: false,
                pageable: true,
                sortable: true,
                resizable: true
            };
        }
    activate();
    }
})();
///#source 1 1 /Scripts/app/performanceAnalystActions/performanceAnalystActionsTableTemplate/performanceAAMobileGridTemplate.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('PerformanceAAMobileGridTemplateController', PerformanceAAMobileGridTemplateController);
    PerformanceAAMobileGridTemplateController.$inject = [
        '$scope', 'device'
    ];

    function PerformanceAAMobileGridTemplateController($scope, device) {
        function activate() {
            var columsMobile = [{
                "title": "Firm",
                "field": "firm",
                "width": 110,
                attributes: {
                    "style": "text-align: center"
                },
                "template": "#: firm  #"
            }, {
                "title": "Action",
                "field": "action",
                "width": 110,
                attributes: {
                    "style": "text-align: center"
                },
                "template": "#: action  #"
            }, {
                "title": "News Count",
                "field": "newsCountFirm",
                "width": 110,
                attributes: {
                    "style": "text-align: center"
                },
                "template": "#: (newsCountFirm == null) ? ' ' : kendo.toString(newsCountFirm, 'n0') #"
            }]
            if (device.getDeviceType().any() !== null && device.getDeviceType().any()[0] === "iPad") {
                columsMobile.push({
                "title": "Avg. %",
                "field": "avgPerformanceFirm",
                "width": 110,
                attributes: {
                    "style": "text-align: center"
                },
                "template": "#: ( avgPerformanceFirm == null) ? ' ' : kendo.toString(avgPerformanceFirm, 'p2') #"
            });
                columsMobile.push({
                    "title": "Avg. Volume ratio",
                    "field": "avgVolumeRatioFirm",
                    "width": 110,
                    attributes: {
                        "style": "text-align: center"
                    },
                    "template": "#= ( avgVolumeRatioFirm == null) ? ' ' : kendo.toString(avgVolumeRatioFirm, 'n2') #"
                });
            }


            $scope.gridOptions = {
                columns: columsMobile,
                detailTemplate: kendo.template($("#templateMobile").html()),
                groupable: false,
                pageable: true,
                sortable: true,
                resizable: true
            };

        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/analystActions/analystActions.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('AnalystActionsController', AnalystActionsController);
    AnalystActionsController.$inject = [
        '$scope', 'analystActionsService', 'utils', 'authService', '$cookies', '$routeParams', '$window', 'filterPanelFactory', '$location'
    ];

    function AnalystActionsController($scope, analystActionsService, utils, authService, $cookies, $routeParams, $window, filterPanelFactory, $location) {
        $scope.action = undefined;
        $scope.options = undefined;
        $scope.newsData = undefined;
        $scope.pageHeader = undefined;
        $scope.responseTime = undefined;
        $scope.toDateObject = undefined;
        $scope.fromDateObject = undefined;
        $scope.analystActionLongInfo = undefined;
        $scope.analystActionShortInfo = undefined;
        $scope.historicPerformanceLongInfo = undefined;
        $scope.historicPerformanceShortInfo = undefined;
        $scope.symbol = '';
        $scope.isExpand = true;
        $scope.isShowUpgrades = false;
        $scope.isShowDowngrades = false;
        $scope.minDate = null;
        $scope.maxDate = null;
        $scope.subscriberDate = new Date(1990, 0, 1, 0, 0, 0);
        $scope.timer = null;
        $scope.dataRangeOptions = {
            startDate: null,
            endDate: null
        };
        $scope.isHaveAccess = false;
        $scope.toDateChanged = toDateChanged;
        $scope.fromDateChanged = fromDateChanged;
        $scope.toggleShowData = toggleShowData;
        $scope.changeFilter = changeFilter;
        $scope.filter = {
            "cap": [],
            "vol": [],
            "perfor": [],
            "volrat": [],
            "id": ["FW"],
            "piceMin": [],
            "piceMax": []
        };
        var isActive = false,
            subscriptionLevel = null,
            subscriptionHistoryDays = null;
        activate();

        function activate() {

            if (!authService || !authService.authentication || !authService.authentication.isAuth) {
                $location.path('/portal/login');
            }

            if (authService.authentication.isAaVisible === "False") {
                return;
            }

            var authData = authService.authentication;
            if (authData) {
                subscriptionLevel = authData.subscriptionLevel;
                subscriptionHistoryDays = authData.subscriptionHistoryDays;
            }

            var calculateDate = new Date();
            calculateDate.setDate(calculateDate.getDate() - subscriptionHistoryDays);
            $scope.subscriberDate = calculateDate;


            var cFilter = $cookies.getObject("aa_filter");
            if (cFilter) $scope.filter = cFilter;
            if ($scope.filter.id.length === 0) $scope.filter.id.push("FW");

            $scope.action = $routeParams.action;
            switch ($scope.action) {
                case "Downgrades":
                    $scope.isShowDowngrades = true;
                    $scope.pageHeader = "TODAY’S DOWNGRADES";
                    break;
                case "Upgrades":
                    $scope.isShowUpgrades = true;
                    $scope.pageHeader = "TODAY’S UPGRADES";
                    break;
                default:
                    if ($scope.action === "VolRatio") {
                        $scope.pageHeader = "TODAY’S MOST ACTIVES";
                    } else {
                        $scope.pageHeader = "TODAY’S ANALYST ACTIONS";
                    }
                    $scope.isShowUpgrades = true;
                    $scope.isShowDowngrades = true;
                    break;
            }
            $scope.isHaveAccess = true;
            $scope.gridDataSource = {
                transport: {
                    read: function (options) {
                        if (!isActive) {
                            var cSort = $cookies.getObject("aa_sorting");
                            if (cSort) options.data.sort = cSort;
                        }
                        $scope.options = options;
                        analystActionsService.getAnalystActionsTableData(options.data.take, options.data.skip, options.data.sort,$scope.filter, $scope.fromDateObject, $scope.toDateObject, $scope.action)
                            .then(function (data) {
                                if (data) {
                                    if (data.total > 0) $scope.gridIsVisible = true;
                                    $scope.responseTime = utils.kendoDateFormat(data.responseTime);
                                    options.success(data);
                                } else {
                                    $scope.gridIsVisible = false;
                                }
                                $cookies.putObject("aa_sorting", options.data.sort);
                                isActive = true;
                            });
                    }
                },
                pageSize: 20,
                serverPaging: true,
                serverSorting: true,
                schema: {
                    total: function (data) {
                        $('.date-n-time').text(data.responseTime);
                        return data.total;
                    },
                    data: function (data) {
                        return data.data;
                    },
                    model: {
                        fields: {
                            symbol: {
                                type: "string"
                            },
                            dateTime: {
                                type: "string"
                            },
                            pubTime: {
                                type: "string"
                            },
                            source: {
                                type: "string"
                            },
                            from: {
                                type: "string"
                            },
                            to: {
                                type: "string"
                            },
                            firm: {
                                type: "string"
                            },
                            direction: {
                                type: "string"
                            }
                        }
                    }
                }
            };
            var d = new Date();

            var localTime = d.getTime(),
                localOffset = d.getTimezoneOffset() * 60000;
            var utc = localTime + localOffset;
            var offset = -4;
            var newyork = utc + (3600000 * offset);
            var newDate = new Date(newyork);
            var curDate = new Date(newyork);
            $scope.maxDate = new Date(newyork);
            if (newDate.getDay() === 0) {

                $scope.maxDate.setDate(curDate.getDate() + 1);
                newDate.setDate(newDate.getDate() - 2);
                //Monday following week
                
            } else if (newDate.getDay() === 6) {

                $scope.maxDate.setDate(curDate.getDate() + 2);
                newDate.setDate(newDate.getDate() - 1);
                //Monday following week
                
            }
            $scope.minDate = $scope.fromDateObject = $scope.toDateObject = newDate;
            reloadData(false);
        }
        $scope.datePickerOption = {
            disableDates: ["sa", "su"]
        }

        function fromDateChanged() {
            var newDate = new Date($scope.fromDateObject);
            newDate.setHours(0, 0, 0, 0);
            var subscriberDate = new Date();
            subscriberDate.setDate(subscriberDate.getDate() - subscriptionHistoryDays);
            subscriberDate.setHours(0, 0, 0, 0);
            if (newDate < subscriberDate) {
                alert("The specified date range is not available for your active subscription plan");
                $scope.fromDateObject = null;
                return;
            }
            if ($scope.fromDateObject > $scope.toDateObject) {
                $scope.toDateObject = $scope.fromDateObject;
            }
            reloadPaging();
            reloadData(true);
        };
        function reloadPaging() {
            var grid = $("#analystActionGrid").data("kendoGrid");
            grid.dataSource.page(1);
        }
        function toDateChanged() {
            reloadData(true);
        };

        function reloadData(isReload) {
            if (isReload) {
                $scope.gridDataSource.transport.read($scope.options);
            }
            analystActionsService.getAnalystActionInfo(true, $scope.fromDateObject, $scope.toDateObject)
                .then(function (data) {
                    $scope.analystActionLongInfo = data;
                    formatValueData($scope.analystActionLongInfo);
                });
            analystActionsService.getAnalystActionInfo(false, $scope.fromDateObject, $scope.toDateObject)
                .then(function (data) {
                    $scope.analystActionShortInfo = data;
                    formatValueData($scope.analystActionShortInfo);
                });
            analystActionsService.getHistoricPerformanceInfo(true, $scope.fromDateObject, $scope.toDateObject)
                .then(function (data) {
                    $scope.historicPerformanceLongInfo = data;
                    formatValueData($scope.historicPerformanceLongInfo);
                });
            analystActionsService.getHistoricPerformanceInfo(false, $scope.fromDateObject, $scope.toDateObject)
                .then(function (data) {
                    $scope.historicPerformanceShortInfo = data;
                    formatValueData($scope.historicPerformanceShortInfo);
                });
        }

        function toggleShowData() {
            var grid = $("#analystActionGrid").data("kendoGrid");
            if ($scope.isExpand) {
                grid.expandRow(grid.tbody.find("tr.k-master-row"));
            } else {
                grid.collapseRow(grid.tbody.find("tr.k-master-row"));
            }
        }

        function formatValueData(item) {
            if (item) {
                item.avgPerformanceFrmt = utils.kendoPercentFormatValue(item.avgPerformance);
                item.avgVolumeRatioFrmt = utils.kendoPercentFormatValueNum(item.avgVolumeRatio);
                item.winFrmt = utils.kendoRoundPercentFormatValue(item.win);
                item.avgUpFrmt = utils.kendoPercentFormatValue(item.avgUp);
                item.avgDownFrmt = utils.kendoPercentFormatValue(item.avgDown);
            }
        }
        $scope.gridOptions = {
            columns: [{
                "title": "Symbol",
                "field": "symbol",
                "template": "<span>#: symbol  #</span>"
            }, {
                "title": "DateTime",
                "field": "dateTime"
            }, {
                "title": "Pub",
                "field": "source",
                "template": "  <img src='#: sourceLogo  #' alt='#: source  #' />"
            }, {
                "title": "Action",
                "field": "action",
                attributes: {
                    "style": "text-align: left"
                },
                "template": "#: action  #"
            }, {
                "title": "From",
                "field": "from",
                attributes: {
                    "style": "text-align: left"
                },
                "template": "#: from  #"
            }, {
                "title": "To",
                "field": "to",
                attributes: {
                    "style": "text-align: left"
                },
                "template": "#: to  #"
            }, {
                "title": "Firm",
                "field": "firm",
                attributes: {
                    "style": "text-align: left"
                },
                "template": "#: firm  #"
            }, {
                "title": "Direction",
                "field": "direction",
                attributes: {
                    "style": "text-align: left"
                },
                "template": "#: direction  #"
            }],
            dataBound: function () {
                if ($scope.isExpand) {
                    this.expandRow(this.tbody.find("tr.k-master-row"));
                } else {
                    this.collapseRow(this.tbody.find("tr.k-master-row"));
                }
                var grid = $("#analystActionGrid").data("kendoGrid");
                $(grid.tbody).on("click", "td", function (e) {
                    if (grid) {
                        changeHandler(this, grid);
                    } else {
                        console.log("Grid not found");
                    }
                });
                $("#analystActionGrid tr.k-alt").removeClass("k-alt");
            },
            groupable: false,
            pageable: true,
            sortable: true,
            resizable: true
        };

        function changeFilter(filter, value) {
            $scope.options.data.skip = 0;
            $scope.filter = filterPanelFactory.readFilters($scope.filter, filter, value);
            $cookies.putObject("aa_filter", $scope.filter);
            $scope.gridDataSource.transport.read($scope.options);
            $scope.options.data.page = 1;
        }

        function changeHandler(self, grid) {
            var row = $(self).closest("tr"),
                data = grid.dataItem($(self).closest("tr").prev()),
                colIdx = $("td", row).index(self);
            if (colIdx === 1) {
                $window.open('#/portal/stock?symbol=' + data.symbol);
            }
        }
    }
})();
///#source 1 1 /Scripts/app/analystActions/analystActions.service.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .service('analystActionsService', analystActionsService);
    analystActionsService.$inject = ['$q', 'httpService'];

    function analystActionsService($q, httpService) {
        var self = this;
        self.getAnalystActionsTableData = getAnalystActionsTableData;
        self.getAnalystActionInfo = getAnalystActionInfo;
        self.getHistoricPerformanceInfo = getHistoricPerformanceInfo;

        function getAnalystActionsTableData(take, skip, sortDescription,filter, startDate, endDate, action) {
            var analystActionsTableOptions = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                filter: filter,
                startDate: startDate,
                endDate: endDate,
                action: action,
                startDateUTC: dateToUtc(startDate)
            };
            return httpService.post('api/analystActionApi/getAnalystActionsTableData', analystActionsTableOptions);
        }

        function getAnalystActionInfo(isUpdate, stratDate, endDate) {
            return httpService.get('api/analystActionApi/getAnalystActionInfo', {
                isUpgrade: isUpdate,
                startDateUTC: dateToUtc(stratDate),
                endDate: endDate
            });
        }

        function getHistoricPerformanceInfo(isUpdate, stratDate, endDate) {
            return httpService.get('api/analystActionApi/getHistoricPerformanceInfo', {
                isUpgrade: isUpdate,
                startDate: stratDate,
                endDate: endDate
            });
        }

        function dateToUtc(newDate) {
            //newDate - in Ney York time
            var ticksFrom = newDate.getTime() - (new Date()).getTimezoneOffset() * 60000;
            return ticksFrom;
        }
    }
})();
///#source 1 1 /Scripts/app/analystActionsReturn/analystActionsReturn.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('AnalystActionsReturnController', AnalystActionsReturnController);
    AnalystActionsReturnController.$inject = [
        '$scope', 'analystActionsReturnService', 'utils', 'authService', '$cookies', '$routeParams', '$window', 'device'
    ];

    function AnalystActionsReturnController($scope, analystActionsReturnService, utils, authService, $cookies, $routeParams, $window, device) {
        $scope.action = null;
        $scope.init = init;
        $scope.isHaveAccess = false;
        $scope.options = undefined;
        $scope.filter = "Market cap";
        $scope.update = update;
        $scope.pageSize = 25;
        $scope.pageSizeFuntion = pageSizeFuntion;
        $scope.upgradesDowngradesFuntion = upgradesDowngradesFuntion;
        $scope.show = false;
        $scope.upgrades = false;
        $scope.downgrades = false;
        $scope.minNews = null;

        var filterDataSource = [
             {
                 filterTextField: "Summary",
                 filterValueField: "Summary"
             },
            {
                filterTextField: "Firm",
                filterValueField: "Firm"
            }, {
                filterTextField: "Stocks",
                filterValueField: "Stocks"
            },
            {
                filterTextField: "Market cap",
                filterValueField: "Market cap"
            }
        ];

        $scope.filterOptions = {
            dataSource: filterDataSource,
            dataTextField: "filterTextField",
            dataValueField: "filterValueField"
        };


        var pageSizeDataSource = [
           {
               pageTextField: "All",
               pageValueField: "100000"
           },
           {
               pageTextField: "1000",
               pageValueField: "1000"
           }, {
               pageTextField: "100",
               pageValueField: "100"
           },
           {
               pageTextField: "25",
               pageValueField: "25"
           },
           {
               pageTextField: "10",
               pageValueField: "10"
           },
            {
                pageTextField: "5",
                pageValueField: "5"
            }
        ];

        $scope.pageSizeOptions = {
            dataSource: pageSizeDataSource,
            dataTextField: "pageTextField",
            dataValueField: "pageValueField"
        };


        var minNewsDataSource = [
           {
               pageTextField: "All",
               pageValueField: null
           },
           {
               pageTextField: ">=1000",
               pageValueField: "1000"
           }, {
               pageTextField: ">=100",
               pageValueField: "100"
           },
           {
               pageTextField: ">=25",
               pageValueField: "25"
           },
           {
               pageTextField: ">=10",
               pageValueField: "10"
           },
            {
                pageTextField: ">=5",
                pageValueField: "5"
            }
        ];

        $scope.minNewsOptions = {
            dataSource: minNewsDataSource,
            dataTextField: "pageTextField",
            dataValueField: "pageValueField"
        };


        function pageSizeFuntion() {
            $('#analystActionReturnGrid').data("kendoGrid").dataSource.pageSize($scope.pageSize);
            $('#analystActionReturnGrid').data("kendoGrid").refresh();
        }
        function upgradesDowngradesFuntion() {
            if ($scope.upgrades === true && $scope.downgrades === false) {
                $scope.action = "Upgrades";
            } else if ($scope.upgrades === false && $scope.downgrades === true) {
                $scope.action = "Downgrades";
            } else if ($scope.upgrades === false && $scope.downgrades === false || $scope.upgrades === true && $scope.downgrades === true) {
                $scope.action = null;
            }
            $scope.upgrades === true ? $scope.lowOpacityLong = { "opacity": 1 } : $scope.lowOpacityLong = null;
            $scope.downgrades === true ? $scope.lowOpacityShort = { "opacity": 1 } : $scope.lowOpacityShort = null;
            update();
        }

        function update() {
            $('#analystActionReturnGrid').data("kendoGrid").dataSource.query({
                page: 1,
                pageSize: $scope.pageSize
            });
            $scope.gridDataSource.transport.read($scope.options);
            if ($scope.filter === "Stocks" || $scope.filter === "Firm") {
                $scope.show = true;
            } else {
                $scope.show = false;
            }
           
                     
        }
        
        var defaultField = undefined,
          defaultDir = undefined,
          isActive = false;

        function activate() {
            if (device.getDeviceType().any() === null) {
                $scope.isMobile = false;
            } else {
                $scope.isMobile = true;
            }


            var sortField = $cookies.getObject("aar_sorting");
            if (sortField && sortField.length > 0) {
                defaultField = sortField[0].field;
                defaultDir = sortField[0].dir;
            }
        }

        activate();

       

        

        function init() {
            if (!authService || !authService.authentication || !authService.authentication.isAuth || authService.authentication.isAaVisible === "False") {
                return;
            }
            
            $scope.isHaveAccess = true;

            

            
            $scope.gridDataSource = {
                transport: {
                    read: function (options) {
                        if (!isActive) {
                            var cSort = $cookies.getObject("aar_sorting");
                            if (cSort) options.data.sort = cSort;
                        }
                        $scope.options = options;
                        analystActionsReturnService.getAnalystActionsReturnTableData(options.data.take, options.data.skip, options.data.sort, $scope.action, $scope.filter, $scope.minNews)
                            .then(function (data) {
                                if (data) {
                                    if (data.total > 0) $scope.gridIsVisible = true;
                                    $scope.responseTime = utils.kendoDateFormat(data.responseTime);
                                    options.success(data);
                                } else {
                                    $scope.gridIsVisible = false;
                                }
                                $cookies.putObject("aar_sorting", options.data.sort);
                                isActive = true;
                            });
                    }
                },
                pageSize: $scope.pageSize,
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
                            symbolOrFirm: {
                                type: "string"
                            },
                            description: {
                                type: "string"
                            },
                            newsItems: {
                                type: "number"
                            },
                            newsItemsTwelveMo: {
                                type: "number"
                            },
                            resultPct: {
                                type: "number"
                            },
                            twoDay: {
                                type: "number"
                            },
                            threeDay: {
                                type: "number"
                            },
                            fourDay: {
                                type: "number"
                            },
                            fiveDay: {
                                type: "number"
                            },
                            oneMonth: {
                                type: "number"
                            },
                            threeMonth: {
                                type: "number"
                            },
                            sixMonth: {
                                type: "number"
                            },
                            twelveMonth: {
                                type: "number"
                            }
                        }
                    }
                }
            };

            
        }
       

       

       
    }
})();
///#source 1 1 /Scripts/app/analystActionsReturn/analystActionsReturn.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('analystActionsReturnService', analystActionsReturnService);

    analystActionsReturnService.$inject = ['$q', 'httpService'];

    function analystActionsReturnService($q, httpService) {
        var self = this;
        self.getAnalystActionsReturnTableData = getAnalystActionsReturnTableData;

        function getAnalystActionsReturnTableData(take, skip, sortDescription, action, filter, minNews) {
            var analystActionsReturnTableOptions = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                action: action,
                filter: filter,
                minNews: minNews
            };
            return httpService.post('api/analystActionApi/getAnalystActionsReturn', analystActionsReturnTableOptions);
        }

  }

})();
///#source 1 1 /Scripts/app/analystActionsReturn/analystActionsReturnTableTemplate/aaRgridTempalte.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('aaRGridTempalteController', aaRGridTempalteController);
    aaRGridTempalteController.$inject = [
        '$scope'
    ];

    var oldValue;

    function aaRGridTempalteController($scope) {
        function activate() {
            $scope.gridOptions = {
                columns: [{
                    "title": "Symbol",
                    "field": "symbolOrFirm",
                    "width": 60,
                    "headerAttributes": {
                        "style": "text-align: left; padding-left: 28px"
                    },
                    "headerTemplate": '<a class="k-link" style="text-align: left" href="#">Symbol</a>',
                    "attributes": {
                        "style": "text-align: left; padding-left: 28px"
                    },
                    hidden: true
                },
                    {
                    "title": "Description",
                    "field": "description",
                    "width": 130,
                    "headerAttributes": {
                        "style": "text-align: left; padding-left: 28px"
                    },
                    "headerTemplate": '<a class="k-link" style="text-align: left" href="#">Description</a>',
                    "attributes": {
                        "style": "text-align: left; padding-left: 28px"
                    }
                }, {
                    "title": "# All",
                    "field": "newsItems",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    }
                }, {
                    "title": "# 1Y",
                    "field": "newsItemsTwelveMo",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    }
                }, {
                    "title": "1d",
                    "field": "resultPct",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (resultPct == null) ? "" : kendo.format("{0:p}", resultPct) #'
                }, {
                    "title": "2d",
                    "field": "twoDay",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (twoDay == null) ? "" : kendo.format("{0:p}", twoDay)#'
                }, {
                    "title": "3d",
                    "field": "threeDay",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (threeDay == null) ? "" : kendo.format("{0:p}", threeDay)#'
                }, {
                    "title": "4d",
                    "field": "fourDay",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (fourDay == null) ? "" : kendo.format("{0:p}", fourDay)#'
                }, {
                    "title": "5d",
                    "field": "fiveDay",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (fiveDay == null) ? "" : kendo.format("{0:p}", fiveDay)#'
                }, {
                    "title": "1m",
                    "field": "oneMonth",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (oneMonth == null) ? "" : kendo.format("{0:p}", oneMonth)#'
                },
                {
                    "title": "3m",
                    "field": "threeMonth",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (threeMonth == null) ? "" : kendo.format("{0:p}", threeMonth)#'
                },
                {
                    "title": "6m",
                    "field": "sixMonth",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (sixMonth == null) ? "" : kendo.format("{0:p}", sixMonth)#'
                    
                },
                {
                    "title": "12m",
                    "field": "twelveMonth",
                    "width": 80,
                    "headerAttributes": {
                        "style": "padding-right: 28px;"
                    },
                    "attributes": {
                        "style": "text-align: right; padding-right: 28px;"
                    },
                    "template": '#= (twelveMonth == null) ? "" : kendo.format("{0:p}", twelveMonth)#'
                }
                ],
                dataBound: function (e) {
                    this.hideColumn("symbolOrFirm");
                    if ($scope.$parent.filter === "Stocks") {
                        this.showColumn("symbolOrFirm");
                    }
                },
                groupable: false,
                pageable: true,
                sortable: true,
                resizable: true,
                 sort: {
                    field: $scope.$parent.defaultField,
                    dir: $scope.$parent.defaultDir
                 },
            };
        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/analystActionsReturn/analystActionsReturnTableTemplate/aaRmobileGridTemplate.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('aaRMobileGridTemplateController', aaRMobileGridTemplateController);
    aaRMobileGridTemplateController.$inject = [
        '$scope', 'device'
    ];

    function aaRMobileGridTemplateController($scope, device) {
        function activate() {
            var columsMobile = [{
                    "title": "Symbol",
                    "field": "symbolOrFirm",
                    "width": 60,
                    "headerAttributes": {
                        "style": "text-align: left;"
                    },
                    "headerTemplate": '<a class="k-link" style="text-align: left" href="#">Symbol</a>',
                    "attributes": {
                        "style": "text-align: left;"
                    },
                    hidden: true
                }, {
                "title": "Description",
                "field": "description",
                "width": 180,
                "headerAttributes": {
                   "style": "text-align: left; padding-left: 28px"
                },
                "headerTemplate": '<a class="k-link" style="text-align: left" href="#">Description</a>',
                "attributes": {
                    "style": "text-align: left; padding-left: 28px"
                }
            }, {
                "title": "# All",
                "field": "newsItems",
                "width": 68,
                "attributes": {
                    "style": "text-align: right"
                }
            }, {
                "title": "# 1Y",
                "field": "newsItemsTwelveMo",
                "width": 68,
                "attributes": {
                    "style": "text-align: right"
                }
            }]
            if (device.getDeviceType().any() !== null && device.getDeviceType().any()[0] === "iPad") {
                columsMobile.push({
                    "title": "1d",
                    "field": "resultPct",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (resultPct == null) ? "" : kendo.format("{0:p}", resultPct) #'
                });
                columsMobile.push({
                    "title": "2d",
                    "field": "twoDay",
                    "width": 68,
                    "attributes": {
                        "style": "text-align: right"
                    },
                    "template": '#= (twoDay == null) ? "" : kendo.format("{0:p}", twoDay)#'
                });
            }


            $scope.gridOptions = {
                columns: columsMobile,
                detailTemplate: kendo.template($("#templateMobile").html()),
                groupable: false,
                pageable: true,
                sortable: true,
                resizable: true,
                 sort: {
                    field: $scope.$parent.defaultField,
                    dir: $scope.$parent.defaultDir
                 },
                 dataBound: function (e) {
                     this.hideColumn("symbolOrFirm");
                     if ($scope.$parent.filter === "Stocks") {
                         this.showColumn("symbolOrFirm");
                     }
                 }
            };

        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/database/historicnews/historicnews.controller.js
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
///#source 1 1 /Scripts/app/database/historicnews/historicnews.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('historicNewsService', historicNewsService);

    historicNewsService.$inject = ['$q', 'httpService'];

    function historicNewsService($q, httpService) {
        var self = this;
        self.geTableData = geTableData;

        function geTableData(take, skip, symbol, filter, sortDescription, startDate, endDate) {
            var historicNewsTableOptions = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                filter: filter,
                startDate: startDate,
                endDate: endDate

            };
            return httpService.post('api/topNewsApi/getHistoricNewsTableData', historicNewsTableOptions);
        }
   }
})();
///#source 1 1 /Scripts/app/database/historicnews/tableTemplate/gridTempalte.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('GridTempalteController', GridTempalteController);
    GridTempalteController.$inject = [
        '$scope'
    ];

    function GridTempalteController($scope) {
        function activate() {
            $scope.gridOptions = {
                columns: [{
                    "title": "Symbol",
                    "field": "stock",
                    "width": 85,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                }, {
                    "title": "DateTime",
                    "field": "time",
                    "width": 100,
                    "template": "${ date } ${ time }",
                    headerAttributes: {
                        "class": "row_date"
                    },
                    attributes: {
                        "class": "row_date"
                    }
                }, {
                    "title": "Pub",
                    "field": "id",
                    "width": 46,
                    "template": "<img src='${ logo }' alt='${ id }' title='${ provider }'>",
                    headerAttributes: {
                        "class": "row_provider"
                    },
                    attributes: {
                        "class": "row_provider"
                    }
                }, {
                    "title": "Headline",
                    "field": "headLine",
                    "width": 330,
                    "template": "#= headLine  #",
                    headerAttributes: {
                        "class": "row_headline"
                    },
                    attributes: {
                        "class": "row_headline"
                    }
                }, {
                    "title": "@News",
                    "field": "priceNews",
                    "width": 60,
                    "template": "${ priceNewsStr }",
                    headerAttributes: {
                        "class": "row_price"
                    },
                    attributes: {
                        "class": "row_price",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Chg",
                    "field": "changePerc",
                    "width": 49,
                    "template": "#= (changePerc == null) ? ' ' : kendo.toString(changePerc, 'n2') + '%' #",
                    headerAttributes: {
                        "class": "row_bid"
                    },
                    attributes: {
                        "class": "row_bid",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Last",
                    "field": "price",
                    "width": 50,
                    "template": "${ priceStr }",
                    headerAttributes: {
                        "class": "row_ask"
                    },
                    attributes: {
                        "class": "row_ask",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Volume",
                    "field": "volume",
                    "width": 80,
                    "template": "${ volume }",
                    headerAttributes: {
                        "class": "row_volume"
                    },
                    attributes: {
                        "class": "row_volume",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Vol Ratio",
                    "field": "volumeRatio",
                    "width": 90,
                    "template": "<div>#= (volumeRatio == null) ? ' ' : kendo.toString(volumeRatio, 'n2') #<div class='${ scale }'></div></div>",
                    headerAttributes: {
                        "class": "row_volumeratio"
                    },
                    attributes: {
                        "class": "row_volumeratio"
                    }
                }],
                groupable: false,
                pageable: {            
                messages: {
                  display: "{0} - {1} of {2:#,##} items"
                }
              },
                sortable: true,
                resizable: true,
                sort: {
                    field: $scope.$parent.defaultField,
                    dir: $scope.$parent.defaultDir
                },
                dataBound: function (e) {
                    var grid = $("#gridTopNews").data("kendoGrid");
                    $(grid.tbody).on("click", "td", function (e) {
                        if (grid) {
                            $scope.$parent.changeHandler(this, grid);
                        } else {
                            console.log("Grid not found");
                        }
                    });
                }
            }
        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/database/historicnews/tableTemplate/mobileGridTemplate.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('MobileGridTemplateController', MobileGridTemplateController);
    MobileGridTemplateController.$inject = [
        '$scope', 'device'
    ];

    function MobileGridTemplateController($scope, device) {

        $scope.$parent.gridDataSource.pageSize = 20;
        $scope.isIpad = device.getDeviceType().any()[0] === "iPad";
        angular.element(".stock-info-row").css({ "margin-left": "5px", "margin-right": "5px" });

        function activate() {
            if (!$scope.isIpad) {
                var colums1Tab = [{

                    "title": "Symbol",
                    "field": "stock",
                    "width": 80,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                },
               {
                   "title": "Pub",
                   "field": "id",
                   "width": 40,
                   "template": "<img src='${ logo }' alt='${ id }' title='${ provider }'>",
                   headerAttributes: {
                       "class": "row_provider"
                   },
                   attributes: {
                       "class": "row_provider"
                   }
               },
               {
                   "title": "Headline",
                   "field": "headLine",
                   "template": "#= headLine  #",
                   headerAttributes: {
                       "class": "row_headline"
                   },
                   attributes: {
                       "class": "row_headline"
                   }
               }
                ];

                var colums2Tab = [{
                    "title": "Symbol",
                    "field": "stock",
                    "width": 75,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                },
                {
                    "title": "@News",
                    "field": "priceNews",
                    "width": 50,
                    "template": "${ priceNewsStr }",
                    headerAttributes: {
                        "class": "row_price",
                    },
                    attributes: {
                        "class": "row_price",
                        style: "text-align: right"
                    }
                },
                {
                    "title": "DateTime",
                    "field": "time",
                    "width": 110,
                    "template": "${ date } ${ time }",
                    headerAttributes: {
                        "class": "row_date"
                    },
                    attributes: {
                        "class": "row_date"
                    },
                },
                {
                    "title": "Volume",
                    "field": "volume",
                    "width": 67,
                    "template": "${ volume }",
                    headerAttributes: {
                        "class": "row_volume",
                    },
                    attributes: {
                        "class": "row_volume",
                        style: "text-align: right"
                    }
                }
                ];

                var colums3Tab = [{

                    "title": "Symbol",
                    "field": "stock",
                    "width": 80,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                },
                {
                    "title": "Chg",
                    "field": "changePerc",
                    "template": "#= (changePerc == null) ? ' ' : kendo.toString(changePerc, 'n2') + '%' #",
                    headerAttributes: {
                        "class": "row_bid",
                    },
                    attributes: {
                        "class": "row_bid",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Last",
                    "field": "price",
                    "template": "${ priceStr }",
                    headerAttributes: {
                        "class": "row_ask",
                    },
                    attributes: {
                        "class": "row_ask",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Vol Ratio",
                    "field": "volumeRatio",
                    "template": "<div>#= (volumeRatio == null) ? ' ' : kendo.toString(volumeRatio, 'n2') #<div class='${ scale }'></div></div>",
                    headerAttributes: {
                        "class": "row_volumeratio"
                    },
                    attributes: {
                        "class": "row_volumeratio"
                    }
                }];

                $scope.$parent.gridDataSource.change = function () {
                    $('#grid2Tab').data("kendoGrid").dataSource.data(this.data());
                    $('#grid3Tab').data("kendoGrid").dataSource.data(this.data());
                }


                $scope.gridOptions1Tab = {
                    columns: colums1Tab,
                    groupable: false,
                    pageable: {
                        messages: {
                            display: "{0} - {1} of {2:#,##} items"
                        }
                    },
                    sortable: true,
                    resizable: true,
                    sort: {
                        field: $scope.$parent.defaultField,
                        dir: $scope.$parent.defaultDir
                    },
                    dataBound: function (e) {
                        var grid = this;
                        $(grid.tbody).on("click", "td", function (e) {
                            if (grid) {
                                $scope.$parent.changeHandler(this, grid);
                            } else {
                                console.log("Grid not found");
                            }
                        });
                    }
                }

                $scope.gridOptions2Tab = {
                    columns: colums2Tab,
                    groupable: false,
                    resizable: true,
                    dataBound: function (e) {
                        var grid = this;
                        $(grid.tbody).on("click", "td", function (e) {
                            if (grid) {
                                $scope.$parent.changeHandler(this, grid);
                            } else {
                                console.log("Grid not found");
                            }
                        });
                    }
                }

                $scope.gridOptions3Tab = {
                    columns: colums3Tab,
                    groupable: false,
                    resizable: true,
                    dataBound: function (e) {
                        var grid = this;
                        $(grid.tbody).on("click", "td", function (e) {
                            if (grid) {
                                $scope.$parent.changeHandler(this, grid);
                            } else {
                                console.log("Grid not found");
                            }
                        });
                    }
                }

            } else {
                $scope.iPadGridOptions = {
                    columns: [
                        {
                            "title": "Symbol",
                            "field": "stock",
                            "width": 85,
                            "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                            headerAttributes: {
                                "class": "row_stock"
                            },
                            attributes: {
                                "class": "row_stock"
                            }
                        }, {
                            "title": "DateTime",
                            "field": "time",
                            "width": 100,
                            "template": "${ date } ${ time }",
                            headerAttributes: {
                                "class": "row_date"
                            },
                            attributes: {
                                "class": "row_date"
                            }
                        }, {
                            "title": "Pub",
                            "field": "id",
                            "width": 46,
                            "template": "<img src='${ logo }' alt='${ id }' title='${ provider }'>",
                            headerAttributes: {
                                "class": "row_provider"
                            },
                            attributes: {
                                "class": "row_provider"
                            }
                        }, {
                            "title": "Headline",
                            "field": "headLine",
                            "width": 330,
                            "template": "#= headLine  #",
                            headerAttributes: {
                                "class": "row_headline"
                            },
                            attributes: {
                                "class": "row_headline"
                            }
                        }, {
                            "title": "@News",
                            "field": "priceNews",
                            "width": 60,
                            "template": "${ priceNewsStr }",
                            headerAttributes: {
                                "class": "row_price",
                            },
                             attributes: {
                                 "style": "text-align: right"
                            }
                        }
                    ],
                    detailTemplate: kendo.template($("#templateMobile").html()),
                    groupable: false,
                    pageable: {
                        messages: {
                            display: "{0} - {1} of {2:#,##} items"
                        }
                    },
                    sortable: true,
                    resizable: true,
                    sort: {
                        field: $scope.$parent.defaultField,
                        dir: $scope.$parent.defaultDir
                    },
                    dataBound: function (e) {
                        var grid = this;
                        $(grid.tbody).on("click", "td", function (e) {
                            if (grid) {
                                $scope.$parent.changeHandler(this, grid);
                            } else {
                                console.log("Grid not found");
                            }
                        });
                    }
                }
            }

        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/earnings/earnings.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('EarningsController', EarningsController);

    EarningsController.$inject = [
        '$scope', 'earningsService', '$q', 'utils', 'filterPanelFactory', '$cookies', 'device'
    ];

    function EarningsController($scope, earningsService, $q, utils, filterPanelFactory, $cookies, device) {
        $scope.activate = activate;
        $scope.changeFilter = changeFilter;
        $scope.filter = {
            "calendarDate": [],
            "todValue": [],
            "symbol": [],
            "type": []
        };

        var isActive = false,
            optionsData = null,
            searchOptions = {
                type : 'day',
                search: '',
                date : new Date(),
                todValue : []
            };

        
        function activate() {
           var cFilter = $cookies.getObject("ep_filter");
           if (cFilter) $scope.filter = cFilter;
           recalculateFilter();

           if (device.getDeviceType().any() === null) {
               $scope.isMobile = false;
           } else {
               $scope.isMobile = true;
           }
            
           $scope.gridDataSource = {
                transport: {
                    read: function (options) {
                        if (!isActive) {
                            var cSort = $cookies.getObject("ep_sorting");
                            if (cSort) options.data.sort = cSort;
                        }
                        optionsData = options;
                        earningsService.getEarningsTableData(options.data.take, options.data.skip, options.data.sort, searchOptions.date, searchOptions.type, searchOptions.search, searchOptions.todValue)
                            .then(function (data) {
                                if (data) {
                                    if (data.total > 0) $scope.gridIsVisible = true;
                                    options.success(data);
                                } else {
                                    $scope.gridIsVisible = false;
                                }
                                $cookies.putObject("ep_sorting", options.data.sort);
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
                            name: {
                                type: "string"
                            },
                            symbol: {
                                type: "string"
                            },
                            earningsQuarter: {
                                type: "string"
                            },
                            earningsDate: {
                                type: "string"
                            },
                            tod: {
                                type: "string"
                            },
                            estAvg: {
                                type: "number"
                            },
                            estAvgQ1: {
                                type: "number"
                            },
                            estAvgQ0: {
                                type: "number"
                            },
                            eaEps: {
                                type: "number"
                            },
                            estVsAct: {
                                type: "string"
                            },
                            ccdTm: {
                                type: "string"
                            }
                        }
                    }
                }
            };
        }

       $scope.gridOptions = {
            columns: [{
                "title": "Company",
                "field": "name",
                "template": "<div style='text-align: left;padding-left: 15px;'>#: name  #</div>"
            }, {
                "title": "Symbol",
                "field": "symbol",
                "template": "<div style='text-align: center;'>#: symbol  #</div>"
            }, {
                "title": "Quarter",
                "field": "earningsQuarter",
                "template": "<div style='text-align: center;'>#: earningsQuarter  #</div>"
            }, {
                "title": "Date",
                "field": "earningsDate",
                "template": "<div style='text-align: center;'>#: earningsDate  #</div>"
            }, {
                "title": "Time of Day",
                "field": "tod",
                "template": "<div style='text-align: center;'>#: tod  #</div>"
            }, {
                "title": "Zack’s EPS est.",
                "field": "estAvgQ1",
                "template": "<div style='text-align: center;'>#: estAvgQ1  #</div>"
            }, {
                "title": "Actual EPS",
                "field": "eaEps",
                "template": "<div style='text-align: center;'>#: eaEps  #</div>"
            }, {
                "title": "EstVsAct",
                "field": "estVsAct",
                "template": "<div style='text-align: center;'>#: estVsAct  #</div>"
            }, {
                "title": "Conference Call",
                "field": "ccdTm",
                "template": "<div style='text-align: center;'>#: ccdTm  #</div>"
            }],
            groupable: false,
            pageable: true,
            sortable: true,
            resizable: true
        };

       function reloadPaging() {
           var grid = $("#gridTopNews").data("kendoGrid");
           grid.dataSource.page(1);
       }

       function changeFilter(filter, value) {
           $scope.filter = filterPanelFactory.readEarningsFilters($scope.filter, filter, value);
           $cookies.putObject("ep_filter", $scope.filter);
           recalculateFilter();
           reloadPaging();
       }

        function recalculateFilter() {

            if ($scope.filter.type && $scope.filter.type.length > 0) {
                searchOptions.type = $scope.filter.type[0];
            }
            if ($scope.filter.symbol && $scope.filter.symbol.length > 0) {
                searchOptions.search = $scope.filter.symbol[0];
            }
            if ($scope.filter.calendarDate && $scope.filter.calendarDate.length > 0) {
                searchOptions.date = $scope.filter.calendarDate[0];
            }
            if ($scope.filter.todValue) {
                searchOptions.todValue = [];
                angular.forEach($scope.filter.todValue, function (value) {
                    if (value === "AFTER_M") {
                        searchOptions.todValue.push({
                            field: 'todValue',
                            value: 'AFTER_M'
                        });
                    }
                    if (value === "BEFORE_M") {
                        searchOptions.todValue.push({
                            field: 'todValue',
                            value: 'BEFORE_M'
                        });
                    }
                    if (value === "DURING_M") {
                        searchOptions.todValue.push({
                            field: 'todValue',
                            value: 'DURING_M'
                        });
                    }
                });
            }
        }

        activate();
    }
})();
///#source 1 1 /Scripts/app/earnings/earnings.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('earningsService', earningsService);

    earningsService.$inject = ['$q', 'httpService'];

    function earningsService($q, httpService) {
        var self = this;
        self.getEarningsTableData = getEarningsTableData;
        

        function getEarningsTableData(take, skip, sortDescription, date, tab, search, filter) {
            var earningsOptions = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                date: date,
                tab: tab,
                search: search,
                filter: filter
            };
            return httpService.post('api/earningsApi/getEarningsTableData', earningsOptions);
        }

  }

})();
///#source 1 1 /Scripts/app/earnings/earningsTableTamplate/earningsGridTempalte.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('EarningsGridTempalteController', EarningsGridTempalteController);
    EarningsGridTempalteController.$inject = [
        '$scope'
    ];

    function EarningsGridTempalteController($scope) {
        function activate() {
            $scope.gridOptions = {
                columns: [{
                    "title": "Company",
                    "field": "name",
                    "width": 220,
                    "template": "<div style='text-align: left;padding-left: 15px;'>#= (name == null) ? ' ' : name  #</div>"
                }, {
                    "title": "Symbol",
                    "field": "symbol",
                    "width": 60,
                    "template": "<div style='text-align: center;'>#= (symbol == null) ? ' ' : symbol  #</div>"
                }, {
                    "title": "Quarter",
                    "field": "earningsQuarter",
                    "width": 60,
                    "template": "<div style='text-align: center;'>#= (earningsQuarter == null) ? ' ' : earningsQuarter  #</div>"
                }, {
                    "title": "Date",
                    "field": "earningsDate",
                    "width": 90,
                    "template": "<div style='text-align: center;'>#= (earningsDate == null) ? ' ' : earningsDate  #</div>"
                }, {
                    "title": "Time of Day",
                    "field": "tod",
                    "width": 90,
                    "template": "<div style='text-align: center;'>#= (tod == null) ? ' ' : tod  #</div>"
                }, {
                    "title": "Zack’s EPS est.",
                    "field": "estAvgQ1",
                    "width": 80,
                    "template": "<div style='text-align: center;'>#= (estAvgQ1 == null) ? ' ' : kendo.toString(estAvgQ1, '0.00')  #</div>"
                }, {
                    "title": "Actual EPS",
                    "field": "eaEps",
                    "width": 60,
                    "template": "<div style='text-align: center;'>#= (eaEps == null) ? 'N/A ' : kendo.toString(eaEps, '0.00')  #</div>"
                }, {
                    "title": "EstVsAct",
                    "field": "estVsAct",
                    "width": 60,
                    "template": "<div style='text-align: center;'>#= (estVsAct == null) ? 'N/A ' : kendo.toString(estVsAct, '0.00')  #</div>"
                }, {
                    "title": "Conference Call",
                    "field": "ccdTm",
                    "width": 90,
                    "template": "<div style='text-align: center;'><a #=(broadcast == null) ? 'style=\"no-link\"' : 'class=\"link\" href=\"\' + broadcast + \'\" target=\"_blank\" ontouchend=\"this.click();return false;\"' #>#: ccdTm #</a></div>"
                }],
                groupable: false,
                pageable: true,
                sortable: true,
                resizable: true
            };
        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/earnings/earningsTableTamplate/earningsMobilegridTemplate.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('EarningsMobilegridTemplateController', EarningsMobilegridTemplateController);
    EarningsMobilegridTemplateController.$inject = [
        '$scope', 'device'
    ];

    function EarningsMobilegridTemplateController($scope, device) {
        function activate() {

            var columsMobile = [{
                "title": "Company",
                "field": "name",
                "width": 220,
                "template": "<div style='text-align: left;padding-left: 15px;'>#: name  #</div>"
            }, {
                "title": "Symbol",
                "field": "symbol",
                "width": 60,
                "template": "<div style='text-align: center;'>#: symbol  #</div>"
            }, {
                "title": "Quarter",
                "field": "earningsQuarter",
                "width": 60,
                "template": "<div style='text-align: center;'>#= (earningsQuarter == null) ? ' ' : earningsQuarter  #</div>"
            }]

            if (device.getDeviceType().any() !== null && device.getDeviceType().any()[0] === "iPad") {
               
                columsMobile.push({
                    "title": "Date",
                    "field": "earningsDate",
                    "template": "<div style='text-align: center;'>#: earningsDate  #</div>"
                });
                columsMobile.push({
                    "title": "Time of Day",
                    "field": "tod",
                    "template": "<div style='text-align: center;'>#: tod  #</div>"
                });
            }


            $scope.gridOptions = {
                columns: columsMobile,
                detailTemplate: kendo.template($("#templateMobile").html()),
                groupable: false,
                pageable: true,
                sortable: false,
                resizable: true,
            };
            
        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/login/loginAutocompleate/loginAutocompleate.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('LoginAutoCompleateController', LoginAutoCompleateController);

    LoginAutoCompleateController.$inject = [
        '$scope', 'loginAutoCompleateService', 'authService', '$routeParams', '$window'
    ];

    function LoginAutoCompleateController($scope, loginAutoCompleateService, authService, $routeParams, $window) {
        $scope.init = init;
        function init() {
            if ($routeParams.externalAccessToken) {
                var token = $routeParams.externalAccessToken;
                authService.writeAuthToken(token);
                loginAutoCompleateService.getUserInformation()
                    .then(function(data) {
                        authService.writeUserInfo(data.dictionary);
                        $window.location.href = '#/portal/topnews';
                        $window.location.reload();
                });
            } else {
                $window.location.href = '#/portal/topnews';
            }
            
        }
    }
})();
///#source 1 1 /Scripts/app/login/loginAutocompleate/loginAutocompleate.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('loginAutoCompleateService', loginAutoCompleateService);

    loginAutoCompleateService.$inject = ['$q', 'httpService'];

    function loginAutoCompleateService($q, httpService) {
        var self = this;
        self.getUserInformation = getUserInformation;

        function getUserInformation() {
            return httpService.get('api/accountApi/userInfo');
        }
  }

})();
///#source 1 1 /Scripts/app/login/emailConfermByGuid/emailConfermByGuid.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('EmailConfermByGuidController', EmailConfermByGuidController);

    EmailConfermByGuidController.$inject = [
        '$scope', '$location', '$routeParams', 'emailConfermByGuidService', '$timeout'
    ];

    function EmailConfermByGuidController($scope, $location, $routeParams, emailConfermByGuidService, $timeout) {
        $scope.init = init;
        $scope.validationMessage = "Please wait...";
        function init() {
            var guid = undefined;
            if ($routeParams.guid) {
                guid = $routeParams.guid;
                emailConfermByGuidService.userRegistration(guid)
                    .then(function(data) {
                        $scope.validationMessage = data.message;
                        if (data.succeeded) {
                            $timeout(callAtTimeout, 4000);
                        }
                    });
            } else {
                $location.path('/portal/login');
            } 
        }

        function callAtTimeout() {
            $location.path('/portal/login');
        }
    }
})();
///#source 1 1 /Scripts/app/login/emailConfermByGuid/emailConfermByGuid.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('emailConfermByGuidService', emailConfermByGuidService);

    emailConfermByGuidService.$inject = ['$q', 'httpService'];

    function emailConfermByGuidService($q, httpService) {
        var self = this;
        self.userRegistration = userRegistration;

        function userRegistration(guid) {
            var model = {
                guid : guid
            }
            return httpService.post('api/accountApi/registerByGuid', model);
        }
  }

})();
///#source 1 1 /Scripts/app/login/login.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$scope', 'loginService', '$q', '$routeParams', 'cfpLoadingBar', 'authService', '$location', 'utils'
    ];

    function LoginController($scope, loginService, $q, $routeParams, cfpLoadingBar, authService, $location, utils) {
        
        $scope.auth = auth;

        $scope.loginData = {
            userName: "",
            password: "",
            useRefreshTokens: false
        };

        $scope.validationMessage = "";

        $scope.login = function () {

            authService.login($scope.loginData).then(function (response) {

                $location.path('/portal/topnews');

            },
            function (err) {
                console.log(err);
                $scope.validationMessage = utils.trustAsHtml(err.error_description);
            });
        };

        function auth(provider) {
            var redirectUri = location.protocol + '//' + location.host + '/';
            loginService.getExternalLogins(redirectUri, provider)
            .then(function (data) {
                var externalProviderUrl = data[0].url;
                window.location.href = externalProviderUrl;
            });
        }

        $scope.authExternalProvider = function (provider) {

            var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

            var externalProviderUrl = "api/Account/ExternalLogin?provider=" + provider
                                                                        + "&response_type=token&client_id=" + "ngAuthApp"
                                                                        + "&redirect_uri=" + redirectUri;
            window.$windowScope = $scope;

            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        $scope.authCompletedCB = function (fragment) {

            $scope.$apply(function () {

                if (fragment.haslocalaccount == 'False') {

                    authService.logOut();

                    authService.externalAuthData = {
                        provider: fragment.provider,
                        userName: fragment.external_user_name,
                        externalAccessToken: fragment.external_access_token
                    };

                    $location.path('/associate');

                }
                else {
                    //Obtain access token and redirect to orders
                    var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                    authService.obtainAccessToken(externalData).then(function (response) {

                        $location.path('/portal/topnews');

                    },
                 function (err) {
                     $scope.message = err.error_description;
                 });
                }

            });
        }


        activate();

        function activate() {
          
        }
    }
})();
///#source 1 1 /Scripts/app/login/login.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('loginService', loginService);

    loginService.$inject = ['$q', 'httpService'];

    function loginService($q, httpService) {
        var self = this;
        self.getExternalLogins = getExternalLogins;
        
        function getExternalLogins(redirectUri, provider) {

            return httpService.get('api/accountApi/externalLogins', {
                returnUrl: redirectUri,
                generateState: true,
                createUser: false,
                provider: provider
            });

        }
  }

})();
///#source 1 1 /Scripts/app/login/forgot/forgot.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('ForgotController', ForgotController);

    ForgotController.$inject = [
        '$scope', 'forgotService', '$timeout', '$location'
    ];

    function ForgotController($scope, forgotService, $timeout, $location) {
        $scope.userInfo = {
            email: ""
        };
        $scope.validationMessage = "";
        $scope.validate = function (event) {
            event.preventDefault();

            if ($scope.validator.validate()) {
                forgotService.forgotPassword($scope.userInfo)
                 .then(function (data) {
                     $scope.validationMessage = data.message;
                     $timeout(callAtTimeout, 5000);
                 });
            }
        }

        function callAtTimeout() {
            $location.path('/portal/login');
        }

    }
})();
///#source 1 1 /Scripts/app/login/forgot/forgot.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('forgotService', forgotService);

    forgotService.$inject = ['$q', 'httpService'];

    function forgotService($q, httpService) {
        var self = this;
        self.forgotPassword = forgotPassword;

        function forgotPassword(model) {
            return httpService.post('api/accountApi/forgotpassword',  model  );
        }
  }

})();
///#source 1 1 /Scripts/app/services/services.controller.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .controller('ServicesController', ServicesController);

    ServicesController.$inject = [
        '$scope', 'serviesService', '$q', '$routeParams', 'cfpLoadingBar'
    ];

    function ServicesController($scope, serviesService, $q, $routeParams, cfpLoadingBar) {

        activate();

        function activate() {

        }
    }
})();
///#source 1 1 /Scripts/app/services/services.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('serviesService', serviesService);

    serviesService.$inject = ['$q', 'httpService'];

    function serviesService($q, httpService) {
        var self = this;
        self.getData = getData;

        function getData(data) {

        }
  }

})();
///#source 1 1 /Scripts/app/topnews/topnews.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('TopNewsController', TopNewsController);
    TopNewsController.$inject = [
        '$scope', 'topNewsService', '$q', '$routeParams', 'cfpLoadingBar', '$window', 'utils', 'filterPanelFactory', '$cookies', 'device', '$interval'
    ];

    function TopNewsController($scope, topNewsService, $q, $routeParams, cfpLoadingBar, $window, utils, filterPanelFactory, $cookies, device, $interval) {
        $scope.myName = "TopNews";
        $scope.navigatePanelIsShow = true;
        $scope.navigatePanelCanBeShow = true;
        $scope.newsData = undefined;
        $scope.PriceRangeMin = undefined;
        $scope.PriceRangeMax = undefined;
        $scope.windowsIsVisible = false;
        $scope.windowsTitle = '';
        $scope.init = init;
        $scope.filter = {
            "cap": [],
            "vol": [],
            "perfor": [],
            "volrat": [],
            "id": [],
            "piceMin": [],
            "piceMax": []
        };
        $scope.options = undefined;
        $scope.changeFilter = changeFilter;
        $scope.topNewsWindows;
        $scope.isMobile = null;
        $scope.changeHandler = changeHandler;
        var isActive = false;
        activate();

        function activate() {
            var cFilter = $cookies.getObject("tn_filter");
            if (cFilter) $scope.filter = cFilter;
            if (device.getDeviceType().any() === null) {
                $scope.isMobile = false;
            } else {
                $scope.isMobile = true;
            }

        }

       
        function init() {


            var defaultField = 'pubTime';
            var defaultDir = 'desc';
            var sortField = $cookies.getObject("tn_sorting");
            if (sortField && sortField.length > 0) {
                defaultField = sortField[0].field;
                defaultDir = sortField[0].dir;
            }

           
            $scope.gridDataSource = {
                transport: {
                    read: function (options) {
                        if (!isActive) {
                            var cSort = $cookies.getObject("tn_sorting");
                            if (cSort) options.data.sort = cSort;
                        }
                        $scope.options = options;
                        topNewsService.getStockTableData(options.data.take, options.data.skip, "", $scope.filter, options.data.sort)
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
                                $cookies.putObject("tn_sorting", options.data.sort);
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
            if ($scope.isMobile) {
                
            }
            
        }

        function changeHandler(self, grid) {
            var row = $(self).closest("tr"),
                data = grid.dataItem($(self).closest("tr")),
                colIdx = $("td", row).index(self);
            var contentUrl = "";
           
            if ($scope.isMobile && device.getDeviceType().any()[0] === "iPad") colIdx = colIdx - 1;

            if (colIdx === 0) {
                contentUrl = '#/portal/stock?symbol=' + data.stock;
            } else if (colIdx > 0) {
                contentUrl = '#/reports/mainreport?news=' + data.newsKey;
            }
            if(!(colIdx < 0)){
                $window.open(contentUrl);
            }
            
        }

        function changeFilter(filter, value) {
            $scope.options.data.skip = 0;
            $scope.filter = filterPanelFactory.readFilters($scope.filter, filter, value);
            $cookies.putObject("tn_filter", $scope.filter);
            $scope.gridDataSource.transport.read($scope.options);
            reloadPaging();
        }

        function reloadPaging() {
            var grid = $("#gridTopNews").data("kendoGrid");
            grid.dataSource.page(1);
        }
    }
})();
///#source 1 1 /Scripts/app/topnews/topnews.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('topNewsService', topNewsService);

    topNewsService.$inject = ['$q', 'httpService'];

    function topNewsService($q, httpService) {
        var self = this;
        self.getStockTableData = getStockTableData;

        function getStockTableData(take, skip, symbol, filter, sortDescription) {
            var stockTableOptionsParameters = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                filter: filter
            };
            return httpService.post('api/topNewsApi/getStockTableData', stockTableOptionsParameters);
        }
   }
})();
///#source 1 1 /Scripts/app/topnews/topnewsTableTamplate/topnewsGridTempalte.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('topnewsGridTempalteController', topnewsGridTempalteController);
    topnewsGridTempalteController.$inject = [
        '$scope'
    ];

    function topnewsGridTempalteController($scope) {
        function activate() {

            $scope.gridOptions = {
                columns: [{
                    "title": "Symbol",
                    "field": "stock",
                    "width": 85,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                }, {
                    "title": "DateTime",
                    "field": "time",
                    "width": 100,
                    "template": "${ date } ${ time }",
                    headerAttributes: {
                        "class": "row_date"
                    },
                    attributes: {
                        "class": "row_date"
                    }
                }, {
                    "title": "Pub",
                    "field": "id",
                    "width": 46,
                    "template": "<img src='${ logo }' alt='${ id }' title='${ provider }'>",
                    headerAttributes: {
                        "class": "row_provider"
                    },
                    attributes: {
                        "class": "row_provider"
                    }
                }, {
                    "title": "Headline",
                    "field": "headLine",
                    "width": 330,
                    "template": "#= headLine  #",
                    headerAttributes: {
                        "class": "row_headline"
                    },
                    attributes: {
                        "class": "row_headline"
                    }
                }, {
                    "title": "@News",
                    "field": "priceNews",
                    "width": 60,
                    "template": "${ priceNewsStr }",
                    headerAttributes: {
                        "class": "row_price",
                    },
                    attributes: {
                        "class": "row_price",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Chg",
                    "field": "changePerc",
                    "width": 49,
                    "template": "#= (changePerc == null) ? ' ' : kendo.toString(changePerc, 'n2') + '%' #",
                    headerAttributes: {
                        "class": "row_bid",
                    },
                    attributes: {
                        "class": "row_bid",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Last",
                    "field": "price",
                    "width": 50,
                    "template": "${ priceStr }",
                    headerAttributes: {
                        "class": "row_ask",
                    },
                    attributes: {
                        "class": "row_ask",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Volume",
                    "field": "volume",
                    "width": 80,
                    "template": "${ volume }",
                    headerAttributes: {
                        "class": "row_volume",
                    },
                    attributes: {
                        "class": "row_volume",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Vol Ratio",
                    "field": "volumeRatio",
                    "width": 90,
                    "template": "<div>#= (volumeRatio == null) ? ' ' : kendo.toString(volumeRatio, 'n2') #<div class='${ scale }'></div></div>",
                    headerAttributes: {
                        "class": "row_volumeratio"
                    },
                    attributes: {
                        "class": "row_volumeratio"
                    }
                }],
                groupable: false,
                pageable: {
                    messages: {
                        display: "{0} - {1} of {2:#,##} items"
                    }
                },
                sortable: true,
                resizable: true,
                sort: {
                    field: $scope.$parent.defaultField,
                    dir: $scope.$parent.defaultDir
                },
                dataBound: function (e) {
                    var self = this,
                        grid = $("#gridTopNews").data("kendoGrid");
                    $(grid.tbody).on("click", "td", function (e) {
                        if (grid) {
                            $scope.$parent.changeHandler(this, grid);
                        } else {
                            console.log("Grid not found");
                        }
                    });
                }
            }
        }
        activate();
    }
})();
///#source 1 1 /Scripts/app/topnews/topnewsTableTamplate/topnewsMobileGridTemplate.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('topnewsMobileGridTemplateController', topnewsMobileGridTemplateController);
    topnewsMobileGridTemplateController.$inject = [
        '$scope', '$cookies', 'topNewsService', 'utils', 'device'
    ];

    

    function topnewsMobileGridTemplateController($scope, $cookies, topNewsService, utils, device) {
        $scope.$parent.gridDataSource.pageSize = 20;
        $scope.isIpad = device.getDeviceType().any()[0] === "iPad";
        angular.element(".stock-info-row").css({"margin-left":"5px", "margin-right":"5px"});
        function activate() {
            if(!$scope.isIpad) {
                var colums1Tab = [{

                    "title": "Symbol",
                    "field": "stock",
                    "width": 80,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                },
               {
                   "title": "Pub",
                   "field": "id",
                   "width": 40,
                   "template": "<img src='${ logo }' alt='${ id }' title='${ provider }'>",
                   headerAttributes: {
                       "class": "row_provider"
                   },
                   attributes: {
                       "class": "row_provider"
                   }
               },
               {
                   "title": "Headline",
                   "field": "headLine",
                   "template": "#= headLine  #",
                   headerAttributes: {
                       "class": "row_headline"
                   },
                   attributes: {
                       "class": "row_headline"
                   }
               }
                ];

                var colums2Tab = [{
                    "title": "Symbol",
                    "field": "stock",
                    "width": 75,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                },
                {
                    "title": "@News",
                    "field": "priceNews",
                    "width": 50,
                    "template": "${ priceNewsStr }",
                    headerAttributes: {
                        "class": "row_price",
                    },
                    attributes: {
                        "class": "row_price",
                        style: "text-align: right"
                    }
                },
                {
                    "title": "DateTime",
                    "field": "time",
                    "width": 110,
                    "template": "${ date } ${ time }",
                    headerAttributes: {
                        "class": "row_date"
                    },
                    attributes: {
                        "class": "row_date"
                    },
                },
                {
                    "title": "Volume",
                    "field": "volume",
                    "width": 67,
                    "template": "${ volume }",
                    headerAttributes: {
                        "class": "row_volume",
                    },
                    attributes: {
                        "class": "row_volume",
                        style: "text-align: right"
                    }
                }
                ];

                var colums3Tab = [{

                    "title": "Symbol",
                    "field": "stock",
                    "width": 80,
                    "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    }
                },
                {
                    "title": "Chg",
                    "field": "changePerc",
                    "template": "#= (changePerc == null) ? ' ' : kendo.toString(changePerc, 'n2') + '%' #",
                    headerAttributes: {
                        "class": "row_bid",
                    },
                    attributes: {
                        "class": "row_bid",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Last",
                    "field": "price",
                    "template": "${ priceStr }",
                    headerAttributes: {
                        "class": "row_ask",
                    },
                    attributes: {
                        "class": "row_ask",
                        style: "text-align: right"
                    }
                }, {
                    "title": "Vol Ratio",
                    "field": "volumeRatio",
                    "template": "<div>#= (volumeRatio == null) ? ' ' : kendo.toString(volumeRatio, 'n2') #<div class='${ scale }'></div></div>",
                    headerAttributes: {
                        "class": "row_volumeratio"
                    },
                    attributes: {
                        "class": "row_volumeratio"
                    }
                }];
           
                $scope.$parent.gridDataSource.change = function () {
                    $('#grid2Tab').data("kendoGrid").dataSource.data(this.data());
                    $('#grid3Tab').data("kendoGrid").dataSource.data(this.data());
                }


                $scope.gridOptions1Tab = {
                    columns: colums1Tab,
                    groupable: false,
                    pageable: {
                        messages: {
                            display: "{0} - {1} of {2:#,##} items"
                        }
                    },
                    sortable: true,
                    resizable: true,
                    sort: {
                        field: $scope.$parent.defaultField,
                        dir: $scope.$parent.defaultDir
                    },
                    dataBound: function (e) {
                        var grid = this;
                        $(grid.tbody).on("click", "td", function (e) {
                            if (grid) {
                                $scope.$parent.changeHandler(this, grid);
                            } else {
                                console.log("Grid not found");
                            }
                        });
                    }
                }

                $scope.gridOptions2Tab = {
                    columns: colums2Tab,
                    groupable: false,
                    resizable: true,
                    dataBound: function (e) {
                        var grid = this;
                        $(grid.tbody).on("click", "td", function (e) {
                            if (grid) {
                                $scope.$parent.changeHandler(this, grid);
                            } else {
                                console.log("Grid not found");
                            }
                        });
                    }
                }

                $scope.gridOptions3Tab = {
                    columns: colums3Tab,
                    groupable: false,
                    resizable: true,
                    dataBound: function (e) {
                        var grid = this;
                        $(grid.tbody).on("click", "td", function (e) {
                            if (grid) {
                                $scope.$parent.changeHandler(this, grid);
                            } else {
                                console.log("Grid not found");
                            }
                        });
                    }
                }

            } else {
                    $scope.iPadGridOptions = {
                        columns: [
                            {
                                "title": "Symbol",
                                "field": "stock",
                                "width": 85,
                                "template": "<div><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span> ${ stock }</span></div>",
                                headerAttributes: {
                                    "class": "row_stock"
                                },
                                attributes: {
                                    "class": "row_stock"
                                }
                            }, {
                                "title": "DateTime",
                                "field": "time",
                                "width": 100,
                                "template": "${ date } ${ time }",
                                headerAttributes: {
                                    "class": "row_date"
                                },
                                attributes: {
                                    "class": "row_date"
                                }
                            }, {
                                "title": "Pub",
                                "field": "id",
                                "width": 46,
                                "template": "<img src='${ logo }' alt='${ id }' title='${ provider }'>",
                                headerAttributes: {
                                    "class": "row_provider"
                                },
                                attributes: {
                                    "class": "row_provider"
                                }
                            }, {
                                "title": "Headline",
                                "field": "headLine",
                                "width": 330,
                                "template": "#= headLine  #",
                                headerAttributes: {
                                    "class": "row_headline"
                                },
                                attributes: {
                                    "class": "row_headline"
                                }
                            }, {
                                "title": "@News",
                                "field": "priceNews",
                                "width": 60,
                                "template": "${ priceNewsStr }",
                                headerAttributes: {
                                    "class": "row_price",
                                },
                                attributes: {
                                    "style": "text-align: right"
                                }
                            }
                        ],
                        detailTemplate: kendo.template($("#templateMobile").html()),
                        groupable: false,
                        pageable: {
                            messages: {
                                display: "{0} - {1} of {2:#,##} items"
                            }
                        },
                        sortable: true,
                        resizable: true,
                        sort: {
                            field: $scope.$parent.defaultField,
                            dir: $scope.$parent.defaultDir
                        },
                        dataBound: function (e) {
                            var grid = this;
                            $(grid.tbody).on("click", "td", function (e) {
                                if (grid) {
                                    $scope.$parent.changeHandler(this, grid);
                                } else {
                                    console.log("Grid not found");
                                }
                            });
                        }
                    }
                }
                    
            }
        activate();


    }
})();
///#source 1 1 /Scripts/app/stock/stock.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('StockController', StockController);
    StockController.$inject = [
        '$scope', 'stockService', '$routeParams', 'device'
    ];

    function StockController($scope, stockService, $routeParams, device) {
        $scope.navigatePanelIsShow = true;
        $scope.mainSymbolInfo = undefined;
        $scope.isMobile = false;
        $scope.symbol = "";
        activate();
        //chart load action(tab stock Chart)
        $scope.$on('stock.getStockChartData', function () {
            stockService.getChartData($scope.symbol).then(function (data) {
                $scope.$broadcast('stock.StockChartFillData', data);
            });
        });
        //symmary info load action(tab symmary)
        $scope.$on('stock.getStockSummary', function () {
            stockService.getStockSummary($scope.symbol)
                .then(function (data) {
                    $scope.$broadcast('stock.SummaryInfoFillData', data);
                });
        });

        function activate() {
            //check devaice type
            if (device.getDeviceType().any() === null) {
                $scope.isMobile = false;
            } else {
                $scope.isMobile = true;
            }
            Highcharts.setOptions({
                chart: {
                    style: {
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                    }
                }
            });
            //get defaul value
            $scope.symbol = $routeParams.symbol;
            //Get Sumary info by simbol
            stockService.getStockSymbolInfo($scope.symbol)
                .then(function (data) {
                    if (data.changeCssClass === 'positive') {
                        data.changeCssClass = ['positive', 'k-font-icon', 'k-i-arrow-n'];
                    } else if (data.changeCssClass === 'negative') {
                        data.changeCssClass = ['negative', 'k-font-icon', 'k-i-arrow-s'];
                    }
                    $scope.mainSymbolInfo = data;
                });
        }
    }
})();
///#source 1 1 /Scripts/app/stock/stock.service.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .service('stockService', stockService);
    stockService.$inject = ['$q', 'httpService'];

    function stockService($q, httpService) {
        var self = this;
        self.getStockTableData = getStockTableData;
        self.getNewsRelease = getNewsRelease;
        self.getChartData = getChartData;
        self.getChartJson = getChartJson;
        self.getCompanySymbolsThumbInfo = getCompanySymbolsThumbInfo;
        self.getStockSymbolInfo = getStockSymbolInfo;
        self.getStockSummary = getStockSummary;
        self.getPctInfo = getPctInfo;
        self.getAnalystActionsTabTableData = getAnalystActionsTabTableData;
        self.getEarningsTabTableData = getEarningsTabTableData;

        function getStockTableData(take, skip, symbol, sortDescription) {
            var stockTableOptionsParameters = {
                take: take,
                skip: skip,
                symbol: symbol,
                sortDescription: sortDescription
            };
            return httpService.post('api/stockApi/getStockTableData', stockTableOptionsParameters);
        }

        function getPctInfo(newsKey) {
            return httpService.get('api/stockApi/getNewsPctInfo', {
                newsKey: newsKey
            });
        }

        function getNewsRelease(newsKey) {
            return httpService.get('api/stockApi/getNewsRelease', {
                newsKey: newsKey
            });
        }

        function getChartData(symbol) {
            return httpService.get('api/chartApi/getchartdata', {
                symbol: symbol
            });
        }

        function getChartJson(symbol) {
            return httpService.get('api/chartApi/getchartjson', {
                symbol: symbol
            });
        }

        function getCompanySymbolsThumbInfo() {
            return httpService.get('api/stockApi/getCompanySymbolsThumbInfo');
        }

        function getStockSymbolInfo(symbol) {
            return httpService.get('api/stockApi/getStockSymbolInfo', {
                symbol: symbol
            });
        }

        function getStockSummary(symbol) {
            return httpService.get('api/stockApi/getStockSummary', {
                symbol: symbol
            });
        }

        function getAnalystActionsTabTableData(take, skip, sortDescription, symbol) {
            var analystActionsTableOptions = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                symbol: symbol
            };
            return httpService.post('api/analystActionApi/getPerformanceStockAnalystActionsTableData', analystActionsTableOptions);
        }

        function getEarningsTabTableData(take, skip, sortDescription, symbol) {
            var earningsOptions = {
                take: take,
                skip: skip,
                sortDescription: sortDescription,
                symbol: symbol
            };
            return httpService.post('api/analystActionApi/getPerformanceStockEarningsTableData', earningsOptions);
        }
    }
})();
///#source 1 1 /Scripts/app/stock/tabs/stockchart/stockchart.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('StockChartController', StockChartController);
    StockChartController.$inject = [
        '$scope'
    ];

    function StockChartController($scope) {
        $scope.isActive = false;
        var stockChart = null;
        activate();

        function activate() {
            $scope.$on('stock.StockChartFillData', fillData);
            //load the data only once
            if (!$scope.isActive) {
                $scope.$emit('stock.getStockChartData');
                $scope.isActive = true;
            }
        }

        function fillData(event, data) {
            if (data) {
                var obgJson = data; //JSON.parse(data);
                if (obgJson.Series.length > 0) {
                    $scope.chartIsVisible = true;
                }
                if ($('#graphContainer').length > 0) {
                    stockChart = ChartReport('COMPANY',
                        'Range',
                        $scope.symbol,
                        null,
                        3571,
                        1469617830000,
                        1469617830000,
                        'True',
                        null,
                        'graphContainer',
                        undefined,
                        true,
                        obgJson
                    );
                    stockChart();
                }
            }
        }
    }
})();
///#source 1 1 /Scripts/app/stock/tabs/summaryinfo/summaryInfo.controller.js
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
///#source 1 1 /Scripts/app/stock/tabs/todaysnews/todaysnews.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('StockTodaysNewsController', StockTodaysNewsController);
    StockTodaysNewsController.$inject = ['$scope', 'stockService', 'utils', '$cookies', 'device'];

    function StockTodaysNewsController($scope, stockService, utils, $cookies, device) {
        $scope.isActive = false;
        $scope.gridIsVisible = false;
        $scope.newsData = undefined;
        $scope.changeHandler = changeHandler;
        activate();

        function activate() {
            //load the data only once
            if (!$scope.isActive) {
                $scope.isActive = true;
                //add grid options
                $scope.gridOptions = {
                    columns: GetTableColumnsByDevice(),
                    groupable: false,
                    pageable: true,
                    sortable: false,
                    resizable: true,
                    selectable: true
                };
                //Add a template if it is a mobile device
                if ($scope.$parent.isMobile) {
                    $scope.gridOptions.detailTemplate = kendo.template($("#templateMobile").html());
                }
                //Create news data source
                $scope.gridStockNewsDataSource = {
                    transport: {
                        read: function (options) {
                            var cSort = $cookies.getObject("stnews_sorting");
                            if (cSort) options.data.sort = cSort;
                            stockService.getStockTableData(options.data.take, options.data.skip, $scope.$parent.symbol, options.data.sort)
                                .then(function (data) {
                                    if (data) {
                                        if (data.total > 0) $scope.gridIsVisible = true;
                                        angular.forEach(data.data, function (value) {
                                            value.volume = utils.kendoFormatValue(value.volume);
                                        });
                                        options.success(data);
                                        var grid = $("#gridNews").data("kendoGrid");
                                        grid.select('tr:eq(0)');
                                    } else {
                                        if (data.total > 0) $scope.gridIsVisible = false;
                                    }
                                    $cookies.putObject("stnews_sorting", options.data.sort);
                                });
                        }
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverSorting: true,
                    schema: {
                        total: function (data) {
                            // get total
                            return data.total;
                        },
                        data: function (data) {
                            // get DataTable data
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
        }
        // processed selecting on the line
        function changeHandler(data, dataItem, column) {
            $scope.selectedItem = data;
            stockService.getNewsRelease(data.newsKey)
                .then(function (data) {
                    $scope.newsData = data;
                    $scope.newsData.body = utils.trustAsHtml($scope.newsData.body);
                });
        }
        // create column model
        function GetTableColumnsByDevice() {
            //if not mobile
            var columsObj = null;
            if (device.getDeviceType().any() === null) {
                columsObj = [{
                    "width": 64,
                    "title": "Symbol",
                    "field": "stock",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    },
                    "template": "<div style='text-align: center;'><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span><a style='color: inherit;' href='\\#/reports/mainreport?news=#:data.newsKey#'> ${ stock }</a></span></div>"
                }, {
                    "width": 92,
                    "title": "DateTime",
                    "field": "time",
                    headerAttributes: {
                        "class": "row_date"
                    },
                    attributes: {
                        "class": "row_date"
                    },
                    "template": "${ date } ${ time }"
                }, {
                    "width": 52,
                    "title": "Pub",
                    "field": "id",
                    headerAttributes: {
                        "class": "row_provider"
                    },
                    attributes: {
                        "class": "row_provider"
                    },
                    "template": "${ id }"
                }, {
                    "width": 482,
                    "title": "Headline",
                    "field": "headLine",
                    headerAttributes: {
                        "class": "row_headline"
                    },
                    attributes: {
                        "class": "row_headline"
                    },
                    "template": "#= headLine #"
                }, {
                    "width": 68,
                    "title": "@News",
                    "field": "priceNews",
                    headerAttributes: {
                        "class": "row_price"
                    },
                    attributes: {
                        "class": "row_price",
                        style: "text-align: right"
                    },
                    "template": "#= (priceNews == null) ? ' ' : kendo.toString(priceNews, 'n2') #"
                }, {
                    "width": 55,
                    "title": "Chg",
                    "field": "changePerc",
                    headerAttributes: {
                        "class": "row_bid"
                    },
                    attributes: {
                        "class": "row_bid",
                        style: "text-align: right"
                    },
                    "template": "#= (changePerc == null) ? ' ' : kendo.toString(changePerc, 'n2') + '%' #"
                }, {
                    "width": 67,
                    "title": "Vol Ratio",
                    "field": "volumeRatio",
                    headerAttributes: {
                        "class": "row_volumeratio"
                    },
                    attributes: {
                        "class": "row_volumeratio"
                    },
                    "template": "#= (volumeRatio == null) ? ' ' : kendo.toString(volumeRatio, 'n2') # <div class='${ scale }'></div>"
                }];
            } else { //Is not desktop
                columsObj = [{
                    "width": 64,
                    "title": "Symbol",
                    "field": "stock",
                    headerAttributes: {
                        "class": "row_stock"
                    },
                    attributes: {
                        "class": "row_stock"
                    },
                    "template": "<div style='text-align: center;'><div style='border-radius: 2px; display: inline-block; width: 10px; height: 10px; background-color:  ${colorChangePrice}'></div><span><a style='color: inherit;' href='\\#/reports/mainreport?news=#:data.newsKey#'> ${ stock }</a></span></div>"
                }, {
                    "width": 92,
                    "title": "DateTime",
                    "field": "time",
                    headerAttributes: {
                        "class": "row_date"
                    },
                    attributes: {
                        "class": "row_date"
                    },
                    "template": "${ date } ${ time }"
                }, {
                    "width": 52,
                    "title": "Pub",
                    "field": "id",
                    headerAttributes: {
                        "class": "row_provider"
                    },
                    attributes: {
                        "class": "row_provider"
                    },
                    "template": "${ id }"
                }];
                // if Ipad
                if (device.getDeviceType().any() !== null && device.getDeviceType().any()[0] === "iPad") {
                    columsObj.push({
                        "width": 400,
                        "title": "Headline",
                        "field": "headLine",
                        headerAttributes: {
                            "class": "row_headline"
                        },
                        attributes: {
                            "class": "row_headline"
                        },
                        "template": "#= headLine #"
                    });
                    columsObj.push({
                        "width": 68,
                        "title": "@News",
                        "field": "priceNews",
                        headerAttributes: {
                            "class": "row_price"
                        },
                        attributes: {
                            "class": "row_price",
                            style: "text-align: right"
                        },
                        "template": "#= (priceNews == null) ? ' ' : kendo.toString(priceNews, 'n2') #"
                    });
                }
            }
            return columsObj;
        }
    }
})();
///#source 1 1 /Scripts/app/stock/tabs/earnings/earnings.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('StockEarningsController', StockEarningsController);
    StockEarningsController.$inject = ['$scope', 'stockService', 'device'];

    function StockEarningsController($scope, stockService, device) {
        $scope.isActive = false;
        $scope.gridIsVisible = false;
        activate();

        function activate() {
            //load the data only once
            if (!$scope.isActive) {
                $scope.isActive = true;
                //add grid options
                $scope.gridEarnOptions = {
                    columns: GetTableColumnsByDevice(),
                    groupable: false,
                    pageable: false,
                    sortable: true,
                    resizable: true
                };
                //Add a template if it is a mobile device
                if ($scope.$parent.isMobile) {
                    $scope.gridEarnOptions.detailTemplate = kendo.template($("#templateEarningsMobile").html());
                }
                $scope.gridEarnDataSource = {
                    transport: {
                        read: function (options) {
                            stockService.getEarningsTabTableData(options.data.take, options.data.skip, options.data.sort, $scope.$parent.symbol)
                                .then(function (data) {
                                    if (data) {
                                        if (data.total > 0) $scope.gridIsVisible = true;
                                        options.success(data);
                                    } else {
                                        $scope.gridIsVisible = false;
                                    }
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
                                dateTime: {
                                    type: "string"
                                },
                                actual: {
                                    type: "number"
                                },
                                action: {
                                    type: "string"
                                },
                                priceNews: {
                                    type: "number"
                                },
                                changePerc: {
                                    type: "number"
                                },
                                maxUp: {
                                    type: "number"
                                },
                                maxDown: {
                                    type: "number"
                                },
                                volRatio: {
                                    type: "number"
                                }
                            }
                        }
                    }
                };
            }
        }
        // create column model
        function GetTableColumnsByDevice() {
            //if not mobile
            var columsObj = null;
            if (device.getDeviceType().any() === null) {
                columsObj = [{
                    "title": "DateTime",
                    "field": "dateTime",
                    "width": 74,
                    "template": "<div style='text-align: center;'> #: dateTime # </div>"
                }, {
                    "title": "Actual EPS",
                    "field": "actual",
                    "template": "<div style='text-align: center;'> #= (actual == null) ? ' ' : kendo.toString(actual, '0.00')  #</div>",
                    "width": 60
                }, {
                    "title": "Action",
                    "field": "action",
                    "width": 90,
                    "template": "<div style='text-align: center;'> #= (action == null) ? ' ' : action  # </div>"
                }, {
                    "title": "@News",
                    "field": "priceNews",
                    "width": 50,
                    "template": "<div class='row_price' style='text-align: right; padding-right: 10px;'>#= (priceNews == null) ? ' ' : kendo.toString(priceNews, '0.00') #</div>"
                }, {
                    "title": "Chg",
                    "field": "changePerc",
                    "width": 50,
                    "template": "<div class='row_bid' style='text-align: right; padding-right: 10px;'>#= (changePerc == null) ? ' ' : kendo.toString(changePerc, '0.00') + '%'  # </div>"
                }, {
                    "title": "Max up",
                    "field": "maxUp",
                    "width": 50,
                    "template": "<div style='text-align: right; padding-right: 10px;'>  #= (maxUp == null) ? ' ' : kendo.toString(maxUp, '0.00') + '%' #</div>"
                }, {
                    "title": "Max down",
                    "field": "maxDown",
                    "width": 50,
                    "template": "<div style='text-align: right; padding-right: 10px;'> #= (maxDown == null) ? ' ' : kendo.toString(maxDown, '0.00' ) + '%' #</div>"
                }, {
                    "title": "Vol Ratio",
                    "field": "volRatio",
                    "width": 70,
                    "template": "<div style='text-align: right; padding-right: 10px;'> #= (volRatio == null) ? ' ' : kendo.toString(volRatio, '0.00') # <div class='#: scale #'></div></div>"
                }];
            } else { //Is not desktop
                columsObj = [{
                    "title": "DateTime",
                    "field": "dateTime",
                    "width": 74
                }, {
                    "title": "Actual EPS",
                    "field": "actual",
                    "template": "<div style='text-align: center;'> #= (actual == null) ? ' ' : actual  #</div>",
                    "width": 60
                }, {
                    "title": "Action",
                    "field": "action",
                    "width": 90,
                    "template": "<div style='text-align: center;'> #= (action == null) ? ' ' : action  # </div>"
                }];
                // if Ipad
                if (device.getDeviceType().any() !== null && device.getDeviceType().any()[0] === "iPad") {
                    columsObj.push({
                        "title": "@News",
                        "field": "priceNews",
                        "width": 60,
                        "template": "<div class='row_price' style='text-align: center;'>#= (priceNews == null) ? ' ' : kendo.toString(priceNews, '0.00') #</div>"
                    });
                    columsObj.push({
                        "title": "Chg",
                        "field": "changePerc",
                        "width": 50,
                        "template": "<div class='row_bid' style='text-align: center;'>#= (changePerc == null) ? ' ' : kendo.toString(changePerc, '0.00')  # #= (changePerc == null) ? ' ' : '%' #</div>"
                    });
                }
            }
            return columsObj;
        }
    }
})();
///#source 1 1 /Scripts/app/stock/tabs/analystactions/analystactions.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('StockAnalystActionsController', StockAnalystActionsController);
    StockAnalystActionsController.$inject = ['$scope', 'stockService', 'device'];

    function StockAnalystActionsController($scope, stockService, device) {
        $scope.isActive = false;
        $scope.gridIsVisible = false;
        activate();

        function activate() {
            //load the data only once
            if (!$scope.isActive) {
                $scope.isActive = true;
                //add grid options
                $scope.gridAAOptions = {
                    columns: GetTableColumnsByDevice(),
                    groupable: false,
                    pageable: true,
                    sortable: true,
                    resizable: true
                };
                //Add a template if it is a mobile device
                if ($scope.$parent.isMobile) {
                    $scope.gridAAOptions.detailTemplate = kendo.template($("#templateAnalistMobile").html());
                }
                $scope.gridAADataSource = {
                    transport: {
                        read: function (options) {
                            stockService.getAnalystActionsTabTableData(options.data.take, options.data.skip, options.data.sort, $scope.$parent.symbol)
                                .then(function (data) {
                                    if (data) {
                                        if (data.total > 0) $scope.gridIsVisible = true;
                                        options.success(data);
                                    } else {
                                        $scope.gridIsVisible = false;
                                    }
                                });
                        }
                    },
                    pageSize: 10,
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
                                dateTime: {
                                    type: "string"
                                },
                                pubTime: {
                                    type: "string"
                                },
                                source: {
                                    type: "string"
                                },
                                from: {
                                    type: "string"
                                },
                                to: {
                                    type: "string"
                                },
                                firm: {
                                    type: "string"
                                },
                                direction: {
                                    type: "string"
                                },
                                priceNews: {
                                    type: "number"
                                },
                                changePerc: {
                                    type: "number"
                                },
                                maxUp: {
                                    type: "number"
                                },
                                maxDown: {
                                    type: "number"
                                },
                                volRatio: {
                                    type: "number"
                                }
                            }
                        }
                    }
                };
            }
        }
        // create column model
        function GetTableColumnsByDevice() {
            //if not mobile
            var columsObj = null;
            if (device.getDeviceType().any() === null) {
                columsObj = [{
                    "title": "DateTime",
                    "field": "dateTime",
                    "width": 100
                }, {
                    "title": "Pub",
                    "field": "source",
                    "width": 25,
                    "template": "<img width='20' src='#: sourceLogo  #' alt='#: source  #' />"
                }, {
                    "title": "Action",
                    "field": "action",
                    "width": 70,
                    "template": "#= (action == null) ? ' ' : action  #"
                }, {
                    "title": "From",
                    "field": "from",
                    "width": 100,
                    "template": "<div style='text-align: center;width:100%'>#= (from == null) ? ' ' : from  #</span>"
                }, {
                    "title": "To",
                    "field": "to",
                    "width": 100,
                    "template": "<div style='text-align: center;width:100%'> #= (to == null) ? ' ' : to  #</span>"
                }, {
                    "title": "Firm",
                    "field": "firm",
                    "width": 140,
                    "template": "<div style='text-align: center;width:100%'>#= (firm == null) ? ' ' : firm  #</span>"
                }, {
                    "title": "Direction",
                    "field": "direction",
                    "width": 50,
                    "template": "<div style='text-align: center;width:100%'>#= (direction == null) ? ' ' : direction  #</span>"
                }, {
                    "title": "@News",
                    "field": "priceNews",
                    "width": 45,
                    "template": "<div class='row_price'>#= (priceNews == null) ? ' ' : kendo.toString(priceNews, '0.00') #</div>"
                }, {
                    "title": "Chg",
                    "field": "changePerc",
                    "width": 50,
                    "template": "<div class='row_bid'>#= (changePerc == null) ? ' ' : kendo.toString(changePerc, '0.00') + '%' # </div>"
                }, {
                    "title": "Max up",
                    "field": "maxUp",
                    "width": 45,
                    "template": "<div> #= (maxUp == null) ? ' ' : kendo.toString(maxUp, '0.00') + '%' #</div>"
                }, {
                    "title": "Max down",
                    "field": "maxDown",
                    "width": 50,
                    "template": "<div>  #= (maxDown == null) ? ' ' : kendo.toString(maxDown, '0.00') + '%' #</div>"
                }, {
                    "title": "Vol Ratio",
                    "field": "volRatio",
                    "width": 70,
                    "template": "<div> #= (volRatio == null) ? ' ' : kendo.toString(volRatio, '0.00') # <div class='#: scale #'></div></div>"
                }];
            } else { //Is not desktop
                columsObj = [{
                    "title": "DateTime",
                    "field": "dateTime",
                    "width": 100
                }, {
                    "title": "Pub",
                    "field": "source",
                    "width": 25,
                    "template": "<img width='20' src='#: sourceLogo  #' alt='#: source  #' />"
                }, {
                    "title": "Action",
                    "field": "action",
                    "width": 70,
                    "template": "#= (action == null) ? ' ' : action  #"
                }];
                // if Ipad
                if (device.getDeviceType().any() !== null && device.getDeviceType().any()[0] === "iPad") {
                    columsObj.push({
                        "title": "From",
                        "field": "from",
                        "width": 100,
                        "template": "<div style='text-align: center;width:100%'>#= (from == null) ? ' ' : from  #</span>"
                    });
                    columsObj.push({
                        "title": "To",
                        "field": "to",
                        "width": 100,
                        "template": "<div style='text-align: center;width:100%'> #= (to == null) ? ' ' : to  #</span>"
                    });
                }
            }
            return columsObj;
        }
    }
})();
///#source 1 1 /Scripts/app/login/resetPassword/reset.password.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('ResetPasswordController', ResetPasswordController);
    ResetPasswordController.$inject = [
        '$scope', 'resetPasswordService', '$q', '$routeParams', '$timeout', '$location'
    ];

    function ResetPasswordController($scope, resetPasswordService, $q, $routeParams, $timeout, $location) {

        $scope.validationMessage = '';
        $scope.userInfo = {
            password: "",
            confirmPassword: "",
            userId : "",
            code: ""
        };
        activate();

        function activate() {
            $scope.userInfo.userId = $routeParams.userId;
            $scope.userInfo.code = $routeParams.code;

            if (!$routeParams.userId || !$routeParams.code) {
                $scope.resultMessage = 'Sorry but this url incorrect';
                $timeout(callAtTimeout, 3000);
            }
        }

        function callAtTimeout() {
            $location.path('/portal/login');
        }

        $scope.validate = function (event) {
            event.preventDefault();

            if ($scope.userInfo.confirmPassword !== $scope.userInfo.password) {
                $scope.validationMessage = "Passwords do not match!";
                return;
            }

            if ($scope.validator.validate()) {
                resetPasswordService.resetPassword($scope.userInfo)
                 .then(function (data) {
                     $scope.validationMessage = data.message;
                     $timeout(callAtTimeout, 5000);
                 });
            }
        }
    }
})();
///#source 1 1 /Scripts/app/login/resetPassword/reset.password.service.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .service('resetPasswordService', resetPasswordService);
    resetPasswordService.$inject = ['$q', 'httpService'];

    function resetPasswordService($q, httpService) {
        var self = this;
        self.resetPassword = resetPassword;

        function resetPassword(model) {
            return httpService.post('api/accountApi/resetpassword', model);
        }
    }
})();
///#source 1 1 /Scripts/app/alerts/alerts.controller.js
(function () {
    'use strict';
    angular
        .module('nqpro')
        .controller('AlertsController', AlertsController);
    AlertsController.$inject = [
        '$scope', 'alertsService', 'utils', 'authService', '$location', '$cookies', '$routeParams', '$window', 'device'
    ];

    function AlertsController($scope, alertsService, utils, authService, $location, $cookies, $routeParams, $window, device) {
        $scope.isHaveAccess = false;
        $scope.gridIsVisible = false;
        $scope.valdationMessages = "";
        $scope.sendMessages = "";
        

        
        var checkSelectEvent = false;

        $scope.searchOptionsFirmAutocomplete = {
            placeholder: "Search for company",
            select: function (e) { checkSelectEvent = true }
         };

        $scope.searchOptionsSymbolAutocomplete = {
            placeholder: "Search for Symbol",
            select: function (e) { checkSelectEvent = true }
         };

        $scope.searchSourceAlertsStockAutocomplete = {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    alertsService.getSymbolSearchStock(options.data.filter.filters[0].value)
                        .then(function (data) {
                            var filterData = [];
                            data.forEach(function (item) {
                                filterData.push(item.searchValueField);
                            })
                            options.success(filterData);
                        });
                }
            }
        };

        $scope.searchSourceAlertsFirmAutocomplete = {
            serverFiltering: true,
            transport: {
                read: function (options) {
                    alertsService.getSearchFirm(options.data.filter.filters[0].value) //
                        .then(function (data) {
                            options.success(data);
                        });
                }
            }
        };


        $scope.subscriptionTypeSource = [
            "Action",
            "Action by Firm",
            "Action by Symbol",
            "Action by Market Cap Category"
        ];

       

        $scope.marketCapSource = [
            "Nano",
            "Micro",
            "Small",
            "Mid",
            "Big",
            "Mega"
        ];

        $scope.actionsSource = [
            "Upgrades",
            "Downgrades"
        ];

        $scope.deliveryMethodsSource = [
            "Email",
            //"Text Message"
        ];

        $scope.deliveryOptionSource = [
            "Instant",
            "Summary Digest @ 09:00 ET",
            "Summary Digest @ 16:15 ET"
        ];

        /*$scope.providerSource = [
            "Verizon",
            "AT&T",
            "Sprint",
            "T-Mobile",
            "Cingular",
            "Virgin Mobile"
        ];*/


       

        var subscriptionTypeEditor = function (container, options) {
            $('<input kendo-drop-down-list required k-options="selectOption" k-data-source="subscriptionTypeSource" data-bind="value:' + options.field + '"/>')
            .appendTo(container);
        }


        var searchSourceAlertsPresentValue = "";

      
        $scope.searchSourceAlertsFocus = function (e) {

            searchSourceAlertsPresentValue = e.target.value;
        }

        $scope.searchAlertsBlur = function (e) {
            if (e.target.value === searchSourceAlertsPresentValue) return;
            if (!checkSelectEvent) {
                e.target.value = "";
            } else {
                checkSelectEvent = false;
            }
        };

        $scope.selectOption = {
            optionLabel: "-- Please select --"
        }


        
        var toggleAutoComplete = false;

        var subscriptionTypeValueStockEditor = function (container, options) {
            var subscriptionType = options.model.subscriptionType;
            switch (subscriptionType) {
                case "Action by Firm":
                    $('<span class="auto-complete-wrapper"><input kendo-auto-complete k-data-source="searchSourceAlertsFirmAutocomplete" k-options="searchOptionsFirmAutocomplete" ng-blur="searchAlertsBlur($event)" ng-focus="searchSourceAlertsFocus($event)" data-bind="value:' + options.field + '"/><span class = "fa fa-search alert-search-icon"></span></span>')
            .appendTo(container);
                    toggleAutoComplete = true;
                    break;
                case "Action by Symbol":
                    $('<span class="auto-complete-wrapper"><input kendo-auto-complete k-data-source="searchSourceAlertsStockAutocomplete" k-options="searchOptionsSymbolAutocomplete" ng-blur="searchAlertsBlur($event)" ng-focus="searchSourceAlertsFocus($event)" data-bind="value:' + options.field + '"/><span class = "fa fa-search alert-search-icon"></span></span>')
            .appendTo(container);
                    toggleAutoComplete = true;
                    break;
                case "Action by Market Cap Category":
                    $('<input kendo-drop-down-list k-data-source="marketCapSource" k-options ="selectOption" data-bind="value:' + options.field + '"/>')
           .appendTo(container);
                    break;
                default:
                   container.text(options.model.subscriptionTypeValue);
            }
        }


        var actionsEditor = function (container, options) {
            $('<input kendo-drop-down-list required k-data-source="actionsSource" k-options="selectOption" data-bind="value:' + options.field + '"/>')
            .appendTo(container);
        }

        /*var deliveryMethodEditor = function (container, options) {
            $('<input kendo-drop-down-list required k-data-source="deliveryMethodsSource" k-options="selectOption" data-bind="value:' + options.field + '"/>')
            .appendTo(container);
        }*/

        var deliveryOptionEditor = function (container, options) {
            $('<input kendo-drop-down-list required k-data-source="deliveryOptionSource" k-options="selectOption" data-bind="value:' + options.field + '"/>')
            .appendTo(container);
        }


        /*var providerEditor = function (container, options) {
            var deliveryMethod = options.model.deliveryMethod;
            if (deliveryMethod === "Email" || deliveryMethod === "") {
                return
            }
            $('<input kendo-drop-down-list k-data-source="providerSource" k-options="selectOption" data-bind="value:' + options.field + '"/>')
            .appendTo(container);
        }*/

       

        function activate() {
            if (!authService || !authService.authentication || !authService.authentication.isAuth) {
                $location.path('/portal/login');
                return;
            }


            $scope.isHaveAccess = true;

            $scope.gridDataSource = {
                transport: {
                    read: function (options) {
                        alertsService.getSettings()
                            .then(function (data) {
                                data.forEach(function (element) {
                                    if (element.subscriptionTypeValue == null) element.subscriptionTypeValue = "All";
                                    if (element.action == "") element.action = "All";
                                });
                                if (data) {
                                    if (data.length > 0) $scope.gridIsVisible = true;                                                                     
                                    options.success(data);
                                } else {
                                    $scope.gridIsVisible = false;
                                }
                            });
                    },
                    update: function (options) { options.success() },
                    destroy: function (options) { options.success() },
                    create: function (options) { options.success() }
                },
                schema: {
                    model: {
                        fields: {
                           
                            subscriptionType: {
                                type: "string"
                            },
                            subscriptionTypeValue: {
                                type: "string"
                            },
                            action: {
                                type: "string"
                            },
                            deliveryMethod: {
                                type: "string",
                                defaultValue: "Email",
                            },
                            deliveryOption: {
                                type: "string"
                            },
                            /*provider: {
                                type: "string"
                            }*/
                        }
                    }
                },
            };


            function checkRequiredCell() {

                $scope.alertsGrid.dataSource.data().forEach(function (element, i) {
                    function addRequiredInfo (classElementName) {
                        $scope.alertsGrid.tbody.find('[data-uid ="' + element.uid + '"]').find(classElementName).addClass("required-input").text("-- Please select --");
                    }

                    if (element.action === "") {
                        addRequiredInfo(".alerts-action");
                    }

                    /*if (element.deliveryMethod === "") {
                        addRequiredInfo(".delivery-method");
                    }*/

                    if (element.deliveryOption === "") {
                        addRequiredInfo(".delivery-option");
                    }

                    if (element.subscriptionType === "") {
                        addRequiredInfo(".subscription-type");
                    }

                    if (element.subscriptionType !== "Action" && element.subscriptionType !== "" && element.subscriptionTypeValue === "") {
                        addRequiredInfo(".subscription-type-value");
                    }
                    /*if (element.deliveryMethod !== "Email" && element.deliveryMethod !== "" && element.provider === "") {
                        addRequiredInfo(".provider");
                    }*/
                });
            }


            $scope.gridOptions = {
                columns: [
                {
                    editor: subscriptionTypeEditor,
                    "title": "Subscription Type",
                    "field": "subscriptionType",
                    "attributes": {
                        "class": "subscription-type",
                        "style": "text-align: center"
                    }
                },
                {
                    editor: subscriptionTypeValueStockEditor,
                    "title": "Subscription Type Value",
                    "field": "subscriptionTypeValue",
                    "attributes": {
                        "class": "subscription-type-value",
                        "style": "text-align: center"
                    },
                    "template": '#= (subscriptionTypeValue == null) ? "" : subscriptionTypeValue #'
                },
                 {
                     editor: actionsEditor,
                     "title": "Action",
                     "field": "action",
                     "attributes": {
                         "class": "alerts-action",
                         "style": "text-align: center"
                     }
                 },

                 {
                     //editor: deliveryMethodEditor,
                     "title": "Delivery Method",
                     "field": "deliveryMethod",
                     "attributes": {
                         "class": "delivery-method",
                         "style": "text-align: center"
                     }
                 },


                 /*{
                     editor: providerEditor,
                     "title": "Provider",
                     "field": "provider",
                     "attributes": {
                         "class": "provider",
                         "style": "text-align: center"
                     }
                 },*/

                  {
                      editor: deliveryOptionEditor,
                      "title": "Delivery Option",
                      "field": "deliveryOption",
                      "attributes": {
                          "class": "delivery-option",
                          "style": "text-align: center"
                      }
                      
                  },
                   {command: ["destroy"], title: "", width: "100px" }
                    
                ],
                groupable: false,
                sortable: true,
                resizable: true,
                editable: {
                    mode: 'incell',
                    "createAt": "bottom",
                    "confirmation": "Are you sure you want to delete this record?"
                    },
                toolbar: ["create", "save"],
                edit: function (e) {
                   
                    if (e.container.hasClass("subscription-type-value") && e.model.subscriptionType !== "Action" && e.model.subscriptionType !== "" && e.model.subscriptionTypeValue === "") {
                        console.log(e.model.subscriptionType);
                        e.container.addClass("required-input");
                    }

                    
                    /*if (e.container.hasClass("provider") && e.model.provider === "" && e.model.deliveryMethod !== "" && e.model.deliveryMethod !== "Email") {
                        e.container.addClass("required-input");
                    }*/

                    if (e.container.hasClass("delivery-method")) {
                        this.closeCell();
                    }

                },
                save: function (e) {                    
                    if (e.container.hasClass("subscription-type")) {
                        if (e.values.subscriptionType != "Action") {
                            e.model.subscriptionTypeValue = "";
                            e.container.parent().find(".subscription-type-value").empty().text("-- Please select --").addClass("required-input");
                        } else {
                            e.model.subscriptionTypeValue = "";
                            e.container.parent().find(".subscription-type-value").empty().removeClass("required-input");
                        }
                    }
                    if (e.container.hasClass("subscription-type-value")) {
                        if (toggleAutoComplete) {
                            toggleAutoComplete = false;
                            if (!checkSelectEvent) {
                                if (e.model.subscriptionTypeValue === "") {

                                    e.container.addClass("required-input");
                                }

                                e.preventDefault();
                                return
                            }
                        }
                    }

                    if (e.values.subscriptionTypeValue === "") {
                        e.container.addClass("required-input");
                    } else {
                        e.container.removeClass("required-input");
                    }

                    /*if (e.container.hasClass("delivery-method")) {
                        e.model.provider = "";
                        if (e.values.deliveryMethod != "Email") {
                            e.container.parent().find(".provider").empty().text("-- Please select --").addClass("required-input");;
                        } else {
                            e.container.parent().find(".provider").empty().removeClass("required-input");
                        }
                    }

                    if (e.container.hasClass("provider") && e.values.provider === "") {
                        e.container.addClass("required-input");
                    }

                    if (e.container.hasClass("provider") && e.values.provider !== "") {
                        e.container.removeClass("required-input");
                    }*/

                },
               
                dataBinding: function (e) {
                    var data = this.dataSource.data();
                    var lastRow = data[data.length-2];
                    if (e.action == "add" && lastRow != undefined) {
                        if (lastRow.subscriptionType === "" ||
                            lastRow.subscriptionType !== "Action" && lastRow.subscriptionTypeValue === "" ||
                            lastRow.action === "" ||
                            //lastRow.deliveryMethod === "" ||
                            //lastRow.deliveryMethod !== "Email" && lastRow.provider === "" ||
                            lastRow.deliveryOption === "") {
                            $scope.valdationMessages = "You must complete all required fields before moving to the next alert";
                            e.preventDefault();
                            this.dataSource.remove(data[data.length - 1]);
                        } 
                    }
                },
                dataBound: function (e) {

                    angular.element(document).find(".k-grid-content td").bind("click", function () {
                        if ($(this).hasClass("required-input")) {
                            $(this).removeClass("required-input");
                        }
                        $scope.sendMessages = "";
                        $scope.valdationMessages = "";
                    });

                    checkRequiredCell();
                },

                saveChanges: function (e) {
                    var userSettings = [];
                    if ($scope.alertsGrid.dataSource.hasChanges()) {

                        var validationRequired = true;

                        if ($scope.alertsGrid.dataSource.data().length > 0) {
                            $scope.alertsGrid.dataSource.data().forEach(function (element) {
                                var settingsSend = {};
                                if (element.id === undefined) {
                                    element.id = 0;
                                }
                                if (element.subscriptionType === "" ||
                                    element.subscriptionType !== "Action" && element.subscriptionTypeValue === "" ||
                                    element.action === "" ||
                                    //element.deliveryMethod === "" ||
                                    //element.deliveryMethod !== "Email" && element.provider === ""||
                                    element.deliveryOption === "") {
                                    validationRequired = false;
                                }
                                settingsSend.id = element.id;
                                settingsSend.subscriptionType = element.subscriptionType;
                                settingsSend.subscriptionTypeValue = element.subscriptionTypeValue;
                                settingsSend.action = element.action;
                                settingsSend.deliveryMethod = element.deliveryMethod;
                                settingsSend.deliveryOption = element.deliveryOption;
                                //settingsSend.provider = element.provider;
                                userSettings.push(settingsSend);
                            });
                        }
                        if (validationRequired) {
                            alertsService.setSettings(userSettings).then(function () {
                                $scope.sendMessages = "Alert Successfully Saved";
                                $scope.alertsGrid.dataSource.read();
                                $scope.alertsGrid.refresh();
                            }, function () { $scope.valdationMessages = "Your changes are not send. Please try again"; });
                        } else {
                            $scope.valdationMessages = "You missed some required fields: Fill them before saving the record!";
                        }
                       
                    }
                }
 
            };
        }

        activate();


       /* function unique(arr) {
            var result = [];
                for (var i = 0; i < arr.length; i++) {
                    var record = arr[i];
                    if (result.length === 0) {
                        result[0] = record;
                        continue;
                    }
                    var uniqueCheck = false;
                    for (var j = 0; j < result.length; j++) {
                        for (var key in result[j]) {
                            if (key == "id") continue;
                            if (result[j][key] !== record[key]) {
                                uniqueCheck = true;
                                break;
                            }
                        }
                    }
                    if (uniqueCheck) result.push(record);
                }
            console.log("result", result);
            return result;
        }*/


    }

})();
///#source 1 1 /Scripts/app/alerts/alerts.service.js
(function () {
    'use strict';

    angular
        .module('nqpro')
        .service('alertsService', alertsService);

    alertsService.$inject = ['$q', 'httpService'];

    function alertsService($q, httpService) {
        var self = this;

        self.getSymbolSearchStock = getSymbolSearchStock;
        self.getSearchFirm = getSearchFirm;
        self.getSettings = getSettings;
        self.setSettings = setSettings;


        function getSymbolSearchStock(options) {
            return httpService.get('api/reportApi/getsymbol', {
                options: options
            });
        }

        function getSearchFirm(options) {
            return httpService.get('api/reportApi/getfirm', {
                options: options
            });
        }

        function getSettings() {
            return httpService.get('api/alertSettings/getSettings', {
            });
        }

        function setSettings(userSettings) {
            var settings = {
                userSettings: userSettings
            };
            return httpService.post('api/alertSettings/setSettings', settings);
        }

  }

})();
