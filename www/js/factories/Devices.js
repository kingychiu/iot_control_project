angular.module('controlApp.DevicesFactory', [])
  .factory('Devices', function ($http, $q) {
    var colors = ['#b4fb29', '#358dd6', '#c7054e', '#a0aaff'];

    function getColor(id) {
      return colors[id % colors.length]
    }

    var base = 'http://192.168.1.8:3000';
    //var base = 'http://192.168.1.19:3000';
    var devices = [];
    var lastCall = 0;
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
        $http.post(base + '/apis/user/1/status/' + status_id, payload).then(callback);
      },
      deleteUserDevice: function (device_id, callback) {
        $http.delete(base + '/apis/user/1/devices/' + device_id).then(callback);
      },
      addUserDevice: function (device_id, callback) {
        $http.post(base + '/apis/user/1/devices/' + device_id).then(callback);
      },
      enableAuto: function (status_id, callback) {
        $http.get(base + '/apis/user/1/status/' + status_id + '/auto').then(callback);
      },
      getLastCall: function () {
        return lastCall;
      },
      getDeviceFromServer: function () {
        lastCall = Date.now();
        var handler = function () {
          $http.get(base + '/apis/user/1/devices').then(
            function (res) {
              devices = [];
              var devicesFromServer = res.data.msg;
              angular.forEach(devicesFromServer, function (d, key) {
                var id = d.device_id;
                var name = d.name;
                $http.get(base + '/apis/device/' + id + '/status').then(
                  function (res) {
                    var status = res.data.msg;
                    if (_.isEmpty(status))
                      return;
                    var updateDate= moment(status[0].last_update).tz('Asia/Hong_Kong').format();
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

                    if (!_.isEmpty(image)) {
                      // get image from server
                      $http.get(base + '/apis/device/' + id + '/status/' + image[0].status_id + '/image').then(
                        function (res) {
                         // console.log(JSON.stringify(res.data.msg));

                          res.data.msg.date= moment(res.data.msg.date).tz('Asia/Hong_Kong').format();
                          devices.push({
                            id: id,
                            name: name,
                            updateDate: updateDate,
                            color: getColor(id),
                            status: text,
                            graphData: graph,
                            image: res.data.msg,
                            controls: control,
                          });
                        }
                      );
                    } else {
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
                    }
                    //console.log(JSON.stringify(control[0]));


                  }, function (err) {

                  }
                );
              });
            }, function (err) {
              console.log('err');
            });
        };
        return $q.all(handler());
      }
    }

  });
