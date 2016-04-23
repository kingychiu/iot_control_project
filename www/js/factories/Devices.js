angular.module('controlApp.DevicesFactory', [])
  .factory('Devices', function ($http, $q) {
    var colors = ['#b4fb29', '#358dd6', '#c7054e', '#a0aaff'];

    function getColor(id) {
      return colors[id % colors.length]
    }

    var devices = []
    //var devices = [{
    //  id: 0,
    //  name: 'Washroom Module',
    //  updateDate: '2016-10-10',
    //  color: getColor(0),
    //  data: [
    //    {name: 'temperature', value: 0},
    //    {name: 'humanity', value: 0},
    //    {name: 'fanspeed', value: 0},
    //  ],
    //  extra: [],
    //  controls: [
    //    {name: 'Fan Speed', type: 'value', value: 0},
    //    {name: 'Door Lock', type: 'toggle', value: 0},
    //  ]
    //}, {
    //  id: 1,
    //  name: 'Security Module',
    //  updateDate: '2016-10-10',
    //  color: getColor(1),
    //  data: [],
    //  extra: [
    //    {type: 'Photos', value: 'https://events.google.com/io2016/images/io16-social.jpg', time: '11:50'},
    //    {type: 'Photos', value: 'https://events.google.com/io2016/images/io16-social.jpg', time: '11:50'},
    //    {type: 'Photos', value: 'https://events.google.com/io2016/images/io16-social.jpg', time: '11:50'},
    //    {
    //      type: 'Photos',
    //      value: 'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg',
    //      time: '11:50'
    //    },
    //    {
    //      type: 'Photos',
    //      value: 'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg',
    //      time: '11:50'
    //    },
    //    {
    //      type: 'Photos',
    //      value: 'http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg',
    //      time: '11:50'
    //    },
    //  ],
    //  controls: []
    //}, {
    //  id: 2,
    //  name: 'Power Monitor Module',
    //  updateDate: '2016-10-10',
    //  color: getColor(2),
    //  data: [],
    //  extra: [],
    //  controls: []
    //}, {
    //  id: 3,
    //  name: 'Lighting Module',
    //  updateDate: '2016-10-10',
    //  color: getColor(3),
    //  data: [],
    //  extra: [],
    //  controls: []
    //}
    //];

    return {
      all: function () {
        return devices;
      },
      remove: function (d) {
        devices.splice(devices.indexOf(chat), 1);
      },
      get: function (id) {
        return (_.find(devices, function (item) {
          return item.id === id;
        }))
      },
      postDeviceControl: function (status_id, payload, callback) {
        $http.post('http://192.168.1.8:3000/apis/user/1/status/' + status_id, payload).then(callback);
      },
      enableAuto: function (status_id, callback) {
        $http.get('http://192.168.1.8:3000/apis//user/1/status/' + status_id + '/auto').then(callback);
      },
      getDeviceFromServer: function () {
        var handler = function () {
          $http.get('http://192.168.1.8:3000/apis/user/1/devices').then(
            function (res) {
              devices = [];
              var devicesFromServer = res.data.msg;
              for (var i = 0; i < devicesFromServer.length; i++) {
                var id = devicesFromServer[i].device_id;
                var name = devicesFromServer[i].name;
                $http.get('http://192.168.1.8:3000/apis/device/' + id + '/status').then(
                  function (res) {
                    var status = res.data.msg;
                    if (_.isEmpty(status))
                      return;
                    var updateDate = status[0].last_update;
                    var text = _.filter(status, function (item) {
                      return item.type == 'text';
                    });
                    var graph = _.filter(status, function (item) {
                      return item.type == 'graph';
                    });
                    var image = _.filter(status, function (item) {
                      return item.type == 'image';
                    });

                    var control = _.filter(status, function (item) {
                      return item.can_control == 1;
                    });
                    //console.log(JSON.stringify(control[0]));

                    devices.push({
                      id: id,
                      name: name,
                      updateDate: updateDate,
                      color: getColor(id),
                      status: text,
                      graphData: graph,
                      image: image,
                      controls: control,
                    });
                  }, function (err) {

                  }
                );
              }
            }, function (err) {
              console.log('err');
            });
        };
        return $q.all(handler());
      }
    }

  });
