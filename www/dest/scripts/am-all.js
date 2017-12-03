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

    .state('tab.about', {
      url: '/config/about',
      views: {
        'tab-config': {
          templateUrl: 'templates/config/about.html',
          controller: 'AboutCtrl'
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

angular.module('car.controllers', [])
  .controller('AroundCtrl', ['$scope', 'Util', function($scope, Util) {
    angular.element(document).ready(function () {
      $scope.loadMap();
    });

    $scope.show_config = false;

    $scope.search_key = '';

    $scope.search_radius = 1;
    $scope.search_radius_opts = [0.5, 1, 2, 5, 10];

    $scope.search_type = '汽车维修';
    $scope.search_type_opts = ['汽车服务', '汽车销售', '汽车维修', '摩托车服务'];

    $scope.position_info = {};


    $scope.show_search = function () {
      $scope.show_config = !$scope.show_config;
    }

    $scope.refresh = function () {
      $scope.show_config = !$scope.show_config;
      $scope.map.clearMap();

      Util.getPosition(function (current_lng, current_lat) {
        $scope.map.panTo(new AMap.LngLat(current_lng, current_lat));
        $scope.position_info.lng = current_lng;
        $scope.position_info.lat = current_lat
        $scope.refreshAround();
      });
    }

    $scope.loadMap = function() {
      $scope.map = new AMap.Map('map_container', {
        resizeEnable: true,
        zoom: 15,
      });
      $scope.map.plugin(['AMap.ToolBar'], function(){
        $scope.map.addControl(new AMap.ToolBar());
      });

      var trafficLayer = new AMap.TileLayer.Traffic();
      trafficLayer.setMap($scope.map);

      $scope.drivingMap = new AMap.Driving({
        map: $scope.map,
      });

      $scope.map.on('click', function(e) {
        $scope.closeInfoWindow();
        $scope.drivingMap.clear();
        $scope.selected_poi = null;
      });

      Util.getPosition(function (current_lng, current_lat) {
        $scope.map.panTo(new AMap.LngLat(current_lng, current_lat));
        $scope.position_info.lng = current_lng;
        $scope.position_info.lat = current_lat
        $scope.refreshAround();
      });
    }

    $scope.refreshAround = function () {
      AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
          pageSize: 50,
          type: $scope.search_type,
        });

        var cpoint = [$scope.position_info.lng, $scope.position_info.lat]; //中心点坐标
        placeSearch.searchNearBy($scope.search_key, cpoint, ($scope.search_radius * 1000), function(status, result) {
          console.log(result);
          if (result.info === 'OK') {
            $scope.addPois(result.poiList.pois);
          }
        });
      });
    }

    $scope.addPois = function(pois) {
      for (var i = 0; i < pois.length; i++) {
        (function(i) {
          var marker = new AMap.Marker({
            map: $scope.map,
            position: pois[i].location,
          });
          marker.poi_info = pois[i];
          //鼠标点击marker弹出自定义的信息窗体
          AMap.event.addListener(marker, 'click', function() {
            $scope.selected_poi = marker.poi_info;
            $scope.getInfoWindow(pois[i]).open($scope.map, marker.getPosition());
          });
        })(i);
      }
    }

    $scope.getInfoWindow = function (poi) {
      //实例化信息窗体
      var title = poi.name,
        content = [];
      content.push("地址：" + poi.address);
      content.push("电话：" + poi.tel);

      //构建自定义信息窗体
      var createInfoWindow = function(title, content) {
        var info = document.createElement("div");
        info.className = "map_info_window";

        //可以通过下面的方式修改自定义窗体的宽高
        info.style.width = "260px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "map-info-top";
        titleD.innerHTML = title;
        closeX.src = "img/around/close.gif";
        closeX.onclick = $scope.closeInfoWindow;

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "map-info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        var button= document.createElement("input");
        button.type = "submit";
        button.value = '到这里'
        button.onclick = $scope.directToHere;
        middle.appendChild(button);
        info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "map-info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "img/around/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
      }

      var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title, content.join("<br/>")),
        offset: new AMap.Pixel(16, -45)
      });

      return infoWindow;
    }

    $scope.directToHere = function () {
      if ($scope.selected_poi) {
        $scope.drivingMap.search(
          //new AMap.LngLat($scope.position_info.position.getLng(), $scope.position_info.position.getLat()),
          new AMap.LngLat($scope.position_info.lng, $scope.position_info.lat),
          new AMap.LngLat($scope.selected_poi.location.getLng(), $scope.selected_poi.location.getLat())
        );
      }
    }

    $scope.closeInfoWindow = function () {
      $scope.map.clearInfoWindow();
    }
  }])

/**
 * Created by pge on 16/8/25.
 */

