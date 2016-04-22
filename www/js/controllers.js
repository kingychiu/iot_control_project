angular.module('controlApp.controllers', [])

  .controller('DashCtrl', function ($scope, Devices, Graph, $ionicPlatform, $interval) {
    $scope.devices = Devices.all();
    $scope.showing = false;
    $scope.showDetail = function (deviceID) {
      $scope.showing = true;
      $scope.selectedDevice = Devices.get(deviceID);
      for(var i = 0; i < $scope.selectedDevice.data.length; i++) {
        $scope.data[i] = { values: [], key: $scope.selectedDevice.data[i].name };
      }
    };

    $scope.hideDetail = function () {
      $scope.showing = false;
      $scope.selectedDevice = null;
      $scope.data = [];
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

    var count = 0;
    $scope.updateGraph = function () {
      if (!$scope.selectedDevice) {
        return;
      }
      console.log('update');
      $scope.selectedDevice = Devices.get($scope.selectedDevice.id);
      for(var i = 0; i < $scope.selectedDevice.data.length; i++){
        $scope.data[i].values.push({
          x: count,
          y: $scope.selectedDevice.data[i].value
        });
        if ($scope.data[i].values.length > 5) $scope.data[i].values.shift();
      }
      count ++;
      $scope.api.update();
    };

    $interval($scope.updateGraph, 1000);


    $scope.chartReady = function (scope, element) {
      console.log('chartReady');
      $scope.api = scope.api;
      $scope.api.refresh();
    };

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
