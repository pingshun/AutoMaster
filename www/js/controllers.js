angular.module('car.controllers', [])

  .controller('CarsCtrl', ['$scope', '$rootScope', 'Car', 'Cars', '$ionicModal', '$state', '$http', 'ConfService', '$ionicHistory', 'Util', '$cordovaGeolocation', function($scope, $rootScope, Car, Cars, $ionicModal, $state, $http, ConfService, $ionicHistory, Util, $cordovaGeolocation) {

    $scope.cars = Cars.all();
    $scope.delete = function(car) {
      car.delete();
      Cars.remove(car);
    };
    $scope.has_cars = function() {
      if ($scope.cars.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    $scope.showAdd = function () {
      if ($rootScope.loginStatus > 0) {
        $state.go("tab.add-car");
      } else {
        $state.go("tab.register");
      }
    };

    $scope.login_data = {
      'user': '',
      'password': '',
    };
    $scope.login = function () {
      if ($scope.login_data.user === '' || $scope.login_data.password === '') {
        return;
      }
      var data = {};
      data.user = $scope.login_data.user;
      data.password = Util.encrypt($scope.login_data.password);
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
            Util.showError(data.message);
          } else {
            var user = {
              id: data.id,
              name: data.username,
              gender: data.gender,
              password: Util.encrypt($scope.login_data.password),
              email: data.email,
              token: data.token,
            };
            $scope.login_data.user = '';
            $scope.login_data.password = '';

            ConfService.set_current_user(user);
            $ionicHistory.goBack();

          }
        })
        .error(function (data, status, headers, config) {
          Util.showError("登录失败,未知错误");
        });
    }
  }])


  .controller('RegisterCtrl', ['$scope', '$http', '$ionicHistory', 'Util', 'ConfService', function ($scope, $http, $ionicHistory, Util, ConfService) {
    $scope.pw_mismatch = false;

    $scope.form = {
      regForm: {}
    };

    $scope.user_data = {
      'user_name': '',
      'password': '',
      'retype': '',
      'email': '',
    };

    $scope.REG_USER_NAME = CONSTANTS.reg_user_name;

    $scope.pwChanged = function () {
      if ($scope.user_data.password === $scope.user_data.retype) {
        $scope.pw_mismatch = false;
      } else {
        $scope.pw_mismatch = true;
      }
    }

    $scope.register = function () {
      $http({
        url: CONSTANTS.register_url,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          'user': $scope.user_data.user_name,
          'password': Util.encrypt($scope.user_data.password),
          'email': $scope.user_data.email,
        },
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        }
      })
        .success(function (data, status, headers, config) {
          if (data.error) {
            Util.showError(data.message);
          } else {
            var user = {
              name: $scope.user_data.user_name,
              email: $scope.user_data.email,
              token: data.token,
            };
            ConfService.set_current_user(user);
            $ionicHistory.goBack();
          }
        })
        .error(function (data, status, headers, config) {
          Util.showError("注册失败,未知错误");
        });
    }
  }])


  .controller('ForgotPwCtrl', ['$scope', '$http', '$ionicHistory', 'Util', 'ConfService', function ($scope, $http, $ionicHistory, Util, ConfService) {

    $scope.form = {
      forgotForm: {}
    };

    $scope.user_data = {
      'user_name': '',
      'email': '',
    };

    $scope.REG_USER_NAME = CONSTANTS.reg_user_name;

    $scope.send = function () {

      $http({
        url: CONSTANTS.forgot_pw_url,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          'user': $scope.user_data.user_name,
          'email': $scope.user_data.email,
        },
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        }
      })
        .success(function (data, status, headers, config) {
          if (data.error) {
            Util.showError(data.message);
          } else {
            Util.showError(data.message);
            $ionicHistory.goBack();
          }
        })
        .error(function (data, status, headers, config) {
          Util.showError("发送失败,未知错误");
        });
    }
  }])



  .controller('AddCar', ['$scope', 'Car', 'Cars', 'Brand', '$ionicHistory', function($scope, Car, Cars, Brand, $ionicHistory) {
    $scope.form = {
      addCar: {}
    };

    $scope.brands = Brand.all();
    $scope.carInfo = {};

    $scope.saveCarDetail = function($event) {
      var car_bak = {};
      angular.extend(car_bak, $scope.carInfo);
      car_bak.bought_date = car_bak.bought_date.getTime();
      Car.createNew(car_bak, function (car) {
        Cars.add(car);
      });
      $ionicHistory.goBack();
    };

  }])

  .controller('CarDetailCtrl', ['$scope', '$stateParams', 'Cars', '$ionicPopup', '$ionicPopover', 'Popup', 'ServiceItem', '$state', function($scope, $stateParams, Cars, $ionicPopup, $ionicPopover, Popup, ServiceItem, $state) {
    $scope.car = Cars.get($stateParams.car_id);
    $scope.refreshCarService = function() {
      Cars.refresh();
    };

    $scope.changeName = function () {
      $scope.closePopMenu();
      $ionicPopup.show(
        Popup.generateSimpleInput(
          $scope,
          $scope.car.name,
          {
            'required': true,
            'maxlength': 20
          },
          function (oldval, newval) {
            $scope.car.updateDb({'name': newval}, function() {
              $scope.car.name = newval;
            });
          }
        )
      );
    };

    $scope.changePlateNum = function () {
      $scope.closePopMenu();
      $ionicPopup.show(
        Popup.generateSimpleInput(
          $scope,
          $scope.car.plate_num,
          {
            'required': true,
            'maxlength': 10
          },
          function (oldval, newval) {
            $scope.car.updateDb({'plate_num': newval}, function() {
              $scope.car.plate_num = newval;
            });
          }
        )
      );
    };

    $scope.updateMileage = function () {
      $scope.closePopMenu();
      $ionicPopup.show(
        Popup.generateSimpleInput(
          $scope,
          $scope.car.mileage,
          {
            'type': 'number',
            'required': true,
          },
          function (oldval, newval) {
            $scope.car.updateDb({
              'mileage': newval,
              'last_update': new Date().getTime(),
            }, function() {
              $scope.car.mileage = newval;
              $scope.car.last_update = new Date().getTime();
            });
          }
        )
      );
    };

    $scope.addServiceItem = function() {
      $scope.closePopMenu();
      $state.go("tab.car-service-item", {'car_id': $scope.car.id});
    };

    $scope.addServiceRecord = function () {
      $scope.closePopMenu();
      $state.go("tab.service-record", {'car_id': $scope.car.id});
    };

    $scope.goMessageCenter = function () {
      $scope.closePopMenu();
      $state.go("tab.car-msg-center", {'car_id': $scope.car.id});
    }

    $ionicPopover.fromTemplateUrl('popover_menu.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popMenu = popover;
    });

    $scope.showPopMenu = function ($event) {
      $scope.popMenu.show($event);
      //去掉所有的样式
      document.body.classList.remove('platform-iOS');
      document.body.classList.remove('platform-Android');
      //使用ios的样式
      document.body.classList.add('platform-ios');
    }

    $scope.closePopMenu = function() {
      $scope.popMenu.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function() {
      $scope.popMenu.remove();
    });
    // 在隐藏浮动框后执行
    $scope.$on('popMenu.hidden', function() {
      // 执行代码
    });
    // 移除浮动框后执行
    $scope.$on('popMenu.removed', function() {
      // 执行代码
    });

  }])

  .controller('CarServiceItemsCtl', ['$scope', '$stateParams', '$state', 'Cars', 'Util', function($scope, $stateParams, $state, Cars, Util) {
    $scope.car = Cars.get($stateParams.car_id);
    $scope.showDetail = function(item) {
      $state.go("tab.car-service-item", {'car_id': $scope.car.id, 'id': item.id});
    };
    $scope.delete = function (item) {
      for (var i = 0; i < $scope.car.service_records.length; i++) {
        for (var j = 0; j < $scope.car.service_records[i].service_items.length; j++) {
          if ($scope.car.service_records[i].service_items[j].id == item.id) {
            Util.showError("存在该项目的保养记录，不能删除！");
            e.preventDefault();
          }
        }
      }
      item.delete(function() {
        $scope.car.service_items.splice($scope.car.service_items.indexOf(item), 1);
      });
    };
    $scope.addNew = function () {
      $state.go("tab.car-service-item", {'car_id': $scope.car.id});
    }
    $scope.sortServiceItems = function (a) {
      return a.toNextService($scope.car.mileage).status;
    }
  }])

  .controller('CarServiceItemCtl', ['$scope', '$stateParams', '$ionicHistory', 'Cars', 'ServiceItem', function($scope, $stateParams, $ionicHistory, Cars, ServiceItem) {
    $scope.form = {
      editForm: {}
    };
    $scope.car = Cars.get($stateParams.car_id);

    $scope.id = Number($stateParams.id);
    if ($scope.id) {
      for (var i = 0; i < $scope.car.service_items.length; i++) {
        if ($scope.car.service_items[i].id == $scope.id) {
          $scope.item = $scope.car.service_items[i];
        }
      }
    }

    $scope.item_bak = $scope.item ? angular.copy($scope.item) : {};

    $scope.saveCarItem = function () {
      if (!$scope.item_bak.mileage_period) {
        $scope.item_bak.mileage_period = 0;
      }
      if (!$scope.item_bak.time_period) {
        $scope.item_bak.time_period = 0;
      }
      if ($scope.item_bak.id) {
        var changed = {};
        angular.forEach($scope.item_bak, function (val, key) {
          if ($scope.item[key] != val) {
            changed[key] = val;
          }
        });
        if (Object.keys(changed).length > 0) {
          $scope.item.updateDb(changed, function () {
            angular.extend($scope.item, changed);
          });
        }
      } else {
        // add new
        $scope.item_bak.car_id = $scope.car.id;
        ServiceItem.createNew($scope.item_bak, function (item) {
          $scope.item = item;
          $scope.car.service_items.push(item);
        });
      }

      $ionicHistory.goBack();
    }

  }])

  .controller('CarServiceRecordsCtl', ['$scope', '$stateParams', '$ionicPopup', '$state', 'Popup', 'Cars', 'ServiceRecord', function($scope, $stateParams, $ionicPopup, $state, Popup, Cars, ServiceRecord) {
    $scope.car = Cars.get($stateParams.car_id);
    $scope.delete = function (record) {
      record.delete(function() {
        $scope.car.service_records.splice($scope.car.service_records.indexOf(record), 1);

        var refresh_car_item = function (item) {
          for (var i = 0; i < $scope.car.service_items.length; i++) {
            if ($scope.car.service_items[i].id == item.id) {
              $scope.car.service_items[i].refreshLastService();
            }
          }
        }

        for (var i = 0; i < record.service_items.length; i++) {
          refresh_car_item(record.service_items[i]);
        }

      });
    };
    $scope.addNew = function () {
      $state.go("tab.service-record", {'car_id': $scope.car.id});
    };
    $scope.showDetail = function (record) {
      $state.go("tab.service-record", {'car_id': $scope.car.id, 'id': record.id});
    };
  }])

  .controller('RecordDetailCtl', ['$scope', 'ServiceRecord', 'Car', 'Cars', 'Util', '$ionicHistory', '$stateParams', '$filter', '$timeout', function($scope, ServiceRecord, Car, Cars, Util, $ionicHistory, $stateParams, $filter, $timeout) {
    $scope.form = {
      recordDetail: {}
    };

    $scope.car = Cars.get($stateParams.car_id);
    $scope.id = Number($stateParams.id);
    if ($scope.id) {
      for (var i = 0; i < $scope.car.service_records.length; i++) {
        if ($scope.car.service_records[i].id == $scope.id) {
          $scope.record = $scope.car.service_records[i];
        }
      }
    }

    $scope.record_bak = $scope.record ? angular.copy($scope.record) : {};
    $scope.record_bak.finish_date = new Date($scope.record_bak.finish_time);

    $scope.all_service_items = angular.copy($scope.car.service_items);

    var service_items = {};
    if ($scope.record) {
      for (var i = 0; i < $scope.record.service_items.length; i++) {
        service_items[$scope.record.service_items[i].id] = 1;
      }
      for (var i = 0; i < $scope.all_service_items.length; i++) {
        if (service_items[$scope.all_service_items[i].id]) {
          $scope.all_service_items[i].checked = true;
        }
      }
    }

    $scope.saveRecord = function($event) {
      var refresh_car_item = function (item) {
        for (var i = 0; i < $scope.car.service_items.length; i++) {
          if ($scope.car.service_items[i].id == item.id) {
            $scope.car.service_items[i].refreshLastService();
          }
        }
      }
      var update_items = function() {
        for (var i = 0; i < $scope.all_service_items.length; i++) {
          if ($scope.all_service_items[i].checked) {
            if (!$scope.record.getItemByItemId($scope.all_service_items[i].id)) {
              $scope.record.addServiceItem($scope.all_service_items[i].id, refresh_car_item);
            }
          } else {
            $scope.record.removeServiceItem($scope.all_service_items[i].id, refresh_car_item);
          }
        }
      }
      var check_record_mileage = function(mileage, time, record_id) {
        for(var i =0; i < $scope.car.service_records.length; i++) {
          if (!(record_id && $scope.car.service_records[i].id == record_id)) {
            if (($scope.car.service_records[i].finish_time < time && $scope.car.service_records[i].mileage > mileage)
              || ($scope.car.service_records[i].finish_time > time && $scope.car.service_records[i].mileage < mileage)) {
              return {
                error: true,
                message: '您的输入与历史记录矛盾<br/>'
                + $filter('date')(time, "yyyy-MM-dd", "GMT+8") + ' ' + mileage + 'KM<br/>'
                + $filter('date')($scope.car.service_records[i].finish_time, "yyyy-MM-dd", "GMT+8") + ' ' + $scope.car.service_records[i].mileage + 'KM',
              };
            }
          }
        }
        return {error: false};
      };

      if ($scope.record_bak.id) {
        // modify
        var change = {};
        if ($scope.record_bak.finish_date.getTime() != $scope.record_bak.finish_time) {
          change['finish_time'] = $scope.record_bak.finish_date.getTime();
        }
        if ($scope.record_bak.mileage != $scope.record.mileage) {
          change['mileage'] = $scope.record_bak.mileage;
        }
        if ($scope.record_bak.service_store != $scope.record.service_store) {
          change['service_store'] = $scope.record_bak.service_store;
        }
        if ($scope.record_bak.remark != $scope.record.remark) {
          change['remark'] = $scope.record_bak.remark;
        }
        if (Object.keys(change).length > 0) {
          var check_res = check_record_mileage(change.mileage ? change.mileage : $scope.record.mileage, change.finish_time ? change.finish_time : $scope.record.finish_time, $scope.record.id);
          if (check_res.error) {
            Util.showError(check_res.message);
            $event.preventDefault();
            return;
          }
          $scope.record.updateDb(change, function () {
            angular.extend($scope.record, change);
            update_items();
            if (change.finish_time || change.mileage) {
              for (var i = 0; i < $scope.record.service_items.length; i++) {
                refresh_car_item($scope.record.service_items[i]);
              }
            }
          });
        } else {
          update_items();
        }
      } else {
        // add new
        $scope.record_bak.finish_time = $scope.record_bak.finish_date.getTime();
        var check_res = check_record_mileage($scope.record_bak.mileage, $scope.record_bak.finish_time);
        if (check_res.error) {
          Util.showError(check_res.message);
          $event.preventDefault();
          return;
        }
        delete $scope.record_bak.finish_date;
        $scope.record_bak.car_id = $scope.car.id;
        ServiceRecord.createNew($scope.record_bak, function (record) {
          $scope.record = record;
          $scope.car.service_records.push(record);
          update_items()
        });
      }

      $ionicHistory.goBack();
    };
  }])

  .controller('MessageCenter', ['$scope', 'Cars', '$stateParams', function ($scope, Cars, $stateParams) {
    $scope.car = Cars.get($stateParams.car_id);
    $scope.messages = [];

    if ($scope.car.lastUpdateDays() > 10) {
      $scope.messages.push({
        title: '更新里程数据',
        message: '您有超过10天没有更新爱车的里程数据了',
      });
    }
    var needsServiceItemCount = $scope.car.needsServiceItemCount();
    if (needsServiceItemCount > 0) {
      $scope.messages.push({
        title: '需要保养',
        message: '您的爱车有[' + needsServiceItemCount + ']个保养项目需要或即将需要保养',
      });
    }

    if ($scope.messages.length < 1) {
      $scope.messages.push({
        title: '汽车状态良好',
        message: '暂时没有需要注意的提醒事项，请继续保持',
      });
    }
  }])

  .controller('ConfigCtrl', ['$scope', 'ConfService', '$http', '$ionicHistory', function($scope, ConfService, $http, $ionicHistory) {
    $scope.settings = {
      notify_period: ConfService.get_conf_data.notify_period,
      am_user: ConfService.get_current_user,
    };

    $scope.getUserHref = function () {
      if ($scope.settings.am_user.user) {
        return '#/tab/config/current-user';
      } else {
        return '#/tab/main';
      }
    };

    $scope.getUserText = function () {
      return $scope.settings.am_user.user ? $scope.settings.am_user.user : '未登录';
    };

    $scope.getUserPic = function () {
      return ($scope.settings.am_user.user && $scope.settings.am_user.gender === '1')
        ? 'img/photos/female.jpg'
        : 'img/photos/male.jpg';
    }
    $scope.getUserPicClass = function () {
      return $scope.settings.am_user.user ? "" : "off_line_head";
    }

    // 提醒周期
    $scope.notify_period_items = {
      day: '天',
      week: '周',
    };
    $scope.notifyPeriodChanged = function (new_val) {
      ConfService.set_notify_period(new_val);
    };
    // 提醒周期

    $scope.bootStrapDb = function () {
      $http({
        url: CONSTANTS.db_bootstrap_url,
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });

    }

    $scope.logout = function () {
      ConfService.set_current_user({});
    };

  }])


  .controller('CurrentUserCtrl', ['$scope', 'ConfService', '$ionicHistory', '$http', 'Util', function($scope, ConfService, $ionicHistory, $http, Util) {
    $scope.user_data = ConfService.get_current_user;

    $scope.getUserText = function () {
      return $scope.user_data.user ? $scope.user_data.user : '';
    };
    $scope.getUserEmail = function () {
      return $scope.user_data.email ? $scope.user_data.email : '';
    };
    $scope.genders = {
      0: '男',
      1: '女',
    };
    $scope.save = function () {
      var args = {};
      args['db_op_type'] = 'update';
      args['db_op_table_name'] = 'am_user';
      args['id'] = $scope.user_data.id;
      args['gender'] = $scope.user_data.gender;

      $http({
        url: CONSTANTS.db_operator_url,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: args,
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
      })
        .success(function (data, status, headers, config) {
          if (data.error) {
            Util.showError("更新失败!");
          } else {
            ConfService.set_current_user_gender($scope.user_data.gender);
            Util.showError("更新成功");

          }

        }.bind(this))
        .error(function (data, status, headers, config) {
          Util.showError("更新失败, 请检查网络!");
        });
    }
  }])

  .controller('AboutCtrl', ['$scope', function($scope) {
  }])

;
