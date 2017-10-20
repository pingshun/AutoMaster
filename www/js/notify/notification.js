/**
 * Created by pge on 16/9/3.
 */
angular.module('car.notify', ['car.db_class', 'ngStorage'])
  .service('Notification', ['$rootScope', '$cordovaLocalNotification', 'Cars', '$localStorage', '$filter', function ($rootScope, $cordovaLocalNotification, Cars, $localStorage, $filter) {
    function Notification() {};
    Notification.query = function () {
      $cordovaLocalNotification.getAll().then(function(as) {
        if (as) {

          for (var i = 0; i < as.length; i++) {
            var str = as[i].id + ' ' + as[i].text + ' ' + ($filter('date')(as[i].at * 1000, "yyyy-MM-dd HH:mm:ss", "GMT+8"));
            alert(str);
          }
        } else {
          alert("not found");
        }
      });
    };

    Notification.refresh = function () {
      if (!window.cordova) {
        console.log('window.cordova is null, maybe running in browser');
        return;
      }

      if (!window.cordova.plugins) {
        console.log('window.cordova.plugins is null');
        return;
      }

      var cars = Cars.all();

      if (cars.length > 0) {

        var service_notify = '';

        var notify_period = $localStorage.notify_period;
        var period = notify_period === 'week' ? 7 : 1;
        var global_next_warn_days = 65536;
        var next_notify_days;
        for (var i = 0; i < cars.length; i++) {
          var next_warn_days = -(cars[i].lastUpdateDays() - CONSTANTS.days_for_warn_update_mileage);
          global_next_warn_days = Math.min(next_warn_days, global_next_warn_days);
          if (cars[i].needsServiceItemCount() > 0) {
            service_notify += (service_notify === '' ? cars[i].name : (', ' + cars[i].name));
          }
        }
        next_notify_days = Math.max(period, global_next_warn_days);

        var time = new Date();
        time.setHours(12);
        time.setMinutes(0);
        time.setSeconds(1);

        var notify_time = time.getTime() + next_notify_days * 24 * 60 * 60 * 1000;
        var notify_data = {
          id: CONSTANTS.update_notification_id,
          title: 'Title here',
          text: "您的爱车里程数据太旧,快去更新一下吧.",
          at: notify_time,
          every: notify_period,
          badge: 1,

        };
        $cordovaLocalNotification.get(CONSTANTS.update_notification_id).then(function (notification) {
          if (notification) {
            $cordovaLocalNotification.update(notify_data);
          } else {
            $cordovaLocalNotification.schedule(notify_data);
          }
        });

        $cordovaLocalNotification.get(CONSTANTS.service_notification_id).then(function (notification) {

          var notify_message = '您的爱车:' + service_notify + '需要或即将需要保养!';
          var time = new Date();
          time.setHours(12);
          time.setMinutes(0);
          time.setSeconds(0);
          var notify_time = time.getTime() + period * 24 * 60 * 60 * 1000;

          notify_data = {
            id: CONSTANTS.service_notification_id,
            title: 'Title here',
            text: notify_message,
            at: notify_time,
            every: notify_period,
            badge: 1,
          };

          if (notification) {
            if (service_notify === '') {
              $cordovaLocalNotification.cancel(CONSTANTS.service_notification_id);
            } else {
              $cordovaLocalNotification.update(notify_data);
            }
          } else {
            if (service_notify !== '') {
              $cordovaLocalNotification.schedule(notify_data);
            }
          }
        });
      } else {
        $cordovaLocalNotification.cancel([CONSTANTS.update_notification_id, CONSTANTS.service_notification_id]);
      }

    };

    return Notification;
  }])
