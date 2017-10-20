angular.module('car.controllers')
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