var am_server = 'http://am.emontech.cn';
//var am_server = 'http://127.0.0.1:3002';
var CONSTANTS = {
  app_en_name: 'auto_master',
  version: '0.1.0',
  is_dev: 1,
  days_for_warn_update_mileage: 10,
  days_for_alert_update_mileage: 15,

  update_notification_id: 1,
  service_notification_id: 2,

  backup_url: am_server + '/api/am_backup',
  login_url: am_server + '/api/login',
  register_url: am_server + '/api/user/register',
  forgot_pw_url: am_server + '/api/user/forgot_pw',
  db_operator_url: am_server + '/api/am_db_operator',
  db_bootstrap_url: am_server + '/api/am_db_bootstrap',
  get_cars: am_server + '/api/get_cars',
  url_api_add_car: am_server + '/api/add_car',

  login_status_not_login: -1,
  login_status_login_error: 0,
  login_status_login_done: 1,

  reg_user_name: /^[a-zA-Z0-9_/-]*$/,


  brands: {
      1: {id: 1,              name: "aston-martin",           pinyin: "asidunmading",             chinese_name: "阿斯顿马丁"},
      2: {id: 2,              name: "audi",                   pinyin: "aodi",                     chinese_name: "奥迪"},
      3: {id: 3,              name: "Alfa-Romeo",             pinyin: "aerfaluomiou",             chinese_name: "阿尔法·罗密欧"},
      4: {id: 4,              name: "baojun",                 pinyin: "baojun",                   chinese_name: "宝骏"},
      5: {id: 5,              name: "baw",                    pinyin: "beiqi",                    chinese_name: "北汽",},
      6: {id: 6,              name: "beijingqiche",           pinyin: "beijingqiche",             chinese_name: "北京汽车"},
      7: {id: 7,              name: "benten",                 pinyin: "benteng",                  chinese_name: "奔腾"},
      8: {id: 8,              name: "bentley",                pinyin: "binli",                    chinese_name: "宾利"},
      9: {id: 9,              name: "benz",                   pinyin: "benchi",                   chinese_name: "奔驰"},
      10: {id: 10,            name: "bmw",                    pinyin: "baoma",                    chinese_name: "宝马"},
      11: {id: 11,            name: "bugatti",                pinyin: "bujiadi",                  chinese_name: "布加迪"},
      12: {id: 12,            name: "buick8060",              pinyin: "bieke",                    chinese_name: "别克"},
      13: {id: 13,            name: "byd",                    pinyin: "biyadi",                   chinese_name: "比亚迪"},
      14: {id: 14,            name: "cadillac",               pinyin: "kaidilake",                chinese_name: "凯迪拉克"},
      15: {id: 15,            name: "chaanjiaoche",           pinyin: "changan",                  chinese_name: "长安"},
      16: {id: 16,            name: "changanshangyong",       pinyin: "changanshangyong",         chinese_name: "长安商用"},
      17: {id: 17,            name: "changhe",                pinyin: "changhe",                  chinese_name: "昌河"},
      18: {id: 18,            name: "chery",                  pinyin: "qirui",                    chinese_name: "奇瑞"},
      19: {id: 19,            name: "chevrolet",              pinyin: "xufulan",                  chinese_name: "雪佛兰"},
      20: {id: 20,            name: "chrysler",               pinyin: "kelaisile",                chinese_name: "克莱斯勒"},
      21: {id: 21,            name: "citroen",                pinyin: "xuetielong",               chinese_name: "雪铁龙"},
      22: {id: 22,            name: "dihao",                  pinyin: "dihao",                    chinese_name: "帝豪"},
      23: {id: 23,            name: "dodge",                  pinyin: "daoqi",                    chinese_name: "道奇"},
      24: {id: 24,            name: "dongfeng",               pinyin: "dongfeng",                 chinese_name: "东风"},
      25: {id: 25,            name: "ds",                     pinyin: "ds",                       chinese_name: "DS"},
      26: {id: 26,            name: "ferrari",                pinyin: "falali",                   chinese_name: "法拉利"},
      27: {id: 27,            name: "fiat",                   pinyin: "feiyate",                  chinese_name: "菲亚特"},
      28: {id: 28,            name: "ford",                   pinyin: "fute",                     chinese_name: "福特"},
      29: {id: 29,            name: "fudi",                   pinyin: "fudi",                     chinese_name: "福迪"},
      30: {id: 30,            name: "futian",                 pinyin: "futian",                   chinese_name: "福田"},
      31: {id: 31,            name: "geely",                  pinyin: "jili",                     chinese_name: "吉利"},
      32: {id: 32,            name: "gmc",                    pinyin: "gmc",                      chinese_name: "GMC"},
      33: {id: 33,            name: "greatwall",              pinyin: "changcheng",               chinese_name: "长城"},
      34: {id: 34,            name: "guanzhi",                pinyin: "guanzhi",                  chinese_name: "观致"},
      35: {id: 35,            name: "guanggang",              pinyin: "guanggang",                chinese_name: "光冈"},
      36: {id: 36,            name: "guangqi",                pinyin: "guangqi",                  chinese_name: "广汽"},
      37: {id: 37,            name: "hafei",                  pinyin: "hafei",                    chinese_name: "哈飞"},
      38: {id: 38,            name: "haima",                  pinyin: "haima",                    chinese_name: "海马"},
      39: {id: 39,            name: "haimashangyong",         pinyin: "haimazhengzhou",           chinese_name: "海马郑州"},
      40: {id: 40,            name: "heibao",                 pinyin: "heibao",                   chinese_name: "黑豹"},
      41: {id: 41,            name: "honda",                  pinyin: "bentian",                  chinese_name: "本田"},
      42: {id: 42,            name: "hongqi",                 pinyin: "hongqi",                   chinese_name: "红旗"},
      43: {id: 43,            name: "huanghai",               pinyin: "huanghai",                 chinese_name: "黄海"},
      44: {id: 44,            name: "huapu",                  pinyin: "huapu",                    chinese_name: "华普"},
      45: {id: 45,            name: "huatai",                 pinyin: "huatai",                   chinese_name: "华泰"},
      46: {id: 46,            name: "huizong",                pinyin: "huizhong",                 chinese_name: "汇众"},
      47: {id: 47,            name: "hummer",                 pinyin: "hanma",                    chinese_name: "悍马"},
      48: {id: 48,            name: "hyundai",                pinyin: "xiantai",                  chinese_name: "现代"},
      49: {id: 49,            name: "infiniti",               pinyin: "yingfeinidi",              chinese_name: "英菲尼迪"},
      50: {id: 50,            name: "iveco",                  pinyin: "yiweike",                  chinese_name: "依维柯"},
      51: {id: 51,            name: "ja8060",                 pinyin: "jiao",                     chinese_name: "吉奥"},
      52: {id: 52,            name: "jac",                    pinyin: "jianghuai",                chinese_name: "江淮"},
      53: {id: 53,            name: "jaguar",                 pinyin: "jiebao",                   chinese_name: "捷豹"},
      54: {id: 54,            name: "jeep",                   pinyin: "jipu",                     chinese_name: "吉普"},
      55: {id: 55,            name: "jinbei",                 pinyin: "jinbei",                   chinese_name: "金杯"},
      56: {id: 56,            name: "jiangling",              pinyin: "jiangling",                chinese_name: "江铃"},
      57: {id: 57,            name: "jiangnan",               pinyin: "jiangnan",                 chinese_name: "江南"},
      58: {id: 58,            name: "jinlonglianhe",          pinyin: "jinlong",                  chinese_name: "金龙"},
      59: {id: 59,            name: "jiulong",                pinyin: "jiulong",                  chinese_name: "九龙"},
      60: {id: 60,            name: "karry",                  pinyin: "kairui",                   chinese_name: "开瑞"},
      61: {id: 61,            name: "kia",                    pinyin: "qiya",                     chinese_name: "起亚"},
      62: {id: 62,            name: "koenigsegg",             pinyin: "kenisaige",                chinese_name: "柯尼塞格"},
      63: {id: 63,            name: "lamborghini",            pinyin: "lanbojini",                chinese_name: "兰博基尼"},
      64: {id: 64,            name: "landrover",              pinyin: "luhu",                     chinese_name: "路虎"},
      65: {id: 65,            name: "lexus",                  pinyin: "leikesasi",                chinese_name: "雷克萨斯"},
      66: {id: 66,            name: "lifan",                  pinyin: "lifan",                    chinese_name: "力帆"},
      67: {id: 67,            name: "lincoln",                pinyin: "linken",                   chinese_name: "林肯"},
      68: {id: 68,            name: "ln",                     pinyin: "linian",                   chinese_name: "理念"},
      69: {id: 69,            name: "lorinser",               pinyin: "laolunshi",                chinese_name: "劳伦士"},
      70: {id: 70,            name: "lotus-motor",            pinyin: "lianhua",                  chinese_name: "莲花"},
      71: {id: 71,            name: "lotus8060",              pinyin: "lutesi",                   chinese_name: "路特斯"},
      72: {id: 72,            name: "lufeng",                 pinyin: "lufeng",                   chinese_name: "陆风"},
      73: {id: 73,            name: "maserati",               pinyin: "mashaladi",                chinese_name: "玛莎拉蒂"},
      74: {id: 74,            name: "maybach",                pinyin: "maibahe",                  chinese_name: "迈巴赫"},
      75: {id: 75,            name: "mazda",                  pinyin: "mazida",                   chinese_name: "马自达"},
      76: {id: 76,            name: "mg",                     pinyin: "mg",                       chinese_name: "MG"},
      77: {id: 77,            name: "mini",                   pinyin: "mini",                     chinese_name: "MINI"},
      78: {id: 78,            name: "mitsubishi",             pinyin: "sanling",                  chinese_name: "三菱"},
      79: {id: 79,            name: "nazhijie8060",           pinyin: "nazhijie",                 chinese_name: "纳智捷"},
      80: {id: 80,            name: "nissan",                 pinyin: "richan",                   chinese_name: "日产"},
      81: {id: 81,            name: "opel",                   pinyin: "oubao",                    chinese_name: "欧宝"},
      82: {id: 82,            name: "acura",                  pinyin: "ouge",                     chinese_name: "讴歌"},
      83: {id: 83,            name: "pagani",                 pinyin: "pajiani",                  chinese_name: "帕加尼"},
      84: {id: 84,            name: "peugeot",                pinyin: "biaozhi",                  chinese_name: "标致"},
      85: {id: 85,            name: "porsche",                pinyin: "baoshijie",                chinese_name: "保时捷"},
      86: {id: 86,            name: "qingling",               pinyin: "qingling",                 chinese_name: "庆铃"},
      87: {id: 87,            name: "quanqiuying",            pinyin: "quanqiuying",              chinese_name: "全球鹰"},
      88: {id: 88,            name: "renault",                pinyin: "leinuo",                   chinese_name: "雷诺"},
      89: {id: 89,            name: "riich",                  pinyin: "ruiqi",                    chinese_name: "瑞麒"},
      90: {id: 90,            name: "roewe",                  pinyin: "rongwei",                  chinese_name: "荣威"},
      91: {id: 91,            name: "rolls-royce",            pinyin: "laosilaisi",               chinese_name: "劳斯莱斯"},
      92: {id: 92,            name: "rossion",                pinyin: "rossion",                  chinese_name: "Rossion"},
      93: {id: 93,            name: "ruilink",                pinyin: "weiqi",                    chinese_name: "威麟"},
      94: {id: 94,            name: "saab",                   pinyin: "sabo",                     chinese_name: "萨博"},
      95: {id: 95,            name: "seat8060",               pinyin: "xiyate",                   chinese_name: "西亚特"},
      96: {id: 96,            name: "shuanghuan",             pinyin: "shuanghuan",               chinese_name: "双环"},
      97: {id: 97,            name: "shuanglong",             pinyin: "shuanglong",               chinese_name: "双龙"},
      98: {id: 98,            name: "skoda8060",              pinyin: "sikeda",                   chinese_name: "斯柯达"},
      99: {id: 99,            name: "smart",                  pinyin: "simate",                   chinese_name: "Smart"},
      100: {id: 100,          name: "soueast-motor",          pinyin: "dongnan",                  chinese_name: "东南"},
      101: {id: 101,          name: "spykers",                pinyin: "shijue",                   chinese_name: "世爵"},
      102: {id: 102,          name: "subaru",                 pinyin: "sibalu",                   chinese_name: "斯巴鲁"},
      103: {id: 103,          name: "suzuki",                 pinyin: "lingmu",                   chinese_name: "铃木"},
      104: {id: 104,          name: "tesla",                  pinyin: "tesila",                   chinese_name: "特斯拉"},
      105: {id: 105,          name: "toyota",                 pinyin: "fengtian",                 chinese_name: "丰田"},
      106: {id: 106,          name: "ufo",                    pinyin: "yongyuan",                 chinese_name: "永源"},
      107: {id: 107,          name: "volkswagen",             pinyin: "dazhong",                  chinese_name: "大众"},
      108: {id: 108,          name: "volvo",                  pinyin: "woerwo",                   chinese_name: "沃尔沃"},
      109: {id: 109,          name: "wuling",                 pinyin: "wuling",                   chinese_name: "五菱"},
      110: {id: 110,          name: "wushiling",              pinyin: "wushiling",                chinese_name: "五十铃"},
      111: {id: 111,          name: "wey",                    pinyin: "wey",                      chinese_name: "WEY"},
      112: {id: 112,          name: "ww8060",                 pinyin: "weiwang",                  chinese_name: "威旺"},
      113: {id: 113,          name: "xinyatu",                pinyin: "nanqi",                    chinese_name: "南汽"},
      114: {id: 114,          name: "yinglun",                pinyin: "yinglun",                  chinese_name: "英伦汽车"},
      115: {id: 115,          name: "yiqi",                   pinyin: "yiqi",                     chinese_name: "一汽"},
      116: {id: 116,          name: "zhonghua",               pinyin: "zhonghua",                 chinese_name: "中华"},
      117: {id: 117,          name: "zhongou",                pinyin: "zhongou",                  chinese_name: "中欧"},
      118: {id: 118,          name: "zhongtai8060",           pinyin: "zhongtai",                 chinese_name: "众泰"},
      119: {id: 119,          name: "zhongxing",              pinyin: "zhongxing",                chinese_name: "中兴"},
      120: {id: 120,          name: "ziyoufeng",              pinyin: "ziyoufeng",                chinese_name: "自由风"}
    },
};

