angular.module('controlApp.controllers', [])

  .controller('DashCtrl', function ($scope, Devices, Graph, $ionicPlatform, $interval) {
    $scope.devices = Devices.all();
    $scope.showing = false;
    $scope.showDetail = function (deviceID) {
      $scope.showing = true;
      $scope.selectedDevice = Devices.get(deviceID);
      for (var i = 0; i < $scope.selectedDevice.graphData.length; i++) {
        $scope.graphData[i] = {values: [], key: $scope.selectedDevice.graphData[i].name};
      }
    };

    $scope.hideDetail = function () {
      $scope.showing = false;
      $scope.selectedDevice = null;
      $scope.graphData = [];
      $scope.count = 0;
    };

    $scope.back = function () {
      console.log('back');
      $scope.$apply(function () {
        $scope.hideDetail();
      });
    };

    $ionicPlatform.onHardwareBackButton($scope.back);

    $scope.graphData = [];
    $scope.options = Graph.options;

    $scope.count = 0;
    $scope.updateGraph = function () {
      if (!$scope.selectedDevice) return;
      $scope.selectedDevice = Devices.get($scope.selectedDevice.id);
      if (!$scope.selectedDevice) return;

      for (var i = 0; i < $scope.selectedDevice.graphData.length; i++) {
        $scope.graphData[i].values.push({
          x: $scope.count,
          y: $scope.selectedDevice.graphData[i].value
        });
        if ($scope.graphData[i].values.length > 6) $scope.graphData[i].values.shift();
      }
      $scope.count++;
      if ($scope.api) $scope.api.update();
    };


    $scope.updateList = function () {
      var diff = Date.now() - Devices.getLastCall();
      if (diff < 800) {
        $scope.devices = Devices.all();
        $scope.updateGraph();
        return;
      }
      Devices.getDeviceFromServer().then(function (data) {
        //console.log('resolved');
        $scope.devices = Devices.all();
        $scope.updateGraph();
      })
    };

    $scope.ajaxWork = $interval($scope.updateList, 1000);

    $scope.chartReady = function (scope, element) {
      console.log('chartReady');
      $scope.api = scope.api;
    };

    $scope.isEmpty = function (t) {
      return _.isEmpty(t);
    };


  })

  .controller('ControlCtrl', function ($scope, Chats, Devices, $ionicPlatform, $interval) {
    $scope.devices = Devices.all();
    $scope.showing = false;
    $scope.autoMode = false;
    $scope.controlValues = [];
    $scope.submitStage = 0;
    $scope.submitText = "Submit";
    $scope.showDetail = function (deviceID) {
      $scope.showing = true;
      $scope.selectedDevice = Devices.get(deviceID);
      $scope.autoMode = (_.isEmpty($scope.selectedDevice.controls)
      || $scope.selectedDevice.controls[0].control_flag == 0) ? true : false;
      console.log($scope.autoMode);
      for (var i = 0; i < $scope.selectedDevice.controls.length; i++) {
        $scope.controlValues[$scope.selectedDevice.controls[i].status_id] = 0;
      }
    };

    $scope.toggleAuto = function () {
      $scope.autoMode = !$scope.autoMode;
      if ($scope.autoMode) {
        $scope.submitStage = 2;
      }
    };

    $scope.hideDetail = function () {
      $scope.showing = false;
      $scope.selectedDevice = null;
      $scope.controlValues = [];
    };
    $scope.back = function () {
      console.log('back');
      $scope.$apply(function () {
        $scope.hideDetail();
      });
    };
    $ionicPlatform.onHardwareBackButton($scope.back);

    $scope.rangeUpdate = function (index) {
      console.log(index);
      console.log($scope.controlValues[index]);
    };

    $scope.submit = function () {
      if ($scope.submitStage == 0) {
        $scope.submitText = 'Loading';
        $scope.submitStage = 1;
        for (var i = 0; i < $scope.selectedDevice.controls.length; i++) {
          var idx = $scope.selectedDevice.controls[i].status_id;
          console.log($scope.controlValues[idx]);
          Devices.postDeviceControl(idx, {status: $scope.controlValues[idx]}, function () {
            $scope.submitText = "Submit";
            $scope.submitStage = 0;
          });
        }
      } else if ($scope.submitStage == 1) {
        return;
      } else if ($scope.submitStage == 2) {
        for (var i = 0; i < $scope.selectedDevice.controls.length; i++) {
          var idx = $scope.selectedDevice.controls[i].status_id;
          Devices.enableAuto(idx, function () {
            $scope.submitStage = 2;
            $scope.submitText = "Submit";
          });
        }
      }

    };

    $scope.updateList = function () {
      var diff = Date.now() - Devices.getLastCall();
      if (diff < 800) {
        $scope.devices = Devices.all();
        return;
      }
      Devices.getDeviceFromServer().then(function (data) {
        //console.log('resolved');
        $scope.devices = Devices.all();
      })
    };

    $scope.ajaxWork = $interval($scope.updateList, 1000);
  })
  .controller('SettingCtrl', function ($scope, Devices, $interval, $ionicPopup) {
    $scope.devices = [];
    $scope.remove = function (device_id) {
      console.log('remove:' + device_id);
      Devices.deleteUserDevice(device_id, function () {
        console.log('removed');
      });
    };
    $scope.updateList = function () {
      var diff = Date.now() - Devices.getLastCall();
      if (diff < 800) {
        $scope.devices = Devices.all();
        return;
      }
      Devices.getDeviceFromServer().then(function (data) {
        //console.log('resolved');
        $scope.devices = Devices.all();
      })
    };

    $scope.ajaxWork = $interval($scope.updateList, 1000);
    $scope.addDevice = function () {
      $scope.data = {};
      var popup = $ionicPopup.show({
        template: '<input type="number" ng-model="data.id">',
        title: 'Has a new module?',
        subTitle: 'Please enter device ID',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Add</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.id) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.id;
              }
            }
          }
        ]
      });
      popup.then(function (id) {
        console.log(id);
        Devices.addUserDevice(id);
      });
    }

  });
