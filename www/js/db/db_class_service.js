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

