angular.module('car.services', ['ngStorage', 'util', 'car.db_class'])

  .factory('DeviceReady', ['$q', function ($q) {
    var is_ready = false;
    var deferred = $q.defer();

    return {
      is_ready: is_ready,
      ready: deferred.promise,
      setReady: function () {
        is_ready = true;
        deferred.resolve(is_ready);
      }
    };
  }])

  .factory('Cars', ['$q', '$rootScope', '$http', 'Car', 'ServiceItem', 'ServiceRecord', function($q, $rootScope, $http, Car, ServiceItem, ServiceRecord) {

    var cars = [];
    var refreshData = function() {
      var deferred = $q.defer();
      cars.splice(0, cars.length);


      $http({
        url: CONSTANTS.get_cars,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: [],
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
      })
        .success(function (data, status, headers, config) {
          if (data.error) {
            console.debug('failed get data from server');
            console.debug(data);
            $rootScope.loginStatus = CONSTANTS.login_status_login_error;
            return;
          } else {
            // Got data
            $rootScope.loginStatus = CONSTANTS.login_status_login_done;
            angular.forEach(data, function (carData) {
              cars.push(Car.getFromServerData(carData));
            });
            deferred.resolve();
          }

        }.bind(this))

        .error(function (data, status, headers, config) {
          console.debug('error');
          $rootScope.loginStatus = CONSTANTS.login_status_login_error;
          return;
        });

      return deferred.promise;
    };

    return {
      refresh: refreshData,
      all: function() {
        return cars;
      },
      get: function(id) {
        for (var i = 0; i < cars.length; i++) {
          if (cars[i].id === parseInt(id)) {
            return cars[i];
          }
        }
      },
      remove: function(car) {
        cars.splice(cars.indexOf(car), 1);
      },
      clear: function () {
        cars.splice(0, cars.length);
      },
      add: function(car) {
        cars.push(car);
      },
    }
  }])


  .factory('Brand', ['$q', '$filter', function($q, $filter) {

    return {
      all: function() {
        return CONSTANTS.brands;
      },
    }
  }])

  .factory('ConfService', ['$localStorage', '$rootScope', 'Cars', function($localStorage, $rootScope, Cars) {

    var current_user = {
      id: $localStorage.user_id,
      user: $localStorage.current_user,
      gender: $localStorage.user_gender + '',
      email: $localStorage.user_email,
      token: $localStorage.user_token,
    };
    var conf_data = {
      notify_period: $localStorage.notify_period,
    };

    return {
      get_current_user: current_user,
      get_conf_data: conf_data,
      set_current_user: function(user) {
        $localStorage.user_id = user.id;
        $localStorage.current_user = user.name;
        $localStorage.user_gender = user.gender;
        $localStorage.user_password = user.password;
        $localStorage.user_email = user.email;
        $localStorage.user_token = user.token;

        current_user.id = user.id;
        current_user.user = user.name;
        current_user.gender = user.gender + '';
        current_user.email = user.email;
        current_user.token = user.token;


        if (user.token) {
          Cars.refresh();
        } else {
          Cars.clear();
          $rootScope.loginStatus = CONSTANTS.login_status_not_login;
        }
      },
      set_current_user_name: function (name) {
        $localStorage.current_user = name;
        current_user.user = name;
      },
      set_current_user_email: function (email) {
        $localStorage.user_email = email;
        current_user.email = email;
      },
      set_current_user_gender: function (gender) {
        $localStorage.user_gender = gender;
        current_user.gender = gender;
      },
      set_current_user_token: function (token) {
        $localStorage.user_token = token;
        current_user.token = token;

        Cars.refresh();
        if (token) {
          Cars.refresh();
        } else {
          Cars.clear();
          $rootScope.loginStatus = CONSTANTS.login_status_not_login;
        }
      },
      set_notify_period: function (period) {
        $localStorage.notify_period = period;
        conf_data.notify_period = period;
      },
    }
  }])

  .service('GoBackMany',['$ionicHistory', function($ionicHistory){
    return function(depth){
      // get the right history stack based on the current view
      var historyId = $ionicHistory.currentHistoryId();
      var history = $ionicHistory.viewHistory().histories[historyId];
      // set the view 'depth' back in the stack as the back view
      var targetViewIndex = history.stack.length - 1 - depth;
      $ionicHistory.backView(history.stack[targetViewIndex]);
      // navigate to it
      $ionicHistory.goBack();
    }
  }])

;
