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
