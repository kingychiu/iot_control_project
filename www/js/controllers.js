angular.module('controlApp.controllers', [])

  .controller('DashCtrl', function ($scope, Devices, $ionicPlatform) {
    $scope.devices = Devices.all();
    $scope.showing = false;
    $scope.showDetail = function(deviceID){
      $scope.showing = true;
      $scope.selectedDevice = Devices.get(deviceID);
    };

    $scope.hideDetail = function(){
      $scope.showing = false;
    };

    $scope.back = function(){
      console.log('back');
      $scope.$apply(function () {
        $scope.hideDetail();
      });
    };

    $ionicPlatform.onHardwareBackButton($scope.back);

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