angular.module('car.controllers')

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

    $scope.confirm = function () {
      var confirm_text = "请确认电子邮件:<br\>" + $scope.user_data.email + "<br\>(电子邮件用于密码找回，请勿乱填!)";
      Util.showConfirm(confirm_text, function (res) {
        if (res) {
          $scope.register();
        }
      })
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

    // Object.values doesn't work when deploy to an iPhone
    var allBrands = [];
    angular.forEach(Brand.all(), function (value, key) {
      allBrands.push(value);
    });
    allBrands.sort(
      function compareFunction(param1,param2){
        return param1.pinyin.localeCompare(param2.pinyin);
      }
    );
    $scope.brands = allBrands;
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

/**
 * Created by pge on 16/8/11.
 */
angular.module('car.db_class', ['util'])

  // Base class of Table Row Classes
  .factory('TableRowBase', ['$http', '$rootScope', function($http, $rootScope) {
    function TableRowBase() {
      this.setData = function(data) {
        angular.extend(this, data);
      };

      this.postCreate = function() {};
      this.preUpdate = function() {};
      this.postUpdate = function() {};
      this.updateDb = function(args, cb_success) {
        this.preUpdate(args);
        if (!args || Object.keys(args).length < 1) return;

        args['db_op_type'] = 'update';
        args['db_op_table_name'] = this.constructor._table_name;
        args['id'] = this.id;

        var old_values = {};
        angular.forEach(args, function(value, key) {
          old_values[key] = this[key];
        }.bind(this));

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
              console.debug('failed update data on server');
            } else {
              angular.extend(this, args);
              this.postUpdate(args, old_values);
              if (cb_success) {
                cb_success(this, old_values);
              }
            }

          }.bind(this))
          .error(function (data, status, headers, config) {
            console.debug('error');
          });
      };

      this.preDelete = function () {};
      this.postDelete = function () {};

      this.delete = function(cb_success) {
        this.preDelete();
        var args = {
          db_op_type: 'delete',
          db_op_table_name: this.constructor._table_name,
          id: this.id,
        };

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
              console.debug('failed delete from server');
            } else {
              this.postDelete();
              if (cb_success) {
                cb_success();
              }
            }

          }.bind(this))
          .error(function (data, status, headers, config) {
            console.debug('error');
          });
      }

    };

    TableRowBase.preCreate = function() {};
    TableRowBase.createNew = function(args, cb_success) {
      this.preCreate(args);
      if (!args || (args && Object.keys(args).length < 1)) {
        return;
      }

      args['db_op_type'] = 'create';
      args['db_op_table_name'] = this._table_name;

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
            console.debug('failed get data from server');
          } else {
            this.getById(data.insertId, function(obj) {
              obj.postCreate();
              if (cb_success) {
                cb_success(obj);
              }
            });
          }

        }.bind(this))
        .error(function (data, status, headers, config) {
          console.debug('error');
        });
    };

    TableRowBase.getFromServerData = function (data) {
      return new this(data);
    }

    TableRowBase.getById = function (id, cb_success) {
      this.getsByFields({'id': id,}, function (arr_data) {
        if (arr_data.length > 1) {
          console.error("Get multiple objects by id [table_name: " + this._table_name + ", id: " + id + "]");
          if (cb_success) {
            cb_success(null);
          }
        } else {
          if (cb_success) {
            cb_success(arr_data.length > 0 ? arr_data[0] : null);
          }
        }
      }.bind(this));
    }

    TableRowBase.getsAll = function (cb_success) {
      this.getsByFields({}, function (arr_data) {
        if (cb_success) {
          cb_success(arr_data);
        }
      }.bind(this));
    }

    TableRowBase.getsByFields = function (fields, cb_success) {

      fields['db_op_type'] = 'query';
      fields['db_op_table_name'] = this._table_name;

      $http({
        url: CONSTANTS.db_operator_url,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: fields,
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
            var objs = [];
            data.forEach(function (e) {
              var obj = new this(e);
              objs.push(obj);
            }.bind(this));
            if (cb_success) {
              cb_success(objs);
            }
          }

        }.bind(this))
        .error(function (data, status, headers, config) {
          console.debug('error');
          return;
        });

    }

    return TableRowBase;
  }])

  .factory('Car', ['$q', 'Util', 'Brand', 'TableRowBase', 'ServiceItem', 'ServiceRecord', function($q, Util, Brand, TableRowBase, ServiceItem, ServiceRecord) {
    function Car(carData) {
      if (carData) {
        this.setData(carData);
      }
      this.service_items = [];
      this.service_records = [];

    };

    Util.inherit(Car, TableRowBase);
    Car._table_name = 'car';


    Car.getFromServerData = function(dbData) {

      var itemData = dbData['service_items'];
      delete dbData['service_items'];
      var recordData = dbData['service_records'];
      delete dbData['service_records'];
      var car = new this(dbData);

      var id2items = {};
      angular.forEach(itemData, function(item) {
        var service_item = ServiceItem.getFromServerData(item);
        car['service_items'].push(service_item);
        id2items[service_item.id] = service_item;
      });
      angular.forEach(recordData, function (record) {
        var items = record['service_items'];
        delete record['service_items'];
        var service_record = ServiceRecord.getFromServerData(record);
        service_record.service_items = [];
        angular.forEach(items, function (item) {
          service_record.service_items.push(id2items[item.item_id]);
        })
        car['service_records'].push(service_record);
      });

      return car;
    };



    Car.prototype.refreshServiceItems = function (cb) {
      this.service_items = [];
      ServiceItem.getsByCar(this.id, function (items) {
        items.reduce(function (arr, item) {
          arr.push(item);
          return arr;
        }.bind(this), this.service_items);
        cb(this.service_items);
      }.bind(this));
    }
    Car.prototype.refreshServiceRecords = function (cb) {
      this.service_records = [];
      ServiceRecord.getsByCar(this.id, function (records) {
        records.reduce(function (arr, record) {
          arr.push(record);
          return arr;
        }.bind(this), this.service_records);
        cb(this.service_records);
      }.bind(this));
    }


    Car.preCreate = function (args) {
      if (!args.guid) {
        args.guid = Util.generateGuid();
      }
      if (!args.add_time) {
        args.add_time = new Date().getTime();
      }
      if (!args.mileage) {
        args.mileage = 0;
      }
      if (!args.last_update) {
        args.last_update = new Date().getTime();
      }
    }
    Car.createNew = function (args, cb) {
      this.preCreate(args);
      if (!args || (args && Object.keys(args).length < 1)) {
        return;
      }

      Util.httpPost(CONSTANTS.url_api_add_car, args,
        function (data, status, headers, config) {
          if (data.error) {
            console.debug('failed add car to server');
          } else {
            var car = this.getFromServerData(data);
            if(cb) {
              cb(car);
            }
          }
        }.bind(this),
        function (data, status, headers, config) {
          console.debug('error');
        }
      );

    }
    /*Car.prototype.postCreate = function () {
      ServiceItem.getsByCar(null, function (items) {
        angular.forEach(items, function(item) {
          ServiceItem.createNew({
            car_id: this.id,
            name: item.name,
            type: item.type,
            mileage_period: item.mileage_period,
            time_period: item.time_period,
          }, function (new_item) {
            this.service_items.push(new_item);
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }*/

    Car.prototype.preDelete = function () {
      angular.forEach(this.service_records, function (record) {
        record.delete();
      }.bind(this));
      ServiceItem.getsByCar(this.id, function (items) {
        angular.forEach(items, function(item) {
          item.delete();
        });
      });
    }

    Car.prototype.getPic = function() {
      var brand_name = this.brandName();
      if (brand_name) {
        return 'img/brand/' + brand_name + '.jpg';
      } else {
        return 'img/brand/unknown.jpg';
      }
    };

    Car.prototype.lastUpdateDays = function() {
      var now = new Date().getTime();
      var period = now - this.last_update;
      return parseInt(period / (1000 * 3600 * 24));
    };
    Car.prototype.brandName = function() {
      if (this.brand) {
        return Brand.all()[this.brand].name;
      }
    };
    Car.prototype.statusSummary = function () {
      if (this.needsServiceItemCount() > 0) {
        return '您的爱车存在安全隐患';
      }
      if (this.lastUpdateDays() > CONSTANTS.days_for_warn_update_mileage) {
        return '需要更新里程表';
      }
      return '您的爱车目前状态良好';
    };
    Car.prototype.warningLevelForUpdateMileage = function() {
      return this.lastUpdateDays() > CONSTANTS.days_for_alert_update_mileage
        ? 'alert'
        : (this.lastUpdateDays() > CONSTANTS.days_for_warn_update_mileage) ? 'warning' : 'normal';
    };
    Car.prototype.lastService = function() {
      var last_service;
      for (var i = 0; i < this.service_records.length; i++) {
        if (!last_service) {
          last_service = this.service_records[i];
        } else {
          if (last_service.finish_time < this.service_records[i].finish_time) {
            last_service = this.service_records[i];
          }
        }
      }
      return last_service;
    };
    Car.prototype.needsServiceItemCount = function() {
      var count = 0;
      for (var i = 0; i < this.service_items.length; i++) {
        if (this.service_items[i].toNextService(this.mileage).status < 1) {
          count++;
        }
      }
      return count;
    };
    Car.prototype.warningCount = function() {
      var count = 0;
      if (this.lastUpdateDays() > 10) {
        count++;
      }
      if (this.needsServiceItemCount() > 0) {
        count++;
      }
      return count;
    }

    return Car;
  }])


  .factory('ServiceItem', ['TableRowBase', 'Util', 'ItemLastService', 'Item2Record', '$http', function(TableRowBase, Util, ItemLastService, Item2Record, $http) {
    function ServiceItem(data) {
      if (data) {
        this.setData(data);
      }
    };

    Util.inherit(ServiceItem, TableRowBase);
    ServiceItem._table_name = 'service_item';

    ServiceItem.preCreate = function (args) {
      if (!args.car_id) {
        args.car_id = 0;
      }
      if (!args.mileage_period) {
        args.mileage_period = 0;
      }
      if (!args.time_period) {
        args.time_period = 0;
      }
    };

    ServiceItem.getsByCar = function(car_id, cb) {
      this.getsByFields({'car_id': car_id}, cb);
    };

    ServiceItem.getsByRecord = function(record_id, cb) {

      Item2Record.getsByFields({'record_id': record_id}, function (objs) {
        var item_ids = [];
        angular.forEach(objs, function (obj) {
          item_ids.push(obj.item_id);
        });
        ServiceItem.getsByFields({'id': item_ids}, function (items) {
          if (cb) {
            cb(items);
          }
        })
      });
    };

    ServiceItem.prototype.getPic = function () {
      return 'img/service_item/' + ((this.type && this.type < 13) ? this.type : '0') + '.png';
    }

    ServiceItem.prototype.getStatusPic = function (current_mileage) {
      return 'img/service_item/status_' + this.toNextService(current_mileage).status + '.png';
    }

    ServiceItem.prototype.refreshLastService = function (cb) {
      ItemLastService.getsByFields({id: this.id}, function (res) {
        if(res.length > 0) {
          this.last_service_time = res[0].last_service_time;
          this.last_service_mileage = res[0].last_service_mileage;
          if (cb) {
            cb(this);
          }
        } else {
          // set bought_date to the last_service_time if there is no service record existing for one service item
          //this.last_service_mileage = 0;
          //this.last_service_time = null;
          var query_data = [];
          query_data['db_op_type'] = 'query';
          query_data['db_op_table_name'] = 'car';
          query_data['id'] = this.car_id;

          $http({
            url: CONSTANTS.db_operator_url,
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: query_data,
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
                return;
              } else {
                if (data.length > 0) {
                  this.last_service_mileage = 0;
                  this.last_service_time = data[0].bought_date;
                } else {
                  this.last_service_mileage = 0;
                  this.last_service_time = null;
                }
                if (cb) {
                  cb(this);
                }
              }

            }.bind(this))
            .error(function (data, status, headers, config) {
              console.debug('error');
              return;
            });
        }
      }.bind(this));
    };

    ServiceItem.prototype.toNextService = function (current_mileage) {
      var now = new Date().getTime();
      var days = 100000;
      var miles = 100000;
      if (this.time_period) {
        days = parseInt(((this.last_service_time ? this.last_service_time : 0) + this.time_period * 30 * 24 * 60 * 60 * 1000 - now) / (24 * 60 * 60 * 1000));
      }
      var time_status = (days > 30 ? 1 : (days > 0 ? 0 : -1));
      if (this.mileage_period) {
        miles = (this.last_service_mileage ? this.last_service_mileage : 0) + this.mileage_period - current_mileage;
      }
      var mileage_status = (miles > 500 ? 1 : (miles > 0 ? 0 : -1));
      return {
        'time': days,
        'time_status': time_status,
        'mileage': miles,
        'mileage_status': mileage_status,
        'status': Math.min(time_status, mileage_status),
      };
    };

    ServiceItem.prototype.serviceWarningText = function (current_mileage) {
      var status = this.toNextService(current_mileage);
      if (status.status > 0) {
        return '良好,暂不需要保养';
      } else if (status.status == 0) {
        return '距离下次保养' + (status.mileage_status == 0 ? (status.mileage + '公里' + (status.time_status == 0 ? (',' + status.time + '天') : '')) : (status.time + '天'));
      } else {
        var warning = '';
        if (status.mileage_status < 0) {
          warning += (-status.mileage + '公里');
        }
        if (status.time_status < 0) {
          warning += (warning == '' ? '' : ',');
          warning += (-status.time + '天');
        }
        return '已超过保养计划' + warning;
      }
    }

    ServiceItem.prototype.servicePeriodText = function () {
      var text = '无限制';
      if (this.mileage_period) {
        text = (this.mileage_period + '公里');
      }
      if (this.time_period) {
        text = ((text === '' ? text : text + '或') + this.time_period + '个月');
      }

      return text;
    }

    return ServiceItem;
  }])


  .factory('Item2Record', ['TableRowBase', 'Util', function (TableRowBase, Util) {
    function Item2Record(data) {
      if (data) {
        this.setData(data);
      }
    };

    Util.inherit(Item2Record, TableRowBase);
    Item2Record._table_name = 'item2record';

    return Item2Record;
  }])


  .factory('ServiceRecord', ['TableRowBase', 'ServiceItem', 'Item2Record', 'Util', function (TableRowBase, ServiceItem, Item2Record, Util) {
    function ServiceRecord(data) {
      if (data) {
        this.setData(data);
      }
      this.service_items = [];
 /*     ServiceItem.getsByRecord(this.id, function(items) {
        items.reduce(function(arr, item) {
          arr.push(item);
          return arr;
        }.bind(this), this.service_items);
      }.bind(this));*/
    };

    Util.inherit(ServiceRecord, TableRowBase);
    ServiceRecord._table_name = 'service_record';

    ServiceRecord.preCreate = function (args) {
      if (!args.add_time) {
        args.add_time = new Date().getTime();
      }
    }

    ServiceRecord.getsByCar = function(car_id, cb) {
      this.getsByFields({'car_id': car_id}, function (data) {
        var records = [];
        angular.forEach(angular.copy(data), function (record) {
          var objRecord = new ServiceRecord(record);
          records.push(objRecord);
        });
        if (cb) {
          cb(records);
        }
      });
    };

    ServiceRecord.prototype.preDelete = function() {
      Item2Record.getsByFields({'record_id': this.id}, function (arr_rel_items) {
        angular.forEach(arr_rel_items, function (item) {
          item.delete();
        });
      }.bind(this));
    };

    ServiceRecord.prototype.getItemByItemId = function(item_id) {
      for (var i = 0; i < this.service_items.length; i++) {
        if (this.service_items[i].id == item_id) {
          return this.service_items[i];
        }
      }
    }
    ServiceRecord.prototype.addServiceItem = function (item_id, cb) {
      Item2Record.createNew({'item_id': item_id, 'record_id': this.id}, function(item2record) {
        ServiceItem.getById(item_id, function (item) {
          this.service_items.push(item);
          if (cb) {
            cb(item);
          }
        }.bind(this));
      }.bind(this));
    }
    ServiceRecord.prototype.removeServiceItem = function (item_id, cb) {
      var item = this.getItemByItemId(item_id);
      if (item) {
        Item2Record.getsByFields({'record_id': this.id, 'item_id': item_id}, function (arr_item2record) {
          for (var i = 0; i < arr_item2record.length; i++) {
            arr_item2record[i].delete();
          }
          this.service_items.splice(this.service_items.indexOf(item), 1);
          if (cb) {
            cb(item);
          }
        }.bind(this));
      }
    }
    ServiceRecord.prototype.serviceItemsText = function () {
      var text = '';
      angular.forEach(this.service_items, function(item) {
        text += text === '' ? item.name : (', ' + item.name)
      });
      var count = this.service_items.length;
      return count ? (count + '项[' + text + ']') : '无保养项目';
    }
    return ServiceRecord;
  }])

  .factory('ItemLastService', ['TableRowBase', 'Util', function (TableRowBase, Util) {
    function ItemLastService(data) {
      if (data) {
        this.setData(data);
      }
    };

    Util.inherit(ItemLastService, TableRowBase);
    ItemLastService._table_name = 'item_last_service';

    return ItemLastService;
  }])


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

