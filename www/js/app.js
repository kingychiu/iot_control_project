angular.module('controlApp',
  [
    'ionic',
    'nvd3',
    'controlApp.controllers',
    // Factories
    'controlApp.DevicesFactory',
    'controlApp.GraphFactory',
    'controlApp.services'
  ])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
    $ionicPlatform.registerBackButtonAction(function (e) {
      //do your stuff
      e.preventDefault();
      return false;
    }, 101);
  })

  .config(function ($stateProvider, $urlRouterProvider) {

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

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })
      .state('tab.control', {
        url: '/control',
        views: {
          'tab-control': {
            templateUrl: 'templates/tab-control.html',
            controller: 'ControlCtrl'
          }
        }
      })
      .state('tab.setting', {
        url: '/setting',
        views: {
          'tab-setting': {
            templateUrl: 'templates/tab-setting.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  });
