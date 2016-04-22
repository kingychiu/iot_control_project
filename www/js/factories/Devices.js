angular.module('controlApp.DevicesFactory', [])
  .factory('Devices', function () {
    var colors = ['#b4fb29', '#358dd6', '#c7054e', '#a0aaff'];

    function getColor(id){
      return colors[id%colors.length]
    }

    var devices = [{
      id: 0,
      name: 'Washroom Module',
      updateDate: '2016-10-10',
      color: getColor(0)
    }, {
      id: 1,
      name: 'Security Module',
      updateDate: '2016-10-10',
      color: getColor(1)
    }, {
      id: 2,
      name: 'Power Monitor Module',
      updateDate: '2016-10-10',
      color: getColor(2)
    }, {
      id: 3,
      name: 'Lighting Module',
      updateDate: '2016-10-10',
      color: getColor(3)
    }
    ];

    return {
      all: function () {
        return devices;
      },
      remove: function (d) {
        devices.splice(devices.indexOf(chat), 1);
      },
      get: function (id) {
        for (var i = 0; i < devices.length; i++) {
          if (devices[i].id === parseInt(id)) {
            return devices[i];
          }
        }
        return null;
      }
    };
  });