/**
 * Created by pge on 16/8/10.
 */
angular.module('popup', [])

.factory('Popup', [function () {
  return {
    /*Now args supports 'required', 'minlength', 'maxlength'*/
    generateSimpleInput: function($scope, value, args, cb_success) {
      $scope.form = {
        editForm: {}
      };
      $scope.tmpValue = {
        oldval: value,
        newval: value,
      };
      return {
        template:
        '<form name="form.editForm" novalidate>' +
        '<input type="' + (args['type'] ? args['type'] : 'text') + '" name="input" ' +
        (args['required'] ? 'required' : '') +
        (args['maxlength'] ? (' ng-maxlength="' + args['maxlength'] + '"') : '') +
        (args['minlength'] ? (' ng-minlength="' + args['minlength'] + '"') : '') +
        ' ng-model="tmpValue.newval">' +
        '<span style="color:red" ng-show="form.editForm.input.$dirty && form.editForm.input.$invalid">' +
        '<span ng-show="form.editForm.input.$error.required">不能为空</span>' +
        '<span ng-show="form.editForm.input.$error.number">请输入数字</span>' +
        '<span ng-show="form.editForm.input.$error.maxlength">输入超长</span>' +
        '<span ng-show="form.editForm.input.$error.minlength">长度不够</span>' +
        '</span>' +
        '</form>',
        scope: $scope,
        buttons: [
          {
            text: 'Cancel',
          },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if ($scope.form.editForm.input.$invalid) {
                e.preventDefault();
              } else {
                if ($scope.tmpValue.oldval !== $scope.tmpValue.newval) {
                  cb_success($scope.tmpValue.oldval, $scope.tmpValue.newval);
                }
              }

            },
          }
        ]
      }
    },
    generateError: function(error) {
      return {
        title: '错误',
        template:'<div>' + error + '</div>',
        buttons: [
          {
            type: 'button-positive',
            text: 'OK',
          },
        ]
      }
    },
  }
}])

/**
 * Created by pge on 16/8/5.
 */
angular.module('util', ['popup'])

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
      showConfirm: function (confirm_text, fn_cb) {
        var confirmPopup = $ionicPopup.confirm({
          title: '确认',
          template: confirm_text
        });
        confirmPopup.then(function(res) {
          if (fn_cb) {
            fn_cb(res);
          }
        });
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
