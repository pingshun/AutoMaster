/**
 * Created by pge on 16/8/5.
 */
angular.module('util', ['util.popup'])

  .factory('Util', ['Popup', '$ionicPopup', '$timeout', '$http', function(Popup, $ionicPopup, $timeout, $http) {
    return {
      generateGuid: function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      },
      inherit: function(child, base) {
        angular.extend(child.prototype, new base());
        angular.extend(child, base);
      },
      httpPost: function (url, data, fn_success, fn_error) {
        $http({
          url: url,
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
          },
        })
          .success(fn_success)
          .error(fn_error);
      },
      showError: function (error) {
        var popup = $ionicPopup.show(Popup.generateError(error));
        /*$timeout(function () {
          popup.close();
        }, 3000);*/
      },
      encrypt: function(str) {
        var pwd = CONSTANTS.app_en_name;
        var prand = "";
        for(var i=0; i<pwd.length; i++) {
          prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        var incr = Math.ceil(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        if(mult < 2) {
          alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
          return null;
        }
        var salt = Math.round(Math.random() * 1000000000) % 100000000;
        prand += salt;
        while(prand.length > 10) {
          prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for(var i=0; i<str.length; i++) {
          enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
          if(enc_chr < 16) {
            enc_str += "0" + enc_chr.toString(16);
          } else enc_str += enc_chr.toString(16);
          prand = (mult * prand + incr) % modu;
        }
        salt = salt.toString(16);
        while(salt.length < 8)salt = "0" + salt;
        enc_str += salt;
        return enc_str;
      },

      decrypt: function(str) {
        if(str == null || str.length < 8) {
          alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
          return;
        }
        var pwd = CONSTANTS.app_en_name;
        var prand = "";
        for(var i=0; i<pwd.length; i++) {
          prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        var incr = Math.round(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        var salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while(prand.length > 10) {
          prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for(var i=0; i<str.length; i+=2) {
          enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
          enc_str += String.fromCharCode(enc_chr);
          prand = (mult * prand + incr) % modu;
        }
        return enc_str;
      },

      getPosition: function(cb) {
        //开始获取定位数据
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            //坐标转换
            //手机定位的一个坐标值，用于测试
            // lat: 39.93178024602113
            // lng: 116.4524117588692
            var url = 'http://restapi.amap.com/v3/assistant/coordinate/convert?coordsys=gps&output=json';
            url += "&key=09b83b700b31b92f2c0c28cb9a7fff36";
            url += "&locations=" + lng + "," + lat;
            $http({
              url: url,
              method: "GET",
            })
              .success(function (data, status, headers, config) {
                if (data.status) {
                  var location = data.locations;
                  var arr_location = location.split(',');
                  var current_lng = arr_location[0];
                  var current_lat = arr_location[1];
                  if (cb) {
                    cb(current_lng, current_lat);
                  }
                } else {
                  $ionicPopup.show(Popup.generateError("坐标转换失败!"));
                }
              })
              .error(function(data, status, headers, config) {
                $ionicPopup.show(Popup.generateError("坐标转换失败!"));
              });

          },
          function(err) {
            // error
            console.log(err);
            $ionicPopup.show(Popup.generateError("获取位置信息失败!"));
          }
        );
      },
    };
  }]);
