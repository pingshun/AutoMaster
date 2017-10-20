// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('car', ['ionic', 'car.controllers', 'car.services', 'ngCordova'])

.run(['$ionicPlatform', 'DeviceReady', 'Cars', 'Brand', '$rootScope', '$timeout', '$localStorage', '$http', function($ionicPlatform, DeviceReady, Cars, Brand, $rootScope, $timeout, $localStorage, $http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //Load the Pre-populated database, debug = true

    if ($localStorage.user_token) {
      // do login
      var data = {};
      data.user = $localStorage.current_user;
      data.password = $localStorage.user_password;
      $http({
        url: CONSTANTS.login_url,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data,
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        }
      })
        .success(function (data, status, headers, config) {
          if (data.error) {
            $rootScope.loginStatus = CONSTANTS.login_status_not_login;
          } else {
            Cars.refresh();
          }
        })
        .error(function (data, status, headers, config) {
          $rootScope.loginStatus = CONSTANTS.login_status_not_login;
        });

    } else {
      $rootScope.loginStatus = CONSTANTS.login_status_not_login;
    }

    /*
    document.addEventListener("resume", function() {
      Notification.refresh();
    }, false);
    document.addEventListener("pause", function() {
      ServerBackup.backup();
    }, false);*/
  });
}])

.config(['$ionicConfigProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', function($ionicConfigProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

  // hide label of backButton
  $ionicConfigProvider.backButton.previousTitleText(false).text('');

  $httpProvider.interceptors.push(['$localStorage', function($localStorage) {
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        if ($localStorage.user_token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.user_token;
        }
        return config;
      },
    };
  }]);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.main', {
      url: '/main',
      views: {
        'tab-main': {
          templateUrl: 'templates/main/tab-main.html',
          controller: 'CarsCtrl'
        }
      }
    })


    .state('tab.register', {
      url: '/main/register',
      views: {
        'tab-main': {
          templateUrl: 'templates/main/user/register.html',
          controller: 'RegisterCtrl'
        }
      }
    })

    .state('tab.forgot-pw', {
      url: '/main/forgot-pw',
      views: {
        'tab-main': {
          templateUrl: 'templates/main/user/forgot-pw.html',
          controller: 'ForgotPwCtrl'
        }
      }
    })

    .state('tab.add-car', {
      url: '/main/add',
      views: {
        'tab-main': {
          templateUrl: 'templates/car/add-new.html',
          controller: 'AddCar'
        }
      }
    })

    .state('tab.car-detail', {
      url: '/main/:car_id',
      views: {
        'tab-main': {
          templateUrl: 'templates/car/car-detail.html',
          controller: 'CarDetailCtrl'
        }
      }
    })

    .state('tab.car-service-items', {
      url: '/main/service_items/:car_id',
      views: {
        'tab-main': {
          templateUrl: 'templates/car/car-service-items.html',
          controller: 'CarServiceItemsCtl'
        }
      }
    })

    .state('tab.car-service-item', {
      url: '/main/service_items/detail/:car_id/:id',
      views: {
        'tab-main': {
          templateUrl: 'templates/car/car-service-item.html',
          controller: 'CarServiceItemCtl'
        }
      }
    })

    .state('tab.car-service-records', {
      url: '/main/service_records/:car_id',
      views: {
        'tab-main': {
          templateUrl: 'templates/car/car-service-records.html',
          controller: 'CarServiceRecordsCtl'
        }
      }
    })

    .state('tab.service-record', {
      url: '/main/service_records/detail/:car_id/:id',
      views: {
        'tab-main': {
          templateUrl: 'templates/car/service-record.html',
          controller: 'RecordDetailCtl'
        }
      }
    })

    .state('tab.car-msg-center', {
      url: '/main/msg-center/:car_id',
      views: {
        'tab-main': {
          templateUrl: 'templates/car/message-center.html',
          controller: 'MessageCenter'
        }
      }
    })

    .state('tab.around', {
      url: '/around',
      views: {
        'tab-around': {
          templateUrl: 'templates/around/tab-around.html',
          controller: 'AroundCtrl'
        }
      }
    })

    .state('tab.config', {
      url: '/config',
      views: {
        'tab-config': {
          templateUrl: 'templates/config/tab-config.html',
          controller: 'ConfigCtrl'
        }
      }
    })

    .state('tab.current-user', {
      url: '/config/current-user',
      views: {
        'tab-config': {
          templateUrl: 'templates/config/user/current-user.html',
          controller: 'CurrentUserCtrl'
        }
      }
    })

    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/main');

}]);
