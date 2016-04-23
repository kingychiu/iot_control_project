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
      Devices.getDeviceFromServer().then(function (data) {
        //console.log('resolved');
        $scope.devices = Devices.all();
        $scope.updateGraph();
      })
    };

    $interval($scope.updateList, 1000);

    $scope.chartReady = function (scope, element) {
      console.log('chartReady');
      $scope.api = scope.api;
    };

    $scope.isEmpty = function (t) {
      return _.isEmpty(t);
    }

  })

  .controller('ControlCtrl', function ($scope, Chats, Devices, $ionicPlatform) {
    $scope.devices = Devices.all();
    $scope.showing = false;
    $scope.autoMode = false;
    $scope.controlValues = [];
    $scope.showDetail = function (deviceID) {
      $scope.showing = true;
      $scope.selectedDevice = Devices.get(deviceID);
      $scope.autoMode = (_.isEmpty($scope.selectedDevice.controls)
      || $scope.selectedDevice.controls[0].control_flag == 1) ? true : false;
      console.log($scope.autoMode);
      for (var i = 0; i < $scope.selectedDevice.controls.length; i++) {
        $scope.controlValues[$scope.selectedDevice.controls[i].status_id] = 0;
      }
    };

    $scope.toggleAuto = function(){
      $scope.autoMode = !$scope.autoMode;
      if($scope.autoMode){
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
            $scope.submitStage = 0;
            $scope.submitText = "Submit";
          });
        }
      }

    };
    $scope.submitStage = 0;
    $scope.submitText = "Submit";
  })
  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
