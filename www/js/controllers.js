angular.module('controlApp.controllers', [])

  .controller('DashCtrl', function ($scope, Devices, Graph, $ionicPlatform, $interval) {
    $scope.devices = Devices.all();
    $scope.showing = false;
    $scope.showDetail = function (deviceID) {
      $scope.showing = true;
      $scope.selectedDevice = Devices.get(deviceID);
      for (var i = 0; i < $scope.selectedDevice.data.length; i++) {
        $scope.data[i] = {values: [], key: $scope.selectedDevice.data[i].name, area: true};
      }
    };

    $scope.hideDetail = function () {
      $scope.showing = false;
      $scope.selectedDevice = null;
      $scope.data = [];
      $scope.count = 0;
    };

    $scope.back = function () {
      console.log('back');
      $scope.$apply(function () {
        $scope.hideDetail();
      });
    };

    $ionicPlatform.onHardwareBackButton($scope.back);

    $scope.data = [];
    $scope.options = Graph.options;

    $scope.count = 0;
    $scope.updateGraph = function () {
      if (!$scope.selectedDevice) {
        return;
      }
      $scope.selectedDevice = Devices.get($scope.selectedDevice.id);
      for (var i = 0; i < $scope.selectedDevice.data.length; i++) {
        $scope.data[i].values.push({
          x: $scope.count,
          y: $scope.selectedDevice.data[i].value
        });
        if ($scope.data[i].values.length > 6) $scope.data[i].values.shift();
      }
      $scope.count++;
      if($scope.api) $scope.api.update();
    };

    $interval($scope.updateGraph, 1000);


    $scope.chartReady = function (scope, element) {
      console.log('chartReady');
      $scope.api = scope.api;
    };

    $scope.hasExtra = function (t) {
      return !(_.isEmpty(t));
    }

  })

  .controller('ControlCtrl', function ($scope, Chats, Devices, $ionicPlatform) {
    $scope.devices = Devices.all();
    $scope.showing = false;
    $scope.controlValues = [];
    $scope.showDetail = function (deviceID) {
      $scope.showing = true;
      $scope.selectedDevice = Devices.get(deviceID);
      for (var i = 0; i < $scope.selectedDevice.controls.length; i++) {
        $scope.controlValues[i] = 0;
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
  })
  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
